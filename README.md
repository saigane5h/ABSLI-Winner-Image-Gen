# Keyword Hunter – Leaderboard Maker

An editor with a live preview for the daily and weekly "Top 10" winner cards. It exports the card as a PNG.

## Run

Open `index.html` in a browser, or serve it locally:

```bash
node server.js
```

Then go to http://localhost:5173.

## Use

1. Choose **Daily** or **Weekly** in the top bar. Each mode keeps its own list and header text.
2. Edit the header (eyebrow, title, subtitle). **Reset header text** fills in the defaults; for Weekly that includes last week's date range.
3. Edit winners inline, reorder them with ↑/↓, or click **Sort by points**. Avatar initials come from each name.
4. To load a whole list at once, use **Bulk paste**: copy the Name / Location / Points columns from Excel and paste them in.
5. Click **Download PNG** (1x, 2x or 3x) or **Copy image** to paste straight into WhatsApp, Slack or email.

Your edits auto-save in the browser's localStorage. Use **Export JSON / Import JSON** to back them up or move them to another machine.

## Theming

The card colours are CSS variables at the top of `styles.css` (`--red`, `--maroon`, `--cream`, …).
