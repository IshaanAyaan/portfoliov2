import io
import json
import pathlib
import sys
import tempfile
import unittest
import urllib.error
from unittest import mock


ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import update_now


class FakeResponse:
    def __init__(self, payload):
        self.payload = json.dumps(payload).encode("utf-8")

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def read(self):
        return self.payload


def http_error(code, body=b"temporary", headers=None):
    return urllib.error.HTTPError(
        "https://api.spotify.test", code, "error", headers or {}, io.BytesIO(body)
    )


class SpotifyUpdaterTests(unittest.TestCase):
    def test_rate_limit_honors_capped_retry_after_then_succeeds(self):
        with mock.patch.object(
            update_now.urllib.request,
            "urlopen",
            side_effect=[http_error(429, headers={"Retry-After": "99"}), FakeResponse({"items": []})],
        ), mock.patch.object(update_now.time, "sleep") as sleep:
            result = update_now.request_json(urllib.request.Request("https://api.spotify.test"))
        self.assertEqual(result, {"items": []})
        sleep.assert_called_once_with(update_now.MAX_RETRY_DELAY_SECONDS)

    def test_server_failure_exhausts_three_attempts(self):
        with mock.patch.object(
            update_now.urllib.request,
            "urlopen",
            side_effect=[http_error(503), http_error(503), http_error(503)],
        ), mock.patch.object(update_now.time, "sleep") as sleep:
            with self.assertRaisesRegex(update_now.SpotifyRequestError, "HTTP 503"):
                update_now.request_json(urllib.request.Request("https://api.spotify.test"))
        self.assertEqual(sleep.call_count, 2)

    def test_network_failure_retries_then_succeeds(self):
        with mock.patch.object(
            update_now.urllib.request,
            "urlopen",
            side_effect=[urllib.error.URLError("offline"), FakeResponse({"ok": True})],
        ), mock.patch.object(update_now.time, "sleep"):
            result = update_now.request_json(urllib.request.Request("https://api.spotify.test"))
        self.assertEqual(result, {"ok": True})

    def test_malformed_spotify_response_is_rejected(self):
        with self.assertRaisesRegex(update_now.PayloadValidationError, "items list"):
            update_now.response_items({"items": "not-a-list"}, "top tracks")

    def test_atomic_write_produces_valid_json(self):
        payload = {
            "updatedAt": "2026-07-20T19:00:00+00:00",
            "book": {"title": "Example", "author": "Author"},
            "spotify": {
                "topTimeRange": "short_term",
                "recentTracks": [],
                "topTracks": [],
                "topArtists": [],
            },
        }
        with tempfile.TemporaryDirectory() as directory:
            path = pathlib.Path(directory) / "now.json"
            update_now.write_json(path, payload)
            self.assertEqual(json.loads(path.read_text(encoding="utf-8")), payload)
            self.assertEqual(list(path.parent.glob(".now.json.*")), [])

    def test_failed_refresh_preserves_existing_file(self):
        with tempfile.TemporaryDirectory() as directory:
            path = pathlib.Path(directory) / "now.json"
            original = '{"existing": true}\n'
            path.write_text(original, encoding="utf-8")
            with mock.patch.object(update_now, "NOW_PATH", path), mock.patch.object(
                update_now, "build_payload", side_effect=update_now.SpotifyRequestError("offline")
            ):
                with self.assertRaisesRegex(SystemExit, "offline"):
                    update_now.main()
            self.assertEqual(path.read_text(encoding="utf-8"), original)

    def test_payload_validation_requires_compatible_shape(self):
        with self.assertRaisesRegex(update_now.PayloadValidationError, "topArtists"):
            update_now.validate_payload({
                "updatedAt": "2026-07-20T19:00:00+00:00",
                "book": {"title": "Example", "author": "Author"},
                "spotify": {
                    "topTimeRange": "short_term",
                    "recentTracks": [],
                    "topTracks": [],
                },
            })


if __name__ == "__main__":
    unittest.main()
