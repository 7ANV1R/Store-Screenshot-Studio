# Composition: the 7-slide story and per-slide recipes

All numbers are on the authored 1320x2868 canvas. The recipes come from a shipped, client-approved set
(`assets/templates/starter.html` contains the same building blocks with placeholders).

## Story order

The story lives in `plan/plan.json` and is approved on `plan/storyboard.png` before any design (gate A).

| # | Job | Screen to use | Signature move |
|---|---|---|---|
| 1 | Core promise + brand | home / main feed | logo, 3-line headline, two laurels, big turned phone bleeding off the bottom, blurred star behind, seal sticker bottom-left |
| 2 | Find / browse | search, explore, catalogue | flat phone, magnifier prop on the upper-right edge, two accent tapes (sharp over the corner, blurred behind) |
| 3 | The thing they buy / do | detail page | fully visible turned phone, lifted CTA bar in the phone's 3D space, tag-with-bolt tucked under the left frame, box prop at lower right, blurred box bottom-left |
| 4 | Social proof / people | profile, store, reviews | **inverted accent slide**, flat phone in a dark band colour, brand-colour verified seal bottom-left, medal prop on the right edge |
| 5 | Action / conversion | cart, checkout, compose | mirrored turn, 3D ribbon wrapping the phone, two thick product cards with speed trails dropping into a cart prop |
| 6 | Outcome / status | tracking, results, dashboard | shifted glow, turned phone, one real card floated off the screen, globe behind the lower right with a truck in front |
| 7 | Trust / close | strong visual screen | centred copy with inline brand icons, big stat in a laurel, mirrored-turn phone in a dark band, seal bottom-right |

No true, client-confirmed number? Don't fake a stat (no "0 …", no "100%"). Close with a seal, a
partner or integration row, or the strongest outcome screen instead.

Fewer than 7 moments? Drop 6, then 2. The client's own order always wins.

The table above is the shopping-app version. The *jobs* stay the same for any app; only the screens and props
change:

| App type | 1 promise | 2 find/browse | 3 core object | 4 people/proof | 5 action | 6 outcome | 7 trust |
|---|---|---|---|---|---|---|---|
| Shopping / marketplace | home feed (star) | search (magnifier) | product (box) | store, reviews (medal) | cart (cart) | tracking (truck + globe) | stat (laurel) |
| Seller / B2B / back-office | dashboard (chart, coins) | catalogue (box) | storefront or theme (bag, sparkle) | customers, chat (chat bubble) | new order or quick-add (bell, rocket) | sales report (money bag) | stat or partners |
| Productivity / reminders | today view (bell) | search, inbox (magnifier) | item detail (tick) | sharing (chat) | create or add (rocket) | streak or stats (fire, trophy) | rating, privacy (crown) |
| Finance / wallet | balance (wallet) | transactions (card) | insights (chart) | split or pay friends (chat) | send money (dollar) | savings goal (money bag) | security (tick) |

**Weak screens** (forms, settings, long text): show them only if the moment matters (sign-up = "start in a
minute"). Then crop the phone hard (bleed it), or lift the one meaningful card (`.lift`/`.float`) and let the prop
carry the slide. Skip any screen that is mostly paragraphs.

**Demo data** (test names, absurd numbers, personal URLs, "100%" everywhere): ask in intake. The best fix is a
recapture with clean seed data. Otherwise, edit the copy in `store-screenshots/screens/SLUG.png`. The original files stay untouched.
Paint over the area with the colour around it, or blur it (Python/Pillow). Tell the client which screens you
edited.

## Poses (data-tilt = rotateX, rotateY, rotateZ)

| Name | data-tilt | data-vc | Use |
|---|---|---|---|
| Flat | (none) | (none) | 2, 4: calm slides; the left/top of the UI is fully readable |
| Turn left (shows right side) | `10,-22,8` | 660 (580–660) | 1, 3, 6 |
| Turn right (shows left side + buttons) | `10,22,-8` | 590–660 | 5, 7 |

- Never use the same pose on adjacent slides. Never turn harder than ±25° in Y. Perspective is 4200px for an ~860px phone
  (`data-persp` scales linearly with `data-w`).
- Width: 860–1060px. Flat phones are 1000–1060px, top 900–1000. Fully visible turned phones are 840–860px, top 760–820.
  Bleeding hero phones are 1040px, top 1380.
- Always set `data-vc` on a turned phone (optical centre x, usually 660 = slide centre; lower moves it left).

## Copy block

`.copy` at `top:170–330px` (330 when the logo sits above it), `left:104px`. Headline 158px (128px on a busy
closing slide). Subtitle 48px, 38px below. Keep a gap of 6–9% of the slide height between the subtitle and the
phone's visible top.

## Props: size and placement

- Hero prop width 360–540px, rotated 4–14°, overlapping the phone edge by 15–35% of its own width.
- A blurred background prop is 400–470px, `blur(12px)`, behind the phone, partly off the slide edge (`data-pin`
  so it stays on the edge at every size).
- Seals: 300–330px, rotated ±10–12°, overlapping a phone corner, 30–40px from the slide edge. Centre text
  44–56px, two words.
- Laurels: 440x232px pairs under the subtitle (hero), or one 940x494px with a 190px stat (trust).
- Tapes: 124px tall, rotated −28.5°. The sharp one crosses the phone's lower-right corner; the blurred one
  (`blur(5px)`) sits ~580px lower and behind the phone.

## Making a slide "crazy" without making it messy

Pick one bold move per slide and execute it fully: an oversized prop, the inverted colour, a ribbon, a big stat, a
sticker. Two bold moves fight each other. If a slide feels empty, scale the hero prop up or let the phone bleed
before you add another object.

## Self-review checklist (run on every rendered PNG at full size before showing anything)

- [ ] One-second read: headline legible at 20% size, one clear focal point
- [ ] Turned phone visually centred; no two adjacent slides share a pose
- [ ] ≤1 hero prop (+1 blurred), ≤2 UI pop-outs in the whole set
- [ ] No element chopped awkwardly; deliberate bleeds are >50% visible
- [ ] Sticker and laurel text has breathing room; nothing touches a scallop or leaf
- [ ] Subtitle gap identical on every slide; no text collides with the phone or props
- [ ] All props as sharp as the UI; shadows go the same direction (light from the top-left)
- [ ] `studio check` passes: no em/en dashes, no superlatives
- [ ] Copy speaks to the actual reader (see intake question 1)
