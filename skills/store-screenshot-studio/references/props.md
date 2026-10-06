# Props: where 3D objects come from

A prop is the one 3D object that symbolises a slide (see design-taste.md). Each project gets its own. Nothing
is reused from other clients.

Props are optional. Many great concepts use none (a typographic poster, a photo world, a game's own scene). Use a
prop only when it makes the slide's idea stronger.

## Order of preference

1. **The user's own assets.** Ask at intake: "Do you have 3D renders, a mascot, product photos or illustrations in
   your brand style?" Brand-made assets beat anything generic. Put them in `store-screenshots/assets/3d/`
   (transparent PNG/WebP, at least 1.3x the size they'll be shown, so 600px+ for a 450px prop).
2. **Generated in the brand colours** (no downloads, no licences). Use `studio props --c BASE --c2 DETAIL
   --accent ACCENT` for the general pack. Use `studio model …` for single props: a parcel, a cart, a truck, a clay
   globe, a speed trail, or a ribbon around the phone. Pick the shapes that match each slide's story.
3. **A free library the user downloads** when they want a specific object the generator can't make (for example a
   chef mascot or a plant). Suggest exact items and sources with clear licences, such as 3dicons.co (CC0) at its
   2400px size. The user downloads them; you never hotlink or scrape. Record the licence in
   `assets/3d/LICENSES.md`.

4. **Art from the app itself.** Game characters, items and scenery can be cut from the screenshots (a crop with
   `data-crop`, or a cut-out made with a transparent mask). Ask the user for clean source art when they have it.
5. **Drawn in the page.** Simple illustrations, textures and shapes in SVG or CSS: receipt paper, a blueprint grid,
   stamps, tickets, doodles. These often fit a concept better than any 3D object.

## Choosing and colouring

- One hero prop per slide plus optionally one blurred copy behind. Use the same material family across the set
  (all glossy plastic, or all clay), never mixed.
- Colour the props from the direction's tokens. The prop should *contrast* with the slide background: an
  accent-coloured prop on the base slides, a base-coloured prop on the inverted accent slide. Run `props` once per
  direction with `--prefix`.
- A prop must be at least as sharp as the UI next to it. If it looks soft, regenerate with `&size=2400`.
- Rotate props 4–14° and overlap the phone edge so they feel placed, not pasted.
