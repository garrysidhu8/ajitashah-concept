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

**2026-08-11 full-site extraction — the complete picture.** Agents extracted
every testimonial on her site (the case studies hide behind JetPopup AJAX and
required a live browser session): **33 testimonials, 13 YouTube videos**, full
verbatim archive in `content-extracted/testimonials.json`, compliance screen in
`content-extracted/screened.json`.

Screen result: **29 of 33 carry medical or outcome claims.** The four "ok"
entries are ok only because they are video cards with no on-page text. The
flagged set includes claims that go far beyond the homepage snapshot: a kidney-
stone **surgery cancelled** the night before; **pregnancy at 42 after two failed
IVF rounds**; a **Celiac diagnosis "overturned" with blood work**; 35-year
psoriasis cleared in a month; a child's sexual-abuse trauma resolved **in one
session**; children's services releasing a child; arthritis pain subsiding; a
10-year chronic cough specialists couldn't treat; two addiction-cessation
claims; multiple concrete business/legal outcomes ($100k over asking, lawsuit
collapse, business doubled).

**Published on the concept:** only the 4 no-text video cards (Shamaila, Laima,
Maggie, Kasia) as click-to-load embeds, plus the 4 previously-softened written
quotes. **Withheld:** all 24 written case studies and the 9 case-study videos.

`TODO_CONTENT` (blocking for any testimonial expansion):
1. Someone must **watch all 13 videos** — the spoken content was not screened,
   and an embedded video carrying a medical claim is still a published claim.
2. Consent records for every named client.
3. Ajita's decision on the case-study library: rewritten as experience stories,
   or retired. The raw material is preserved verbatim for that conversation.

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

**2026-08-11 — MIGRATED.** All 30 posts pulled from her WP REST API
(`blog-data/posts.json` snapshot) and built as static pages at `/<slug>/` —
root level, exactly matching her live URLs, zero redirects needed. Post body
HTML is verbatim; only the page shell (nav, typography, compliance footer,
BlogPosting schema) is ours. `/blog/` index page + Blog tab added to nav and
footer. The 21 missing meta descriptions are auto-derived from each post's
own opening paragraph (her words) until written properly. Rebuild with
`python3 tools/build_blog.py` after refreshing the JSON.

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

## 16. Chat guide — SCRIPTED V1, LLM SWAP AT DEPLOY

Garry asked for "a really smart chatbot" where people can book a meeting.
Built 2026-08-05 as a **scripted concierge**, deliberately not an LLM yet:
a static site has no server to hold an API key, and a key in browser JS is
public. The flow is shaped as a request/response loop so a Claude serverless
function (same pattern as the Lindsay-site concierge) can replace the brain at
deploy time without changing the UI.

Safety decisions baked in:
- Discloses on open: not Ajita, not a therapist; nothing typed is saved or sent.
- Six-area guidance uses only the non-clinical questionnaire items (§12 rules).
- Crisis regex on every free-text input (chat + check-in). On match: funnel
  stops — no recommendation, no booking push — 9-8-8/911 message only.
  Pattern tuned against false positives: idioms like "this job is killing me"
  do NOT trigger; "kill myself / ending my life / wish I were dead" do.
- Booking = the three appointment questions Garry specified (pressing issue /
  how long / prior help), all skippable, summarized on-screen only, ending at
  her phone number.

`TODO_CONTENT`: booking URL (she had an online scheduler in 2023 — ask what she
uses now) and the email address (§9) — until then the only handoff is `tel:`.
When the LLM brain lands: spend cap, rate limiting, max_tokens, no transcript
storage, and adversarial testing per the 2026-07-30 strategy brief.

## 17a. Program landing pages — BUILT 2026-08-11, ADAPTATION NOTES

Three pages built from her live-site copy (extracted verbatim by agents, then
adapted): `/becoming-unlimited/`, `/omni-source/`, `/inner-os/`.

Slugs: the first two match her live URLs exactly (equity transfers). **Inner OS
is a NEW slug** — her page lives at `/mastery-for-conscious-leadership/`; at
launch that URL needs a 301 to `/inner-os/`. Her `/executive-mastry/` page is an
empty draft (typo'd slug, no content) — let it die.

Compliance adaptations (her original → published):
- "mindset shifts, therapy or spiritual tools" → "mindset work and spiritual
  tools" (avoids deeper-than-therapy comparison)
- What-clients-heal list: **"Physical diseases or conditions"** → "The weight
  that health struggles place on a life" (RHPA §30 lane)
- "Trauma — past life, childhood, ancestral…" → "Old wounds — childhood,
  ancestral, or long-buried emotional memory"
- "spiritual counselling" → "guidance" (per §5, applied consistently)
- Inner OS "Regulate their nervous system" → "Stay sharp, recover fast…"
  (kept the meaning, dropped the clinical verb); her line **"It's not
  coaching. It's not therapy."** kept verbatim — it does real legal work
- Her **timezone table is wrong on her own site**: "Tuesday 7pm–8:30pm EST /
  8:00–9:30pm UAE / 1:00–2:30pm UK" — 7 pm Toronto is ~4 am UAE and ~midnight
  UK. Published Toronto time only. `TODO_CONTENT`: confirm the intended
  session time with her before adding conversions.
- Her Conscious-Leadership inquiry form asks **current/desired monthly income
  and "how much are you willing to invest"** — not reproduced; qualification
  questions of that kind undercut the trauma-informed positioning. Her call.

Videos: 3 YouTube embeds found on her `/omni-source/` (SDVGEySSJpU short,
n3dhNv1aAiI, OyD9deB0wAA) — re-embedded as click-to-load youtube-nocookie
facades. No videos exist on her Becoming Unlimited, Inner OS, About or Contact
pages.

## 17. WebP/AVIF encoding — TOOLING GAP

This machine has neither `cwebp` nor WebP support in `sips`, so new derivatives
cannot be encoded to WebP locally. Existing `assets/*.webp` predate this.

Fix: `brew install webp`. Until then derivatives are high-quality JPEG, which
costs roughly 25–30% more bytes.

## 18. Her 2026-08-11 copy drop — ADAPTED, NEEDS HER SIGN-OFF

Garry posted her copy (see `CONTENT-INTAKE-2026-08-11.md` for verbatim
originals): home page doc, a bio intro, and a Testimonials & Case Studies
page intro. All woven into the home page. What changed and why:

- **Hero** now uses her quote — "Become Unlimited through healing" — with
  "For the ones who want more for their life" as the kicker. The former
  headline ("You're welcome here, exactly as you are") moved into the sub-line,
  so the empathy-first entry survives.
- **Scorecard lede** now opens with her "What would you love to change?"
  framing, near-verbatim.
- **"Create an Intentional Life"** — her 8 recognition bullets, verbatim, as a
  new section replacing the decorative marquee. Each routes to the check-in.
- **Manifesto** is now her words: "What you don't heal, you repeat…unlimited
  spiritual being…power as a creator."
- **My Work** — new first-person section, her 4 paragraphs near-verbatim.
  ONE change: "improvement in your mental and emotional health" →
  "improvement in how you feel, think and carry yourself" (unlicensed
  practitioner should not promise mental-health outcomes; Ontario risk).
- **Bio (healer lede):** "worked with people across five continents" kept —
  NEW CONFIRMED FACT, also now a stat (35+ years · 5 continents · Toronto,
  replacing the weak "90-day programs" stat). TWO clauses softened:
  "conditions that medicine called incurable" → cut entirely (medical claim);
  "patterns that years of therapy could not shift" → "years of trying"
  (implicit superiority-to-psychotherapy claim). The emotional shape —
  suffering so old it feels like destiny — kept.
- **Voices** retitled "Stories of Transformation" (her phrase) with her
  proof-of-the-pudding intro adapted above the quotes. Deliberately NOT
  adopted: "case-studies detailing the results I've helped my clients
  achieve" — results-claim language (§11), and no case-study content exists
  yet anyway.
- **CTA button** → her words: "I am ready for a new life."

`TODO_CONTENT`: her home doc calls for an **intro video** after the quiz —
no asset exists. Get the video (or drop the slot). And walk her through every
softening above before anything ships.

## 19. Testimonial wall ("the room") — 2026-08-11, NEEDS HER SIGN-OFF

Garry's brief: the Voices section should feel like a room of a hundred people
bragging about Ajita. Built as a three-column drifting wall of quotes + stats
strip (20 voices · 8 countries · 35+ years) + her brochure pull-quote, on top
of the existing featured slider and video row.

**Hard rule honoured: no invented people.** The wall holds 12 real, named
voices — 11 from the two 2026-08-11 docx files + Mobeka's already-softened
site quote. The counts in the stats strip are countable on the page
(12 wall + 4 slider + 4 videos = 20 voices; US, France, Canada, Israel,
India, UAE, UK, Poland = 8 countries). If she wants a bigger room, she
supplies more testimonials.

**Per-person trims (all §11 lane — medical/clinical outcome claims out,
subjective experience kept):**
- Ines: dropped "panic attacks" and "without any anxiety" (clinical symptom
  resolution); kept stress → well-being arc.
- Gloria: dropped the arthritis story entirely (medical pain-resolution
  claim); kept the professionalism/recommendation lines.
- Esther Lee: dropped the word "depressions"; kept lighter/burdens/energized.
- Girija: dropped "her therapy" (restricted framing) and "inbuilt and
  incurable"; kept professional/wise/genuine + happiness line.
- Kishan: dropped "freedom from a dozen aches and pains and ailments"
  (medical); kept sleep/energy/new-person arc.
- Susan: dropped the counselling/life-coaching comparison (superiority-over-
  care claim) and "heal deep childhood trauma" as an outcome assertion; kept
  look-at-myself/tools/life-changing.
- Jacqueline, Sanjay, Peter, Michael, Robert: near-verbatim, only trimmed
  for length.

The 24 third-person case studies from her live site stay archived in
content-extracted/ awaiting the phone conversation (§11) — they are her
narrations, many with named medical conditions, and do not belong on a
public wall in that form.
