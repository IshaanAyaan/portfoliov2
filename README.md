# Portfolio

This is my portfolio site.

Check it out at [ishaanranjan.com](https://ishaanranjan.com)

## Spotify Now widget

This site includes a small "Now" panel that reads from [`data/now.json`](./data/now.json).

### Local preview

1. Start a static server from the repo root:
   `python3 -m http.server 8000`
2. Open `http://127.0.0.1:8000`

### Update Spotify data locally

1. Export your Spotify credentials:
   `export SPOTIFY_CLIENT_ID=...`
   `export SPOTIFY_CLIENT_SECRET=...`
   `export SPOTIFY_REFRESH_TOKEN=...`
2. Run:
   `python3 scripts/update_now.py`

### Update the current book manually

Run:

`python3 scripts/update_book.py --title "Book Title" --author "Author Name"`

### Get or refresh the Spotify refresh token

1. Create a Spotify developer app with:
   Website: `https://ishaanranjan.com`
   Redirect URI: `http://127.0.0.1:8787/callback`
2. Export your client ID and client secret:
   `export SPOTIFY_CLIENT_ID=...`
   `export SPOTIFY_CLIENT_SECRET=...`
3. Run:
   `python3 scripts/authorize_spotify.py`
4. Open the printed Spotify authorize URL in your browser and approve access.
5. Copy the returned `refresh_token` into your local environment and GitHub Actions secrets.

### GitHub Actions secrets

Add these repository secrets before relying on the scheduled workflow:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`
- `GH_COMMIT_NAME`
- `GH_COMMIT_EMAIL`
