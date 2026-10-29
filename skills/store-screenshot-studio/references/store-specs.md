# Store specs (what `final` produces)

| Output | Size (px) | Store slot |
|---|---|---|
| `app-store-iphone-6.9in/` | 1320 × 2868 | App Store iPhone 6.9" (required; Apple scales it down for smaller iPhones) |
| `app-store-ipad-13in/` | 2048 × 2732 | App Store iPad 13" (required if the app runs on iPad) |
| `google-play-phone/` | 1080 × 1920 | Google Play phone (9:16) |
| `google-play-tablet-7in/` | 1200 × 1920 | Google Play 7" tablet |
| `google-play-feature-graphic.png` | 1024 × 500 | Google Play feature graphic (required; under 1 MB) |
| `app-store-header.png` | 3840 × 1646 | App Store product page header, 21:9 (optional) |
| `app-store-search-result.png` | 3840 × 2560 | App Store search result, 3:2 (optional; replaces screenshots in search) |

- App Store: up to 10 screenshots per device; the first 3 show in search results, so slides 1–3 carry the pitch.
  PNG/JPEG, RGB, no transparency.
- Google Play: 2–8 phone screenshots. The feature graphic must have no transparency. Keep its key content away
  from the edges, because some surfaces crop it or put buttons over it.
- App Store header and search result art: one clear idea, a short phrase that adds to the picture, nothing
  dense. No prices, discounts, URLs, ©, Apple awards (Editor's Choice, App of the Day) or other platforms. Text must
  be localized per language. https://developer.apple.com/app-store/asset-best-practices/
- Both stores: no misleading claims, no prices or rankings unless accurate, no other brands' trademarks without
  rights, and the screenshots must show the actual app.
- Need another size (Android 10" tablet 1600x2560, iPhone 6.5" 1284x2778)? Add it to `SIZES` in both
  `studio.mjs` and `.studio/rounds/final/layout.js`.
