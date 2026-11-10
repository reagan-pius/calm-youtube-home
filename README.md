# Calm YouTube Home

A Manifest V3 Chrome extension that turns the YouTube homepage into a compact,
text-first list — titles, channel, views and age, with no thumbnails, moving
previews, Shorts shelves or recommendation sidebar.

Only `/` and `/feed/explore` are affected. Every other YouTube page is left
alone.

## What it does

- Replaces the video grid with a single-column, numbered list of rows.
- Hides thumbnails, hover previews, `<video>` elements, Shorts/reel shelves and
  the secondary column, so the feed stops loading image and video payloads.
- Freezes YouTube's own animations and transitions, then layers back a small
  set of deliberate ones: a quiet staggered row entrance (380ms, 22ms per row)
  and hover/focus feedback (plate, accent rail, index and title nudge).
- Follows YouTube's theme via the `dark` attribute on `<html>`, with one accent
  colour used only for hover and focus.
- Honours `prefers-reduced-motion`: no entrance animation, no transforms,
  near-instant transitions.
- Keyboard accessible: rows reveal their hover treatment on `:focus-within`,
  and titles get an accent focus ring.

## Install

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Open <https://www.youtube.com/>.

There is no build step, no dependencies, no permissions and no network access.

## How it works

`manifest.json` injects `content.js` and `styles.css` at `document_start` on
`www.youtube.com`.

`content.js` decides whether the current page is home, toggles the
`html.calm-youtube` class that every style is scoped under, injects a runtime
style that freezes YouTube's animations (excluding elements marked
`.calm-row`), removes Shorts shelves, and marks each feed row with
`.calm-row` plus an index variable used for the entrance stagger. It re-runs on
`yt-navigate-finish` and on DOM mutations, coalesced through
`requestAnimationFrame`.

`styles.css` holds the entire visual layer: design tokens (light and dark),
row layout, typography, and the motion.

## Notes

- YouTube sets `html { font-size: 10px }`, so spacing here is expressed in `px`
  rather than `rem`.
- The feed markup is YouTube's "lockup" structure
  (`yt-lockup-view-model`, `a.ytLockupMetadataViewModelTitle`,
  `yt-content-metadata-view-model`). YouTube changes this periodically; if the
  list ever renders as blank rows, those selectors are the first place to look.
- In-feed ads (`ytd-ad-slot-renderer`) are kept as-is, so they render as taller
  rows with their own buttons.
- Verified against Chrome 155 on the signed-out homepage in dark theme.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension definition and content-script injection |
| `content.js` | Page gating, DOM pruning, row marking, observer |
| `styles.css` | Tokens, layout, typography, motion |
