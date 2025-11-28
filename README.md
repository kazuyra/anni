# Anniversary Interactive Site

This is a simple, standalone static site that celebrates an anniversary with interactive confetti, fireworks, a countdown, a 12-month timeline (one message per month), and a small generated melody.

Files
- `index.html` — main page
- `styles.css` — styles and animations
- `script.js` — all client interactivity (canvas confetti, fireworks, timeline messages, music, countdown)
- `assets/celebrate.svg` — accent SVG

Preview locally

Run a static server from the project root. Example using Python 3:

```bash
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Features & usage
- Click "Toggle Confetti" to start/stop continuous confetti.
- Click "Fireworks" for a big burst.
- Click the hero card to create a confetti burst at the click position.
- Press `c` for confetti, `f` for fireworks, `m` to play music.
- Set the anniversary date using the date input to see the countdown.
- Save a single message per month using the timeline controls — messages are saved to `localStorage` and persist across reloads.

Want changes?
- I can add real audio, more elaborate fireworks, an export/shareable image, or a deployment workflow. Tell me which features you want next.
Timeline & style
- The site uses a bold hero and an interactive timeline: select a month (1–12) with the large slider or by clicking the month markers, then save a single message for that month.
- The slideshow/photo upload feature has been removed — the hero is static for now.

Notes
- Messages are stored in `localStorage` under `anni_timeline` as a simple month → string mapping. Older guestbook data (if present) will be migrated into month 1.
- If you want features like multi-message history per month, image uploads, or export options, tell me which to add next.