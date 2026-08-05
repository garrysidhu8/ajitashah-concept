# Content Decisions & Conflict Log

Every unresolved factual conflict, and every decision made in place of inventing
an answer. `TODO_CONTENT` marks anything that must be confirmed by Ajita before
launch. Nothing in this file may be resolved by guessing.

Last updated: 2026-08-05

---

## 1. Years of experience — RESOLVED

| Source | Claim |
|---|---|
| Ajita, by email 2026-08-05 | **35+ years** |
| Her Facebook / old dev site | 35 years |
| Earlier concept build | 12+ (placeholder — was invented) |

**Decision:** use **35+ years** sitewide. The `12+` stat has been removed.
Do not reintroduce any other figure.

## 2. Removed invented statistics — RESOLVED

The earlier concept displayed **"30+ countries reached"** and **"1,000+ lives
transformed."** Both were placeholders invented during design. Ajita has not
confirmed either.

**Decision:** both removed. Replaced with confirmed facts only (35+ years,
90-day programs, Toronto). `TODO_CONTENT`: if Ajita wants client or country
numbers, she must supply them.

## 3. Credentials / education — TODO_CONTENT (blocking for E-E-A-T)

Asked "where you studied," Ajita answered **"India"** — a location, not a
qualification.

A search result once described her as having "a formal degree in psychology."
**She did not confirm this**, so it appears nowhere on the site.

This matters beyond tidiness: Google demotes health-adjacent content lacking
visible author credentials, and credentials are the intended fix. Right now that
fix is unavailable.

`TODO_CONTENT`: **what qualification, from which institution, in which year?**
Plus any certifications or lineage. Until answered, no educational claim ships.

## 4. Restricted professional titles — ACTION REQUIRED, NOT ON THIS SITE

Verified 2026-07-30 across `/`, `/about/`, `/programs/`, `/omni-source/`,
`/contacts/`: **zero occurrences** of "psychologist" or "psychotherap*" on
ajitashah.com.

The restricted title **"Holistic Psychologist" appears on her Facebook page
title**. In Ontario, "psychologist" is protected under the Psychology and Applied
Behaviour Analysis Act, 2021.

**Decision:** the website is already clean; no site change needed. This is a
social-profile fix Ajita must make herself. A previous third-party audit claimed
the title was on the website — that claim was incorrect.

## 5. "Spiritual counselling" — WORDING CHANGED, NEEDS HER SIGN-OFF

Ajita's own wording for the 1:1 is *"Bespoke healing and spiritual
counselling."*

**Decision:** the site says **"Bespoke healing & guidance."** "Counselling"
leans toward territory restricted to registered psychotherapists in Ontario.

`TODO_CONTENT`: Ajita to approve "guidance." Cheap to change now, expensive later.

## 6. Which programs exist — CONFLICT, UNRESOLVED

| Source | Programs named |
|---|---|
| Her live site | OmniSource Healing, Inner OS™ / Conscious Leadership Mastery, Becoming Unlimited |
| Ajita by email 2026-08-05 | 1:1 Bespoke healing (USD $6,000, 90 days); Rewrite Your Destiny (USD $399, 90-day group). *"Let's start with these 2 for now."* |
| Redesign brief 2026-08-05 | **Inner Goddess** retreat is the featured program |

Three different program sets. Inner Goddess did **not** appear in her own list.

**Decision:** the ladder shows what she confirmed — free circle, Rewrite Your
Destiny, 1:1. Inner Goddess is built per the brief but its factual details stay
`TODO_CONTENT` (see §8).

`TODO_CONTENT`: are OmniSource, Inner OS and Conscious Leadership Mastery
retired, paused, or still sold? Existing indexed URLs exist for them.

## 7. Becoming Unlimited — TODO_CONTENT

Not in her list of two programs, but it demonstrably exists: Garry received the
"Welcome to Becoming Unlimited" onboarding email on 2025-04-22, and it is the
free entry rung the ladder depends on.

`TODO_CONTENT`: still running? Cadence, platform, typical attendance, list size.

## 8. Inner Goddess retreat — COPY FROM BRIEF, FACTS UNVERIFIED

Event records per the brief:

| Occurrence | Dates | Location | Status |
|---|---|---|---|
| Prince Edward County | Sept 11–13, 2026 | Prince Edward County, ON | **Sold out** — priority list only, no apply button |
| Muskoka Lakes | March 19–21, 2027 | Muskoka Lakes, ON | **Applications open**, limited capacity |

Positioning and hero copy are taken from the brief, which is user-supplied and
therefore authoritative for wording.

**No uploaded Inner Goddess source material exists.** The only files provided are
16 photographs and the quiz questionnaire. So all of the following remain
`TODO_CONTENT` and must not be written speculatively:

venue · price · deposit · meals · rooms · transport · itinerary · ceremonies ·
yoga · photography · spa · alcohol · cancellation terms · accessibility
provisions · eligibility and audience wording · capacity number

## 9. Contact email — BLOCKING

Ajita answered *"Email — TBA."* Phone is confirmed: **+1 416 579 3700**
(Toronto, matches her 2023 email signature).

There is currently **no working email contact path**. Blocks the contact page,
the application flow, and the priority list.

## 10. Pricing currency — TODO_CONTENT

Both prices quoted in **USD** by a Toronto-based practitioner. Intentional
(international clients) or should CAD show for Canadian visitors?

Also noted: the gap from $399 to $6,000 is ~15×, with nothing between.

## 11. Testimonials — LEGAL, UNRESOLVED

Her live site carries explicit medical-outcome claims, including *"Autoimmune
Hepatitis an incurable disease, required me to take medication lifelong. But the
doctors stopped my medication after i worked with Ajita"*, twelve years of mental
illness, and a child's bedwetting resolving in two sessions.

**Decision:** all rewritten as subjective experience. One that still implied
clinical efficacy (*"only Ajita's healing brought relief"* after *"every therapy
possible"*) was softened to *"the first time I felt genuinely heard rather than
assessed."* A results-vary disclaimer sits with the testimonials.

`TODO_CONTENT`: written consent on file for each testimonial? Real names or
approved pseudonyms? Ajita's approval of the softened wording?

## 12. Quiz questionnaire — PARTIALLY ADOPTED

Source: `Website home page quizz Questionnaire.docx`, ~90 questions across ~15
categories.

**Adopted:** the six-category set at the top (Money, Career, Mental Health,
Physical Health, Relationships, Spirituality) — the only internally consistent
part. Built as a six-question reflection. **No score is displayed**; the areas
named are reflected back instead.

**Rejected, with reasons:**

- **Duplicated items.** "Do you tend to suppress or ignore your emotions?" appears
  under both Mental Health and Emotional Awareness. "Are you able to identify and
  express your emotions effectively?" appears under both Relationships and
  Emotional Awareness. Several others repeat verbatim.
- **Inverted scoring.** The six-question version is positively worded, so Yes = 1
  point works. The long lists mix in negatively worded items ("Do you get
  triggered or angry easily?", "Do you feel guilty when taking time off work?")
  where Yes means the opposite. Scoring all as Yes = 1 produces meaningless totals.
- **Clinical / medical questions — must not ship.** Notably *"Do any critical or
  chronic illnesses or conditions run in your family?"* (family medical history),
  *"Are you free from any chronic health conditions...?"*, *"Do you frequently feel
  anxious or experience panic attacks?"*, *"Do you struggle with insomnia?"*
  Collecting symptoms and then offering healing for them is the specific pattern
  that creates regulatory exposure for an unlicensed practitioner.

`TODO_CONTENT`: Ajita to confirm the six-question version is what she wants
public, and to approve dropping the rest.

## 13. Client language — VERIFIED, IN USE

Ajita supplied what people actually write in a first message. Used verbatim as
the check-in options and as keyword targets:

> I am unhappy in my marriage · I feel stuck in life · I am unhappy in my job ·
> my boss or colleagues do not treat me right · I am overlooked for promotion ·
> My business is in trouble · I want to make more money · I am unlucky in love ·
> my partner is a narcissist · I am in an abusive relationship · I do my best to
> be the best partner, I do so much

**Safeguarding decision:** "narcissist" and "abusive relationship" are
deliberately **not** offered as tappable options. Presenting them invites
disclosure of active danger that a concept site cannot responsibly hold. The
free-text field catches them instead.

`TODO_CONTENT`: if Ajita wants an explicit abuse pathway, it needs a **verified**
Ontario support line (the Assaulted Women's Helpline is the likely candidate —
number must be confirmed from source, not recalled) and her sign-off. The 9-8-8
line currently on the site is for suicide crisis specifically and is not the
right referral for domestic abuse.

## 14. Blog — 30 posts, slugs preserved

Full manifest in `SEO-MIGRATION.csv`. All 30 fetched successfully.

- **21 of 30 have no meta description.** Needs writing.
- **No `<h1>` anywhere on the live site**, blog included.
- **Slug/content mismatch:** `/how-to-identify-the-emotionally-unavailable-partner-2/`
  is titled *"What is distance healing?"* — a different article under a misleading
  slug. **Correction to an earlier assessment: this is not duplicate content.**
  Changing the slug needs a 301 and forfeits existing equity. `TODO_CONTENT`.
- `/limiting-beliefs-impacting-health-and-healing-category/` — the trailing
  "category" looks like an authoring error. Verify before touching.

**Decision:** preserve every slug exactly. No post is renamed for keyword gain.

## 15. Design direction — RESOLVED

Palette reconciliation. Her live Elementor kit uses:

| Her token | Value |
|---|---|
| `--e-global-color-accent` | `#22092C` deep aubergine |
| `--e-global-color-secondary` | `#DBB757` gold |
| in use, 8× | `#f0cdff` pale lilac |
| in use, 3× | `#4f345a` muted violet |

These are already crown-chakra violets, which is why the brief's token set and
her live palette agree closely. Adopted light, per Garry's decision 2026-08-05,
because **11 of her 16 photographs are a high-key white studio shoot** and were
being destroyed by a sepia filter forcing them into a near-black design.

**Hard constraint discovered:** gold `#DBB757` measures **1.83:1** on the cream
background — it fails WCAG AA badly. **Gold is fills and hairlines only, never
text.** Violet carries all small type. Verified: zero contrast failures sitewide.

## 16. WebP/AVIF encoding — TOOLING GAP

This machine has neither `cwebp` nor WebP support in `sips`, so new derivatives
cannot be encoded to WebP locally. Existing `assets/*.webp` predate this.

Fix: `brew install webp`. Until then derivatives are high-quality JPEG, which
costs roughly 25–30% more bytes.
