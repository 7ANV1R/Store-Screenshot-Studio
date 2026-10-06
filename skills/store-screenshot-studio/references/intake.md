# Intake: questions and resources

Ask before round 1. First look at the contact sheet and read anything already in the project (README, store
listing, website), so you only ask about what's actually missing. Use AskUserQuestion: up to 4 questions per call, 2–4 options
each, recommended option first. Plan for 1–2 calls. Turn each "must know" into a question *with your best guess
as the recommended option* (for example "Sellers/merchants (Recommended)"). That way you can still ask when the
screens already suggest an answer, and the client confirms instead of typing. Skip a question only when it has
been answered explicitly.

## Must know (block until answered)

1. **Who reads the listing, and what is the app?** One line: the product, and who downloads it. Watch for the
   demo-app trap: a white-label or demo app sold to businesses must speak to those businesses ("your store, your
   buyers"), not to their end users.
2. **Platforms.** App Store, Google Play, or both? iPad and Android tablet too? (The default is all four sizes plus the
   feature graphic.)
3. **The 5–7 moments to show**, in order. Don't ask in the abstract: pick them yourself, write the copy, and show
   `plan/storyboard.png` (gate A in SKILL.md). The user confirms, swaps (alternates are lettered A, B, C) or reorders.
4. **Brand resources.** Ask for files, not descriptions:
   - logo (SVG preferred) for dark *and* light backgrounds
   - the app icon exactly as it ships (which variant, if several)
   - brand colours (hex), brand fonts (or "pick one")
   - partner, parent or achievement marks they want mentioned, with official asset links
   Put them in `store-screenshots/assets/brand/`. Never redraw a logo.
5. **Claims and proof.** Numbers they can stand behind (users, stores, countries, rating). What is off-limits
   (#1, "best", competitor names, prices)? Who owns which brand? (For example, "sister products by the same company",
   never "built by X team" if that's untrue.)

## Should know (ask if not obvious)

- **Tone**: playful and loud, premium and calm, or editorial? Their brand colours vs a fresh store-only palette?
- **References and mood**: links or images they love, and 2 or 3 mood words ("playful", "premium", "retro"). These
  lead the concepts (references/concepts.md). Look at every reference before you design.
- **Their own art**: characters, mascots, 3D renders, illustrations or product photos they own.
- **Screens to avoid**: unfinished features, test data, other people's names or photos, dark mode vs light mode.
- **Localization**: ask for the languages and the text direction.
  - Non-Latin scripts need a font with those letters, for example Noto Sans Bengali or Noto Sans Arabic.
  - Longer languages need headlines about 15% smaller.
  - Right-to-left languages need `dir="rtl"` and a mirrored layout: the copy goes right and the phone turns the
    other way.
  - Render one set per language.
- **Device frame**: the mockup is an iPhone Pro on every size, by design (one look everywhere). Mention it. If they
  insist on an Android frame for Play, that's a custom build, so flag it before round 1.
- **Store listing name** and subtitle (keep the screenshots consistent with them).

## Resource checklist (say exactly what's missing)

| Need | Why | If missing |
|---|---|---|
| Raw screens, PNG, one device size, no frame | the phone mockup frames them | ask; `studio init` reports mixed sizes |
| Logo (light + dark) | hero slide and feature graphic | ask; never fake one with a text wordmark in a font |
| App icon | inline in copy, feature graphic | ask |
| Brand colours | tokens | derive from the screens' primary button colour, and say so |
| True numbers for stats | trust slide | drop the stat slide element, don't invent |
| Partner/parent marks | trust line | official brand-asset page only |

## Defaults when the client says "you decide"

7 slides, the four palettes you recommend, English, and all four sizes plus the feature graphic. State each
default you took in one line.
