#!/usr/bin/env python3

import json
import os
import pathlib
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone


ROOT = pathlib.Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
BOOK_PATH = DATA_DIR / "book.json"
NOW_PATH = DATA_DIR / "now.json"

CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")
REFRESH_TOKEN = os.environ.get("SPOTIFY_REFRESH_TOKEN")
TOP_TIME_RANGE = os.environ.get("SPOTIFY_TOP_TIME_RANGE", "short_term")
MAX_ATTEMPTS = 3
MAX_RETRY_DELAY_SECONDS = 30


class SpotifyRequestError(RuntimeError):
    def __init__(self, message, status_code=None, endpoint=None):
        super().__init__(message)
        self.status_code = status_code
        self.endpoint = endpoint


class PayloadValidationError(ValueError):
    pass


def read_json(path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path, payload):
    text = json.dumps(payload, indent=2, ensure_ascii=True) + "\n"
    temporary_path = None
    try:
        with tempfile.NamedTemporaryFile(
            "w", encoding="utf-8", dir=path.parent, prefix=f".{path.name}.", delete=False
        ) as handle:
            temporary_path = pathlib.Path(handle.name)
            handle.write(text)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary_path, path)
    except Exception:
        if temporary_path is not None:
            temporary_path.unlink(missing_ok=True)
        raise


def require_env():
    missing = [
        name
        for name, value in (
            ("SPOTIFY_CLIENT_ID", CLIENT_ID),
            ("SPOTIFY_CLIENT_SECRET", CLIENT_SECRET),
            ("SPOTIFY_REFRESH_TOKEN", REFRESH_TOKEN),
        )
        if not value
    ]
    if missing:
        raise SystemExit(f"Missing required environment variables: {', '.join(missing)}")


def retry_delay(headers, attempt):
    retry_after = headers.get("Retry-After") if headers else None
    if retry_after:
        try:
            return min(MAX_RETRY_DELAY_SECONDS, max(0, int(retry_after)))
        except ValueError:
            pass
    return min(MAX_RETRY_DELAY_SECONDS, 2 ** (attempt + 1))


def request_json(request):
    for attempt in range(MAX_ATTEMPTS):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            retryable = exc.code == 429 or 500 <= exc.code < 600
            if retryable and attempt + 1 < MAX_ATTEMPTS:
                delay = retry_delay(exc.headers, attempt)
                print(f"Spotify HTTP {exc.code}; retrying in {delay}s (attempt {attempt + 2}/{MAX_ATTEMPTS}).")
                time.sleep(delay)
                continue
            raise SpotifyRequestError(
                f"Spotify request failed with HTTP {exc.code}: {body}",
                status_code=exc.code,
                endpoint=request.full_url,
            ) from exc
        except urllib.error.URLError as exc:
            if attempt + 1 < MAX_ATTEMPTS:
                delay = retry_delay(None, attempt)
                print(f"Spotify network error; retrying in {delay}s (attempt {attempt + 2}/{MAX_ATTEMPTS}).")
                time.sleep(delay)
                continue
            raise SpotifyRequestError(f"Spotify request failed: {exc.reason}") from exc
        except json.JSONDecodeError as exc:
            raise SpotifyRequestError("Spotify returned invalid JSON.") from exc

    raise SpotifyRequestError("Spotify request failed after all retry attempts.")


def post_form(url, form_data):
    encoded = urllib.parse.urlencode(form_data).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=encoded,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    return request_json(request)


def spotify_get(path, access_token, params=None):
    query = "?" + urllib.parse.urlencode(params) if params else ""
    request = urllib.request.Request(
        f"https://api.spotify.com/v1/{path}{query}",
        headers={"Authorization": f"Bearer {access_token}"},
        method="GET",
    )
    return request_json(request)


def get_access_token():
    payload = post_form(
        "https://accounts.spotify.com/api/token",
        {
            "grant_type": "refresh_token",
            "refresh_token": REFRESH_TOKEN,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        },
    )
    token = payload.get("access_token") if isinstance(payload, dict) else None
    if not token:
        raise PayloadValidationError("Spotify token response did not include an access_token.")
    return token


def response_items(payload, label):
    items = payload.get("items") if isinstance(payload, dict) else None
    if not isinstance(items, list) or not all(isinstance(item, dict) for item in items):
        raise PayloadValidationError(f"Spotify {label} response did not include a valid items list.")
    return items


def fetch_items(path, access_token, params, label, fallback_items):
    try:
        return response_items(spotify_get(path, access_token, params), label), False
    except SpotifyRequestError as exc:
        if exc.status_code != 403:
            raise
        if fallback_items is None:
            raise PayloadValidationError(
                f"Spotify {label} endpoint is forbidden and has no cached data to preserve."
            ) from exc
        print(
            f"Spotify {label} endpoint returned HTTP 403; preserving its last valid data and retrying later."
        )
        return fallback_items, True


def map_recent_track(item):
    track = item.get("track") or {}
    album = track.get("album") or {}
    artists = track.get("artists") or []
    return {
        "name": track.get("name"),
        "artistNames": [artist.get("name") for artist in artists if artist.get("name")],
        "albumName": album.get("name"),
        "playedAt": item.get("played_at"),
        "url": (track.get("external_urls") or {}).get("spotify"),
        "albumImageUrl": next(
            (image.get("url") for image in album.get("images") or [] if image.get("url")),
            None,
        ),
    }


def map_top_track(item):
    artists = item.get("artists") or []
    return {
        "name": item.get("name"),
        "artistNames": [artist.get("name") for artist in artists if artist.get("name")],
        "url": (item.get("external_urls") or {}).get("spotify"),
    }


def map_top_artist(item):
    return {
        "name": item.get("name"),
        "genres": item.get("genres") or [],
        "url": (item.get("external_urls") or {}).get("spotify"),
    }


def validate_payload(payload):
    if not isinstance(payload, dict):
        raise PayloadValidationError("Now payload must be an object.")
    try:
        updated_at = datetime.fromisoformat(payload["updatedAt"].replace("Z", "+00:00"))
    except (KeyError, AttributeError, TypeError, ValueError) as exc:
        raise PayloadValidationError("Now payload has an invalid updatedAt timestamp.") from exc
    if updated_at.tzinfo is None:
        raise PayloadValidationError("Now payload updatedAt must include a timezone.")

    book = payload.get("book")
    if not isinstance(book, dict) or not {"title", "author"}.issubset(book):
        raise PayloadValidationError("Now payload has an invalid book object.")

    spotify = payload.get("spotify")
    if not isinstance(spotify, dict) or not isinstance(spotify.get("topTimeRange"), str):
        raise PayloadValidationError("Now payload has an invalid spotify object.")
    for key in ("recentTracks", "topTracks", "topArtists"):
        if not isinstance(spotify.get(key), list) or not all(isinstance(item, dict) for item in spotify[key]):
            raise PayloadValidationError(f"Now payload has an invalid {key} list.")


def build_payload():
    require_env()
    access_token = get_access_token()
    book = read_json(BOOK_PATH)
    try:
        previous_spotify = read_json(NOW_PATH).get("spotify", {})
    except (OSError, TypeError, json.JSONDecodeError):
        previous_spotify = {}

    recent, recent_fallback = fetch_items(
        "me/player/recently-played",
        access_token,
        {"limit": 5},
        "recently played",
        previous_spotify.get("recentTracks"),
    )
    top_tracks, top_tracks_fallback = fetch_items(
        "me/top/tracks",
        access_token,
        {"limit": 5, "time_range": TOP_TIME_RANGE},
        "top tracks",
        previous_spotify.get("topTracks"),
    )
    top_artists, top_artists_fallback = fetch_items(
        "me/top/artists",
        access_token,
        {"limit": 5, "time_range": TOP_TIME_RANGE},
        "top artists",
        previous_spotify.get("topArtists"),
    )

    if recent_fallback and top_tracks_fallback and top_artists_fallback:
        raise SpotifyRequestError("All Spotify data endpoints were forbidden; preserving the previous widget data.")

    payload = {
        "updatedAt": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "book": {"title": book.get("title"), "author": book.get("author")},
        "spotify": {
            "topTimeRange": TOP_TIME_RANGE,
            "recentTracks": [map_recent_track(item) for item in recent],
            "topTracks": [map_top_track(item) for item in top_tracks],
            "topArtists": [map_top_artist(item) for item in top_artists],
        },
    }
    validate_payload(payload)
    return payload


def main():
    try:
        payload = build_payload()
        write_json(NOW_PATH, payload)
    except (SpotifyRequestError, PayloadValidationError, OSError, json.JSONDecodeError) as exc:
        raise SystemExit(str(exc)) from exc

    print(f"Updated {NOW_PATH}")


if __name__ == "__main__":
    main()
