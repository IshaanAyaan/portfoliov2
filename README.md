# Portfolio

This is my portfolio site.

Check it out at [ishaanranjan.com](https://ishaanranjan.com)

## Site architecture

The site remains a framework-free static deployment. `index.html` is the semantic
source of truth for the portfolio. `site.js` reads its annotated portfolio items
to populate the Explore universe, so project and experience details are not
maintained in a second content list.

- `#explore` opens the universe overview.
- `#cluster/build`, `#cluster/research`, `#cluster/ideas`, `#cluster/trajectory`,
  and `#cluster/now` open shareable field details.
- `#portfolio` opens the document view.

Canvas is purely atmospheric; all controls and content are regular HTML. If
JavaScript or canvas is unavailable, the Portfolio remains readable and linked.

### Local preview

Run this from the repository root:

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173`. The site has no build step. Deploy by pushing
the static files to the branch configured for the existing GitHub Pages site;
keep `CNAME` in the repository root.

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

The workflow records Ishaan Ranjan as the author through the account's GitHub
noreply address, while GitHub Actions remains the committer and the commit message
explicitly identifies the refresh as automated. Commit-name and commit-email
secrets are intentionally unnecessary. Scheduled runs wake hourly during the
Phoenix daytime and refresh the widget when its data is from a prior local day or
at least four hours old. Manual runs can force an immediate refresh.
If Spotify temporarily rejects one user-data endpoint with HTTP 403, the updater
keeps that section's last valid data and retries it on the next scheduled run; it
fails without writing when every Spotify data endpoint is unavailable.
