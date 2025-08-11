# Thanis.ai — static prototype

This is a minimal, static landing site for Thanis. It’s framework‑agnostic and deploys on any static host (Vercel, Netlify, Cloudflare Pages).

## Files
- `index.html` — main page
- `assets/styles.css` — styles
- `assets/script.js` — tiny JS helpers (copy email, theme toggle)
- `assets/favicon.svg` — vector favicon
- `robots.txt`, `sitemap.xml`

## Quick edit
Open `index.html` and update:
- contact email in the Contact section
- the whitepaper download link (currently a placeholder)

## Deploy (manual, Vercel dashboard)
1) Create a project on Vercel and upload this folder.  
2) In **Project → Settings → Domains**, add `thanis.ai` (and `www.thanis.ai` if desired).  
3) Follow the dashboard’s instructions to set your DNS at your registrar (A record for the apex, CNAME for `www`).

## Deploy via API (for a GPT Action)
Use Vercel’s REST API `POST /v13/deployments` to upload these files inline and `POST /v10/projects/{idOrName}/domains` to attach the domain.
