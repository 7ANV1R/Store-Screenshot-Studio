# Rendering gotchas (each one cost a round)

| Symptom | Cause | Fix (already in the engine unless noted) |
|---|---|---|
| Random missing/blank parts on 3D phones | rendering all slides at once blows Chrome's GPU tile budget | render one slide at a time with the others `display:none`, plus a warm-up capture |
| Turned phone looks off-centre | box centre ≠ projected silhouette centre | `data-vc` (optical centre) on every tilted phone |
| Feature graphic phones blurry | small (≈300px) 3D layers get ~0.5px bilinear warp blur; `deviceScaleFactor:3` *full-frame* captures fall back to low-res tiles | author the feature graphic at 3x (3072x1500) at device scale 1, downsample to 1024x500. Never use dpr>1 for 3D |
| A prop looks blurry next to crisp UI | the asset is upscaled (a 741px PNG shown at 840px) | render or download props at ≥1.3x their display size; `model … size=3000` for big ones |
| Two status bars on the phone | source screenshots include the real status bar | `init` cleans it automatically (`--statusbar clean` to force) |
| Tape ends visible on iPad/tablet | a fixed-length tape on a wider canvas | `.tape` class (auto-extended by layout.js) |
| Ribbon/full-slide art ends visible on wide sizes | rendered at exactly 1320 wide | render a wide version (`ribbon?x0=-600&x1=2400`) and add `data-wide` |
| Edge sticker floats mid-canvas on iPad | stage scaled and centred | `data-pin="l\|r"` |
| Glitchy sliver of a hidden element peeking out | layered shapes with near-identical edges | remove the hidden part entirely; don't rely on occlusion |
| Text measured wrong / layout shift | fonts not loaded before measuring | everything waits for `document.fonts.ready` (keep `display=block` on Google Fonts) |
| `render` hangs on a background image | a missing file (typo in the slug) | check that `screens/screens.js` SCREEN_NAMES has the slug |

When the client says a fix "still" doesn't work, measure before you change anything else. Use a crop, a
sharpness score or a pixel diff against a reference. Then report the cause you measured.
