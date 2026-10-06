# Store specs (what `final` produces)

| Output | Size (px) | Store slot |
|---|---|---|
| `iphone-6.9in_1320x2868/` | 1320 × 2868 | App Store iPhone 6.9" (required; Apple scales it down for smaller iPhones) |
| `ipad-13in_2048x2732/` | 2048 × 2732 | App Store iPad 13" (required if the app runs on iPad) |
| `android-phone_1080x1920/` | 1080 × 1920 | Google Play phone (9:16) |
| `android-tab-7in_1200x1920/` | 1200 × 1920 | Google Play 7" tablet |
| `feature-graphic_1024x500.png` | 1024 × 500 | Google Play feature graphic (required) |

- App Store: up to 10 screenshots per device; the first 3 show in search results, so slides 1–3 carry the pitch.
  PNG/JPEG, RGB, no transparency.
- Google Play: 2–8 phone screenshots. The feature graphic must have no transparency. Keep its key content away
  from the edges, because some surfaces crop it or put buttons over it.
- Both stores: no misleading claims, no prices or rankings unless accurate, no other brands' trademarks without
  rights, and the screenshots must show the actual app.
- Need another size (Android 10" tablet 1600x2560, iPhone 6.5" 1284x2778)? Add it to `SIZES` in both
  `studio.mjs` and `final/src/layout.js`.
