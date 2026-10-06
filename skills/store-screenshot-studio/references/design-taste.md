# Design taste

This file has three parts:

1. **Principles.** They apply to every app, every concept and every style.
2. **Patterns to avoid.** This is the default. The user's own references can override any row.
3. **One worked example.** These are the exact choices of one client. Learn from them. Do not copy them.

The taste comes from a real client project with 11 review rounds. It went from "you made worst!" to a shipped set
the client loved. When a user brings their own references or brand rules, theirs win where they conflict.

## North star

The goal is store screenshots that **pop**: eye-catching, natural, beautiful, and made for *this* app. They look
like a top studio made them. They never look templated, and they never look "AI made this".

The test: someone scrolling the store stops on your first slide. Each slide reads in one second at thumbnail size.

## 1. Principles (always)

**One idea per slide.** One message, one focal point. Everything else supports it or goes.

**Contrast you can feel.** Text, device and background must separate clearly at thumbnail size. This works with any
colour story: loud saturated colour, deep dark, or calm paper. A grey middle does not work. When a client says
"more contrasty", they mean stronger colour, a brighter accent and darker ink.

**Big, confident type.** Headlines are short and large: 2 or 3 lines. Pick a typeface with character that suits the
concept. Highlight one word, in a way that fits the concept (a pill, a colour, a marker swipe, an underline, a
sticker).

**Real things look real.** If there is a device, it must look like real hardware. Props must be as sharp as the UI.
Shadows fall in one direction. Nothing is blurry by accident.

**Meaning over decoration.** Every object must tell the slide's story. A random sparkle, blob or icon is noise. One
strong object beats five weak ones. Empty space is fine. Clutter is not.

**A set, not seven posters.** The slides share one system (type, colour, device treatment, rhythm), but no two slides
are the same. Change the composition from slide to slide. Give the set a beat, for example one inverted slide.

**Visual balance.** A turned phone is centred by how it looks, not by its box (`data-vc`). Bleeds are deliberate
(more than half visible) or not there at all. Text never touches a sticker edge.

**Honest words.** Short, plain, true. No dashes. No claims nobody can check (see copywriting.md).

**The app is the hero.** Show real screens. Decoration frames the product. It never hides it.

## 2. Patterns to avoid (default)

| Avoid | Prefer |
|---|---|
| The same layout or device pose on every slide | Change composition every slide; never repeat a pose on neighbours |
| Many floating UI cut-outs around the phone | One purposeful pop-out per slide at most, one or two per set |
| Dramatic close-camera perspective that distorts the device | Gentle turns, or flat |
| Splitting one phone across two slides again and again | One deliberate panorama moment, if the concept needs it |
| Low-contrast, muddy or pastel sets with no point of focus | A clear colour story with a strong accent |
| Props added to "fill" space; props unrelated to the slide | One meaningful prop, or none |
| Low-resolution, low-poly or mixed-sharpness assets | Assets at 1.3x display size or more, all equally sharp |
| Fake-looking hand models holding the phone | Device alone, unless the user's references use real photography |
| Promo badges with no real deal ("12% OFF", "New In") | Devices that fit the concept |
| Glitchy layers: slivers peeking out, half-hidden shapes | Simplify until every edge reads cleanly |
| Elements chopped awkwardly by the slide edge | Bleed on purpose, or keep inside |
| Motion pointing in different directions | One direction that follows the story |
| Dotted or dashed motion lines | Speed bars, a ribbon, or real motion blur |
| Generic "AI" decoration: aurora blobs, mesh gradients, bokeh, random sparkles | Texture and objects that belong to the concept |

## 3. Worked example: what one client approved

A white-label shopping app. **These are that client's choices, not rules.** Use them to understand the quality
level and the level of detail. Then make something new for your app.

- **Colour**: cobalt `#1d4cf2` gradient with acid lime `#d8ff3e`, ink `#08123f`. One lime slide for rhythm. Faint
  120px grid, one soft glow, 8% film grain.
- **Type**: Bricolage Grotesque 800, about 158px, tight spacing, left aligned. One word in a rotated lime pill.
  Inter 500 subtitle at 48px, the same gap on every slide.
- **Device**: real 3D iPhone, flat or turned `10,-22,8` / `10,22,-8`, never the same pose twice in a row. Phones bleed
  off the bottom on hero slides.
- **Props**: one glossy 3D icon per slide, each a literal symbol (search: magnifier, product: parcel, cart: cart,
  delivery: truck over a clay globe, trust: medal). Each prop hugs the phone and anchors to a real point in the UI.
- **Accent devices**: scalloped seal stickers with ring text, small laurels with 2-line claims, a big true stat
  (40K+), lime keyword tapes, lime price tags with a bolt icon tucked under the frame, a 3D ribbon around the phone,
  glossy lime speed bars.
- **Pop-outs**: one real CTA bar lifted in the phone's 3D space, and one tracking card floating flat.
- **Brand**: real logo files only. Sister brands as inline icons in a sentence.

You can see the result in the repository README. A concept for another app should feel as considered as this, and
look nothing like it.

## How clients give feedback (process taste)

- Feedback arrives as numbered notes per slide. Change exactly what was named. Everything else stays the same.
  Redesigning slides nobody asked about breaks trust.
- Copy decisions belong to the client. Offer 3 to 5 options as choices. Never decide silently.
- Every round gets its own folder. Never delete or overwrite a round unless told. Clients compare old rounds and
  ask to restore them.
- At each review, ask: new round, or update this one? If they say "do it inside round N", keep doing that until
  they say otherwise.
- Nudges are relative ("1x up", "close to the price"). Measure them against the element's own size or a named point
  in the UI. Then check the render.
- When something is "still wrong" after a fix, measure it. Do not guess twice. Report the real cause.
