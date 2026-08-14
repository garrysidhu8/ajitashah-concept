#!/usr/bin/env python3
"""Render the case-studies universe section into testimonials/index.html.

Reads blog-data/case-studies.json (verbatim texts harvested from
ajitashah.com/testimonial/ — see content-extracted/) and replaces whatever
sits between the CASE_STUDIES markers. Word-for-word: section texts are her
own published copy and are NOT edited here (§24).

Media: 9 people have their real video testimonials (YouTube popups on her
live page); 15 have illustrative portraits in assets/people/ (AI-generated
placeholders, disclosed on the page — §24).

Rerun: python3 tools/build_case_studies.py
"""

import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
START = '<!-- CASE_STUDIES:START -->'
END = '<!-- CASE_STUDIES:END -->'

# Withheld from the demo — §24: both narrate a MINOR's gravest private
# crisis (sexual abuse; suicidality/child-services removal) as marketing.
# They stay archived for the phone conversation with Ajita; do not publish
# without her explicit, informed decision.
EXCLUDE = {'P G Gerald', 'Wolfgang'}

COUNT_WORDS = {20: 'Twenty', 21: 'Twenty-one', 22: 'Twenty-two',
               23: 'Twenty-three', 24: 'Twenty-four'}

CHAKRAS = ['ch-root', 'ch-sacral', 'ch-solar', 'ch-heart',
           'ch-throat', 'ch-third-eye', 'ch-crown']


def esc(t):
    return html.escape(t, quote=False)


def media_html(c):
    if c['video']:
        yt = c['video']
        return (f'<a class="cs-media yt-facade" href="https://www.youtube.com/watch?v={yt}"'
                f' target="_blank" rel="noopener" data-hover'
                f' aria-label="Watch {esc(c["name"])}\'s video testimonial on YouTube">'
                f'<img src="https://i.ytimg.com/vi/{yt}/hqdefault.jpg" alt=""'
                f' width="480" height="360" loading="lazy" decoding="async">'
                f'<span class="yt-play" aria-hidden="true"></span>'
                f'<span class="yt-label">{esc(c["name"])} — in their own words</span></a>')
    return (f'<div class="cs-media cs-portrait"><img src="/assets/people/{c["portrait"]}.webp"'
            f' alt="Illustrative portrait representing {esc(c["name"])}"'
            f' width="480" height="640" loading="lazy" decoding="async"></div>')


def story_html(c):
    parts = []
    for s in c['sections']:
        body = ''.join(f'<p>{esc(p.strip())}</p>'
                       for p in re.split(r'\n\s*\n|\n', s['text']) if p.strip())
        if s['label']:
            parts.append(f'<h4 class="cs-label">{esc(s["label"])}</h4>{body}')
        else:
            parts.append(body)
    return ''.join(parts)


def build():
    data = json.loads((ROOT / 'blog-data' / 'case-studies.json').read_text())
    studies = [c for c in data['case_studies'] if c['name'] not in EXCLUDE]
    cards = []
    for i, c in enumerate(studies):
        dot = CHAKRAS[i % len(CHAKRAS)]
        teaser = c['teaser'] or 'A story of transformation'
        cards.append(f'''      <article class="cs-card cs-float-{i % 3 + 1}">
        {media_html(c)}
        <p class="cs-name"><span class="wall-dot" style="--wd: var(--{dot})" aria-hidden="true"></span>
          {esc(c['name'])} <span class="cs-role">· {esc(c['role'])}</span></p>
        <h3 class="cs-teaser">“{esc(teaser)}”</h3>
        <details class="cs-story">
          <summary data-hover>Read the full story <i aria-hidden="true">→</i></summary>
          <div class="cs-story-body">{story_html(c)}</div>
        </details>
      </article>''')

    section = f'''{START}
    <section class="cs-universe" aria-label="Case studies">
      <div class="cs-clouds" aria-hidden="true"></div>
      <p class="section-label centered">Case studies · in her words</p>
      <h2 class="section-title centered">{COUNT_WORDS.get(len(studies), str(len(studies)))} journeys,<br>told in <em>full</em></h2>
      <p class="cs-lede">Every story below is exactly as Ajita tells it — the situation,
      the healing, and what happened next. Nine of these people also speak for
      themselves on video.</p>
      <div class="cs-grid">
{chr(10).join(cards)}
      </div>
    </section>
    {END}'''

    page = ROOT / 'testimonials' / 'index.html'
    html_text = page.read_text()
    pattern = re.compile(re.escape(START) + '.*?' + re.escape(END), re.S)
    if pattern.search(html_text):
        html_text = pattern.sub(lambda m: section, html_text)
    else:
        raise SystemExit('markers not found in testimonials/index.html')
    page.write_text(html_text)
    print(f'rendered {len(cards)} case studies into testimonials/index.html')


if __name__ == '__main__':
    build()
