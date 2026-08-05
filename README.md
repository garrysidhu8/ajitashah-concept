# Ajita Shah — Concept Site

Premium concept redesign of [ajitashah.com](https://ajitashah.com), built by
[Jobaki](https://jobaki.com) as a pitch. Fully static — no build step, no
framework. Open `index.html` over HTTP (canvas features break on `file://`).

## Demo mode — read this first

This deployment is a **demo for the client pitch**. Two things are intentional:

1. **Booking is not linked yet.** `<body data-booking-url="">` is empty, so every
   booking path ends at Ajita's phone number. At handover, paste her Cal.com
   event URL into that one attribute and every booking CTA on the site goes
   live — the chat guide will end at her calendar instead of her phone.
2. **The demo is invisible to Google.** `vercel.json` sends
   `X-Robots-Tag: noindex, nofollow` on every response so this URL can never
   compete with ajitashah.com in search. Her previous developer left two stale
   copies of her site indexed (dev.ajitashah.com, rwdesk.com) — this header is
   how we avoid becoming the third. **Remove it only when deploying to her real
   domain.**

## Stack

- Static HTML/CSS/JS, Cormorant Garamond + Manrope, GSAP/ScrollTrigger/Lenis
  (vendored, deferred)
- Light crown-violet palette taken from her own Elementor kit colours
  (`#22092C`, `#DBB757`, `#4f345a`, `#f0cdff`)
- No analytics, no cookies, no tracking. Check-in, scorecard and chat are
  client-side only; the single localStorage key is the reduce-motion preference

## Key pieces

| Piece | Where |
|---|---|
| Breathing hero (11s cycle, opt-in guided breath) | `index.html` + `css/style.css` |
| Check-in flow (her clients' own words) | `#checkin` + `js/main.js` |
| Six-area scorecard (from her questionnaire) | `#scorecard` + `js/main.js` |
| Chat guide + booking intake + crisis detection | `js/main.js` (`guide()`) |
| Content conflicts / unresolved facts | `CONTENT-DECISIONS.md` |
| Photo audit | `ASSET-INVENTORY.md` |
| Blog migration manifest (30 posts) | `SEO-MIGRATION.csv` |

## Deploy

Direct: `vercel deploy` from this directory (static, zero config beyond
`vercel.json`). Or connect the GitHub repo to a Vercel project for
push-to-deploy.

Photographer originals (161 MB, `135mm-*`, `*.CR3`) are gitignored on purpose —
only optimized derivatives in `assets/` are tracked.
