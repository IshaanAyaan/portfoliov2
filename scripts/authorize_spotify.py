#!/usr/bin/env python3

import json
import os
import threading
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer


CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.environ.get("SPOTIFY_REDIRECT_URI", "http://127.0.0.1:8787/callback")
SCOPES = os.environ.get(
    "SPOTIFY_SCOPES",
    "user-read-recently-played user-top-read user-library-read",
)


def require_env():
    if not CLIENT_ID or not CLIENT_SECRET:
        raise SystemExit("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET before running this script.")


def exchange_code(code):
    data = urllib.parse.urlencode(
        {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": REDIRECT_URI,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        "https://accounts.spotify.com/api/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def main():
    require_env()
    result = {}
    ready = threading.Event()

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            parsed = urllib.parse.urlparse(self.path)
            if parsed.path != "/callback":
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"Not found")
                return

            query = urllib.parse.parse_qs(parsed.query)
            if "error" in query:
                result["error"] = query["error"][0]
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(b"<h1>Spotify authorization was denied.</h1><p>You can close this tab.</p>")
                ready.set()
                return

            code = query.get("code", [None])[0]
            if not code:
                result["error"] = "missing_code"
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(b"<h1>Missing authorization code.</h1><p>You can close this tab.</p>")
                ready.set()
                return

            try:
                token_payload = exchange_code(code)
                result["token"] = token_payload
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(b"<h1>Spotify connected.</h1><p>You can close this tab and return to Codex.</p>")
            except Exception as exc:  # noqa: BLE001
                result["error"] = str(exc)
                self.send_response(500)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(b"<h1>Token exchange failed.</h1><p>Check the terminal output for details.</p>")
            finally:
                ready.set()

        def log_message(self, format, *args):
            return

    server = HTTPServer(("127.0.0.1", 8787), Handler)
    auth_url = "https://accounts.spotify.com/authorize?" + urllib.parse.urlencode(
        {
            "client_id": CLIENT_ID,
            "response_type": "code",
            "redirect_uri": REDIRECT_URI,
            "scope": SCOPES,
            "show_dialog": "true",
        }
    )

    print("Open this URL in your browser:")
    print(auth_url)
    print("")
    print("Waiting for Spotify to redirect back...")

    threading.Thread(target=server.serve_forever, daemon=True).start()
    ready.wait(timeout=600)
    server.shutdown()

    print("")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
