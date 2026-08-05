# Asset Inventory

All 16 files supplied by Ajita on 2026-08-05, measured with `sips`. Originals are
preserved in the project root and excluded from git via `.gitignore` (161 MB
total — committing them would make the repo unusable).

Last updated: 2026-08-05

---

## Summary

- **11 files** are one high-key **white studio shoot** — white panelled walls,
  natural light, sage-green sofa, jute rug, cream and blush clothing.
- **2 files** are a different register entirely: **spiritual teacher** (cave
  temple, and teaching with a mic).
- **2 files are AI upscales** and must not be used.
- **1 file** is a Canon RAW and needs conversion before any web use.

The studio shoot's brightness is why the design moved light. See
`CONTENT-DECISIONS.md` §15.

## The studio shoot

| File | Pixels | Size | Subject | Recommended use | Hero? |
|---|---|---|---|---|---|
| `135mm-2423 1.jpeg` | 2189×1500 | 340 KB | **Close portrait, hand on chin, direct eye contact, genuine smile**, sage sofa behind | **Check-in "I'm here" moment.** The single most valuable file here | Yes — intimate |
| `135mm-2439 profile.jpeg` | 1702×1481 | 428 KB | Clean bright headshot, direct to camera, cream textured jacket | About band; **OG share image** | Yes — portrait |
| `135mm-2341.jpeg` | 6000×4001 | 12 MB | Standing by white fireplace, white turtleneck, blush trousers | Healer section (landscape crop) | Yes |
| `135mm-2391.jpeg` | 6000×4000 | 11 MB | Seated on sage sofa, relaxed, wide | Healer section alt; Start Here | Yes |
| `135mm-2450.jpeg` | 6000×4000 | 16 MB | Seated on white bench, black jacket, styled room | Editorial / About | Yes |
| `135mm-859373.jpeg` | 6000×3999 | 10 MB | Standing by travertine console, cardigan | Wide band, text overlay right | Yes |
| `135mm-859382.jpeg` | 6000×4000 | 13 MB | Standing behind console, arms open | Wide band | Maybe |
| `135mm-2423.jpeg` | 4000×6000 | 12 MB | **Full-res source of `135mm-2423 1.jpeg`** | Re-crop the close portrait from here for max quality | Yes |
| `135mm-2435.jpeg` | 4000×6000 | 14 MB | Standing, cream textured jacket | Programs / vertical slots | Yes |
| `135mm-2439.jpeg` | 4000×6000 | 12 MB | Full-res source of the headshot | Re-crop headshot from here | Yes |
| `135mm-2376.jpeg` | 4001×6000 | 14 MB | Seated in dark boucle chair | Vertical slot | Maybe |

## Spiritual teacher

| File | Pixels | Size | Subject | Recommended use | Hero? |
|---|---|---|---|---|---|
| `EOS_9859.CR3` | 5472×3648 | 23 MB | **Cave temple** — white robe, seated on ancient stone steps, contemplative | The one deliberately dark section (Journey). Already the source of `assets/hero-caves.webp` | Yes — dramatic |
| `Commune 1 mic.jpeg` | 960×1280 | 116 KB | **Teaching with a headset mic**, white kurta, mala beads with chakra-coloured stones and a purple pendant, audience behind | Stories / About — the only shot of her actually working. **On-brand for the chakra accents** | **No — too low-res** |

## Do not use

| File | Pixels | Why |
|---|---|---|
| `135mm-2376.jpg` | 5357×8032 | **AI upscale** of the 4001×6000 `.jpeg`. Adds artifacts; we downscale anyway |
| `135mm-2423.jpg` | 5461×8191 | **AI upscale** of the 4000×6000 `.jpeg`. Same reason |
| `Profile.jpg` | 1061×1067 | Small square, likely a social avatar. Superseded by the real headshot |

## Alt-text drafts

Descriptive, not keyword-stuffed. Decorative treatments get `alt=""`.

- `135mm-2423 1.jpeg` → `Ajita Shah seated, resting her chin on her hand, smiling at the camera`
- `135mm-2439 profile.jpeg` → `Portrait of Ajita Shah`
- `135mm-2341.jpeg` → `Ajita Shah standing beside a white fireplace in a bright room`
- `135mm-2391.jpeg` → `Ajita Shah seated on a sage green sofa`
- `135mm-2450.jpeg` → `Ajita Shah seated in a styled sitting room`
- `135mm-859373.jpeg` → `Ajita Shah standing beside a console table`
- `EOS_9859.CR3` → `Ajita Shah seated on stone steps at an ancient cave temple`
- `Commune 1 mic.jpeg` → `Ajita Shah speaking to an audience, wearing a headset microphone`

## Existing derivatives in `assets/`

| File | Size | Status |
|---|---|---|
| `hero-caves.webp` | 285 KB | In use — Journey section. From the CR3 |
| `portrait-135mm.webp` | 246 KB | Currently the healer portrait; **replace** with a studio original |
| `logo.webp` | 122 KB | In use. **`TODO_CONTENT`: vector original still needed** |
| `about-hero.webp` | 156 KB | Unused |
| `bg-eos.webp` | 154 KB | Unused |
| `portrait-white.jpg` | 254 KB | Unused |
| `program-inneros.webp` | 29 KB | Unused — program renamed |
| `program-omnisource.webp` | 24 KB | Unused — program renamed |

## Known gaps

1. **No WebP/AVIF encoder on this machine.** Neither `cwebp` nor `sips` WebP
   support. New derivatives are JPEG until `brew install webp`. Costs ~25–30%
   extra bytes.
2. **Logo vector still outstanding** — only an 800 px raster exists.
3. **No Inner Goddess imagery at all.** No retreat photography for either
   occurrence. Prince Edward County is described as post-event, so approved
   imagery may exist. `TODO_CONTENT`.
4. **No photograph of her working one-to-one.** The mic shot is the closest and
   it is too low-resolution for prominent use.
