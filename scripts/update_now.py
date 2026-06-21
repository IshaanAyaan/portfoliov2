#!/usr/bin/env python3

import json
import os
import pathlib
import sys
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


def read_json(path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path, payload):
    text = json.dumps(payload, indent=2, ensure_ascii=True) + "\n"
    with path.open("w", encoding="utf-8") as handle:
        handle.write(text)


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
        joined = ", ".join(missing)
        raise SystemExit(f"Missing required environment variables: {joined}")


def post_form(url, form_data):
    encoded = urllib.parse.urlencode(form_data).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=encoded,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def spotify_get(path, access_token, params=None):
    query = ""
    if params:
        query = "?" + urllib.parse.urlencode(params)

    request = urllib.request.Request(
        f"https://api.spotify.com/v1/{path}{query}",
        headers={"Authorization": f"Bearer {access_token}"},
        method="GET",
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


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
    token = payload.get("access_token")
    if not token:
        raise SystemExit("Spotify token response did not include an access_token.")
    return token


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
    album = item.get("album") or {}
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


def build_payload():
    require_env()
    access_token = get_access_token()
    book = read_json(BOOK_PATH)

    recent = spotify_get("me/player/recently-played", access_token, {"limit": 5})
    top_tracks = spotify_get(
        "me/top/tracks",
        access_token,
        {"limit": 5, "time_range": TOP_TIME_RANGE},
    )
    top_artists = spotify_get(
        "me/top/artists",
        access_token,
        {"limit": 5, "time_range": TOP_TIME_RANGE},
    )

    return {
        "updatedAt": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "book": {
            "title": book.get("title"),
            "author": book.get("author"),
        },
        "spotify": {
            "topTimeRange": TOP_TIME_RANGE,
            "recentTracks": [map_recent_track(item) for item in recent.get("items", [])],
            "topTracks": [map_top_track(item) for item in top_tracks.get("items", [])],
            "topArtists": [map_top_artist(item) for item in top_artists.get("items", [])],
        },
    }


def main():
    try:
        payload = build_payload()
    except urllib.error.HTTPError as exc:
        message = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"Spotify request failed with HTTP {exc.code}: {message}") from exc
    except urllib.error.URLError as exc:
        raise SystemExit(f"Spotify request failed: {exc.reason}") from exc

    write_json(NOW_PATH, payload)
    print(f"Updated {NOW_PATH}")


if __name__ == "__main__":
    main()
