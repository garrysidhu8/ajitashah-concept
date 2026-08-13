#!/usr/bin/env python3
"""Generate the blog from blog-data/posts.json (WP REST API snapshot).

Her 30 posts live at ajitashah.com/<slug>/ — root level, no /blog/ prefix.
To preserve every URL exactly on static hosting, each post is written to
<slug>/index.html in the project root, plus a blog/index.html listing page.
Post body HTML is reproduced VERBATIM from content.rendered — the migration
promise is word-for-word, so nothing in the content is rewritten here.

Meta descriptions come from SEO-MIGRATION.csv where her site had one; the 21
posts that never had one get the first sentence(s) of their own opening
paragraph (her words, ~155 chars).

Rerun after refreshing blog-data/posts.json:  python3 tools/build_blog.py
"""

import csv
import html as htmllib
import json
import re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://ajitashah.com"

RESERVED = {"assets", "blog", "blog-data", "css", "js", "tools", "vendor"}


def strip_tags(fragment: str) -> str:
    text = re.sub(r"<[^>]+>", " ", fragment)
    text = htmllib.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def first_paragraph(content: str) -> str:
    for match in re.finditer(r"<p\b[^>]*>(.*?)</p>", content, re.S):
        text = strip_tags(match.group(1))
        if len(text) > 40:
            return text
    return strip_tags(content)[:200]


def first_sentences(text: str, limit: int = 155) -> str:
    if len(text) <= limit:
        return text
    out = ""
    for part in re.split(r"(?<=[.!?])\s+", text):
        if out and len(out) + len(part) + 1 > limit:
            break
        out = f"{out} {part}".strip()
        if len(out) >= limit * 0.6:
            break
    return out if out else text[: limit - 1].rsplit(" ", 1)[0] + "…"


def reading_minutes(content: str) -> int:
    return max(1, round(len(strip_tags(content).split()) / 200))


def fmt_date(iso: str) -> str:
    return datetime.fromisoformat(iso).strftime("%B %-d, %Y")


def esc(value: str) -> str:
    return htmllib.escape(value, quote=True)


def head(title, description, path, og_type="article", og_image=None):
    url = f"{SITE}{path}"
    image = og_image or f"{SITE}/assets/og-image.jpg"
    return f"""<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(description)}">
  <link rel="canonical" href="{url}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:type" content="{og_type}">
  <meta property="og:site_name" content="Ajita Shah">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(description)}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{image}">
  <meta property="og:locale" content="en_CA">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{esc(title)}">
  <meta name="twitter:description" content="{esc(description)}">
  <link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/fonts/cormorant.woff2">
  <link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/fonts/manrope.woff2">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/blog.css">"""


NAV = """  <header class="nav scrolled blog-nav">
    <a href="/" class="nav-logo" data-hover>Ajita <em>Shah</em></a>
    <nav class="nav-links">
      <a href="/#healer" data-hover>The Healer</a>
      <a href="/#journey" data-hover>The Journey</a>
      <a href="/#programs" data-hover>Programs</a>
      <a href="/#voices" data-hover>Voices</a>
      <a href="/blog/" class="is-active" data-hover>Blog</a>
    </nav>
    <div class="nav-right">
      <a href="/#begin" class="nav-cta" data-hover>Contact Ajita</a>
    </div>
  </header>"""

FOOTER = """  <footer class="footer">
    <div class="footer-top">
      <a href="/" class="footer-logo" data-hover>Ajita <em>Shah</em></a>
      <nav class="footer-links">
        <a href="/#healer" data-hover>About</a>
        <a href="/#programs" data-hover>Programs</a>
        <a href="/testimonials/" data-hover>Testimonials</a>
        <a href="/blog/" data-hover>Blog</a>
        <a href="/#begin" data-hover>Contact</a>
      </nav>
      <div class="footer-contact">
        <a href="tel:+14165793700" data-hover>+1 416 579 3700</a>
        <p class="footer-locale">Toronto, Canada</p>
      </div>
      <div class="footer-social">
        <a href="https://www.instagram.com/ajitashahofficial/" target="_blank" rel="noopener" data-hover>Instagram</a>
        <a href="https://www.youtube.com/@ajitashah_official" target="_blank" rel="noopener" data-hover>YouTube</a>
        <a href="https://www.linkedin.com/in/theajitashah" target="_blank" rel="noopener" data-hover>LinkedIn</a>
        <a href="https://www.tiktok.com/@ajitashah_official" target="_blank" rel="noopener" data-hover>TikTok</a>
      </div>
    </div>
    <div class="footer-legal">
      <p><strong>Ajita Shah offers spiritual and energy healing and coaching.</strong>
      This is not medical care, psychological treatment, or therapy, and it is not a
      substitute for professional help. Nothing on this site is a diagnosis or a promise
      of any particular outcome.</p>
      <p class="footer-crisis">If you are in crisis, call or text <strong>9-8-8</strong>
      — Canada's Suicide Crisis Helpline, available 24/7 in English and French.
      If you are in immediate danger, call <strong>911</strong>.</p>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Ajita Shah. All rights reserved.</p>
      <p class="footer-credit">Concept design — Jobaki</p>
    </div>
  </footer>"""

CHAKRAS = ["ch-root", "ch-sacral", "ch-solar", "ch-heart",
           "ch-throat", "ch-third-eye", "ch-crown"]


def article_jsonld(post, description, image_url=None):
    data = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": strip_tags(post["title"]["rendered"]),
        "description": description,
        "datePublished": post["date"],
        "dateModified": post["modified"],
        "url": f"{SITE}/{post['slug']}/",
        "mainEntityOfPage": f"{SITE}/{post['slug']}/",
        "image": image_url or f"{SITE}/assets/og-image.jpg",
        "author": {"@type": "Person", "@id": f"{SITE}/#ajita", "name": "Ajita Shah"},
        "publisher": {"@type": "Person", "@id": f"{SITE}/#ajita", "name": "Ajita Shah"},
    }
    return json.dumps(data, indent=2, ensure_ascii=False)


def build():
    posts = json.loads((ROOT / "blog-data" / "posts.json").read_text(encoding="utf-8"))
    posts.sort(key=lambda p: p["date"], reverse=True)

    # Featured images: slug -> {file, w, h}, downloaded from her WP media
    # library into assets/blog/ (see blog-data/images.json).
    images_path = ROOT / "blog-data" / "images.json"
    images = json.loads(images_path.read_text(encoding="utf-8")) if images_path.exists() else {}

    meta_by_slug = {}
    csv_path = ROOT / "SEO-MIGRATION.csv"
    if csv_path.exists():
        with csv_path.open(encoding="utf-8") as fh:
            for row in csv.DictReader(fh):
                desc = (row.get("meta_description") or "").strip()
                if desc:
                    meta_by_slug[row["slug"].strip()] = desc

    for post in posts:
        if post["slug"] in RESERVED:
            raise SystemExit(f"slug collides with a project directory: {post['slug']}")

    for i, post in enumerate(posts):
        slug = post["slug"]
        title_text = strip_tags(post["title"]["rendered"])
        page_title = f"{title_text} – Ajita Shah"
        content = post["content"]["rendered"].strip()
        description = meta_by_slug.get(slug) or first_sentences(first_paragraph(content))
        newer = posts[i - 1] if i > 0 else None
        older = posts[i + 1] if i + 1 < len(posts) else None

        def pager_link(p, label, cls):
            if not p:
                return f'<span class="post-pager-slot"></span>'
            return (f'<a class="post-pager-link {cls}" href="/{p["slug"]}/" data-hover>'
                    f'<span>{label}</span>'
                    f'<strong>{p["title"]["rendered"]}</strong></a>')

        img = images.get(slug)
        img_url = f"{SITE}/{img['file']}" if img else None
        hero_html = ""
        if img:
            hero_html = (f'\n      <figure class="post-hero">'
                         f'<img src="/{img["file"]}" alt="{esc(title_text)}" '
                         f'width="{img["w"]}" height="{img["h"]}" '
                         f'fetchpriority="high" decoding="async"></figure>\n')

        page = f"""{head(page_title, description, f"/{slug}/", og_image=img_url)}
  <script type="application/ld+json">
{article_jsonld(post, description, img_url)}
  </script>
</head>
<body class="blog-body">
{NAV}
  <main class="post">
    <article>
      <header class="post-head">
        <p class="section-label centered"><a href="/blog/" data-hover>Blog</a></p>
        <h1 class="post-title">{post["title"]["rendered"]}</h1>
        <p class="post-meta">
          <time datetime="{post["date"]}">{fmt_date(post["date"])}</time>
          <span aria-hidden="true">·</span>
          {reading_minutes(content)} min read
          <span aria-hidden="true">·</span>
          Ajita Shah
        </p>
      </header>
{hero_html}
      <!-- Post body reproduced verbatim from ajitashah.com — do not edit here;
           refresh blog-data/posts.json and rerun tools/build_blog.py instead. -->
      <div class="post-content">
{content}
      </div>
    </article>

    <nav class="post-pager" aria-label="More articles">
      {pager_link(older, "← Older", "is-prev")}
      {pager_link(newer, "Newer →", "is-next")}
    </nav>

    <section class="post-cta">
      <h2>Your healing has already <em>begun.</em></h2>
      <p>The moment you arrived here was not an accident.
      Take the first step — the rest will meet you.</p>
      <a href="/#scorecard" class="btn-gold" data-hover>Find where to start</a>
    </section>
  </main>
{FOOTER}
</body>
</html>
"""
        out = ROOT / slug / "index.html"
        out.parent.mkdir(exist_ok=True)
        out.write_text(page, encoding="utf-8")

    cards = []
    for i, post in enumerate(posts):
        slug = post["slug"]
        title_html = post["title"]["rendered"]
        content = post["content"]["rendered"]
        description = meta_by_slug.get(slug) or first_sentences(first_paragraph(content))
        chakra = CHAKRAS[i % len(CHAKRAS)]
        img = images.get(slug)
        thumb = ""
        if img:
            thumb = (f'\n        <img class="blog-card-img" src="/{img["file"]}" alt="" '
                     f'width="{img["w"]}" height="{img["h"]}" loading="lazy" decoding="async">')
        cards.append(f"""      <a class="blog-card" href="/{slug}/" data-hover>{thumb}
        <p class="blog-card-meta">
          <span class="blog-card-dot" style="background: var(--{chakra})" aria-hidden="true"></span>
          <time datetime="{post["date"]}">{fmt_date(post["date"])}</time>
          <span aria-hidden="true">·</span> {reading_minutes(content)} min read
        </p>
        <h2>{title_html}</h2>
        <p class="blog-card-excerpt">{esc(description)}</p>
        <span class="blog-card-more">Read <i>→</i></span>
      </a>""")

    index_page = f"""{head("Blog – Ajita Shah",
        "Writings from 35+ years of healing work — on energy, karma, relationships, and the inner life. By Ajita Shah, spiritual healer in Toronto.",
        "/blog/", og_type="website")}
</head>
<body class="blog-body">
{NAV}
  <main class="blog-index">
    <header class="blog-hero">
      <p class="section-label centered">The writing</p>
      <h1>Blog</h1>
      <p class="blog-hero-sub">Notes from 35+ years of healing work — on energy,
      karma, relationships, and the inner life.</p>
    </header>
    <div class="blog-grid">
{chr(10).join(cards)}
    </div>
  </main>
{FOOTER}
</body>
</html>
"""
    (ROOT / "blog").mkdir(exist_ok=True)
    (ROOT / "blog" / "index.html").write_text(index_page, encoding="utf-8")

    # Hand-built landing pages that live alongside the generated posts.
    # Keep in sync with the folders in the repo root.
    STATIC_PAGES = [
        ("becoming-unlimited", "2026-08-11"),
        ("omni-source", "2026-08-11"),
        ("inner-os", "2026-08-11"),
        ("videos", "2026-08-11"),
    ]

    urls = [f"""  <url>
    <loc>{SITE}/</loc>
    <lastmod>{max(p["modified"] for p in posts)[:10]}</lastmod>
  </url>
  <url>
    <loc>{SITE}/blog/</loc>
    <lastmod>{max(p["modified"] for p in posts)[:10]}</lastmod>
  </url>
  <url>
    <loc>{SITE}/testimonials/</loc>
    <lastmod>{max(p["modified"] for p in posts)[:10]}</lastmod>
  </url>"""]
    for slug, mod in STATIC_PAGES:
        urls.append(f"""  <url>
    <loc>{SITE}/{slug}/</loc>
    <lastmod>{mod}</lastmod>
  </url>""")
    for post in posts:
        urls.append(f"""  <url>
    <loc>{SITE}/{post["slug"]}/</loc>
    <lastmod>{post["modified"][:10]}</lastmod>
  </url>""")
    sitemap = ('<?xml version="1.0" encoding="UTF-8"?>\n'
               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
               + "\n".join(urls) + "\n</urlset>\n")
    (ROOT / "sitemap.xml").write_text(sitemap, encoding="utf-8")

    print(f"built {len(posts)} posts + blog/index.html + sitemap.xml")


if __name__ == "__main__":
    build()
