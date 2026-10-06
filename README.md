# Leaderboard Maker

An editor with a live preview for contest "Top 10" winner cards. It exports the card as a PNG.

## Run

Open `index.html` in a browser, or serve it locally:

```bash
node server.js
```

Then go to http://localhost:5173.

## Use

1. Type the header text (eyebrow, title, subtitle) for the contest you are announcing.
2. Edit winners inline, reorder them with ↑/↓, or click **Sort by points**. Avatar initials come from each name.
3. To load a whole list at once, use **Bulk paste**: copy the Name / Location / Points columns from Excel and paste them in.
4. Click **Download PNG** (520px wide) or **Copy image** to paste straight into WhatsApp, Slack or email.

Your edits auto-save in the browser's localStorage. Use **Export JSON / Import JSON** to back them up or move them to another machine.

## Theming

The card colours are CSS variables at the top of `styles.css` (`--red`, `--maroon`, `--cream`, …).
