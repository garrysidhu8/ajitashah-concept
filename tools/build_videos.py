#!/usr/bin/env python3
"""Generate videos/index.html from Ajita's YouTube channel RSS.

Fetches the latest 15 uploads from channel UCHYNmtOmK3zJYAEgjOCsGlQ
(@ajitashah_official); falls back to the last snapshot in
blog-data/videos.json when offline. Rerun any time she uploads:

    python3 tools/build_videos.py
"""

import html as htmllib
import json
import re
import urllib.request
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://ajitashah.com"
CHANNEL_ID = "UCHYNmtOmK3zJYAEgjOCsGlQ"
CHANNEL_URL = "https://www.youtube.com/@ajitashah_official"
SNAPSHOT = ROOT / "blog-data" / "videos.json"


def esc(v: str) -> str:
    return htmllib.escape(v, quote=True)


def fetch_videos():
    url = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    xml = urllib.request.urlopen(req, timeout=30).read().decode("utf-8")
    out = []
    for entry in re.findall(r"<entry>(.*?)</entry>", xml, re.S):
        vid = re.search(r"<yt:videoId>([^<]+)</yt:videoId>", entry).group(1)
        title = htmllib.unescape(re.search(r"<title>([^<]*)</title>", entry).group(1))
        pub = re.search(r"<published>([^<]+)</published>", entry).group(1)[:10]
        out.append({"id": vid, "title": title, "published": pub})
    if not out:
        raise ValueError("RSS returned no entries")
    return out


def fmt_date(iso: str) -> str:
    return datetime.fromisoformat(iso).strftime("%B %-d, %Y")


def facade(v, big=False):
    quality = "maxresdefault" if big else "hqdefault"
    dims = 'width="1280" height="720"' if big else 'width="480" height="360"'
    return f"""        <button class="yt-facade{' yt-facade-big' if big else ''}" data-yt="{v['id']}" data-hover
          aria-label="Play: {esc(v['title'])}">
          <img src="https://i.ytimg.com/vi/{v['id']}/{quality}.jpg" alt="" {dims} decoding="async">
          <span class="yt-play" aria-hidden="true"></span>
          <span class="yt-label">{esc(v['title'])}<em>{fmt_date(v['published'])}</em></span>
        </button>"""


def build():
    try:
        videos = fetch_videos()
        SNAPSHOT.write_text(json.dumps(videos, indent=1), encoding="utf-8")
        print(f"fetched {len(videos)} videos from the channel RSS")
    except Exception as exc:
        videos = json.loads(SNAPSHOT.read_text(encoding="utf-8"))
        print(f"RSS unavailable ({exc}) — using snapshot of {len(videos)}")

    newest, rest = videos[0], videos[1:]

    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Watch Ajita — Weekly Videos on Healing, Karma &amp; Consciousness | Ajita Shah</title>
  <meta name="description" content="New videos every week from Toronto spiritual healer Ajita Shah — on karma, energy, consciousness, relationships and healing. Watch free on YouTube.">
  <link rel="canonical" href="{SITE}/videos/">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Ajita Shah">
  <meta property="og:title" content="Watch Ajita — Weekly Videos on Healing, Karma &amp; Consciousness">
  <meta property="og:description" content="New videos every week — on karma, energy, consciousness, relationships and healing.">
  <meta property="og:url" content="{SITE}/videos/">
  <meta property="og:image" content="https://i.ytimg.com/vi/{newest['id']}/maxresdefault.jpg">
  <meta property="og:locale" content="en_CA">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Manrope:wght@200;300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>

  <div class="cursor-dot" id="cursorDot"></div>
  <div class="cursor-ring" id="cursorRing"></div>

  <header class="nav" id="nav">
    <a href="/" class="nav-logo" data-hover>Ajita <em>Shah</em></a>
    <nav class="nav-links">
      <a href="/#healer" data-hover>The Healer</a>
      <a href="/#programs" data-hover>Programs</a>
      <a href="/blog/" data-hover>Blog</a>
      <a href="/videos/" class="is-active" data-hover>Videos</a>
    </nav>
    <div class="nav-right">
      <button class="nav-motion" id="motionToggle" data-hover aria-pressed="false">Reduce motion</button>
      <a href="/#scorecard" class="nav-cta" data-hover>Find where to start</a>
    </div>
  </header>

  <main id="top" style="--lp-accent: var(--ch-throat)">

    <section class="lp-hero">
      <div class="lp-hero-inner">
        <p class="lp-kicker"><span class="stage-dot" style="--stage: var(--ch-throat)" aria-hidden="true"></span>Her channel · New videos every week</p>
        <h1 class="lp-title">Watch <em>Ajita</em></h1>
        <p class="lp-lede">Short teachings on karma, energy, consciousness and
        the patterns underneath your life — free, in her own voice.</p>
        <div class="lp-facts">
          <span class="lp-fact">New videos every week</span>
          <span class="lp-fact">Free on YouTube</span>
        </div>
      </div>
    </section>

    <div class="lp-main lp-main-wide">
      <h2>The latest</h2>
      <div class="lp-videos lp-videos-feature">
{facade(newest, big=True)}
      </div>

      <h2>Recent videos</h2>
      <div class="lp-videos">
{chr(10).join(facade(v) for v in rest)}
      </div>

      <p class="lp-note">Videos open right here — nothing loads from YouTube until
      you press play. For everything else, visit
      <a href="{CHANNEL_URL}" target="_blank" rel="noopener" data-hover>her full channel</a>.</p>
    </div>

    <section class="begin" id="begin">
      <div class="begin-glow" aria-hidden="true"></div>
      <div class="begin-content">
        <h2 data-reveal>Never miss<br>a <em>teaching.</em></h2>
        <p data-reveal>She posts every week. Subscribing is free, and it's the easiest way to stay close.</p>
        <div class="begin-actions" data-reveal>
          <a href="{CHANNEL_URL}?sub_confirmation=1" target="_blank" rel="noopener" class="btn-gold large" data-hover>Subscribe on YouTube</a>
        </div>
        <p class="begin-note" data-reveal>Or <a href="/becoming-unlimited/" data-hover>join her free weekly circle</a> — live, not recorded.</p>
      </div>
    </section>

  </main>

  <footer class="footer">
    <div class="footer-top">
      <a href="/" class="footer-logo" data-hover>Ajita <em>Shah</em></a>
      <nav class="footer-links">
        <a href="/#healer" data-hover>About</a>
        <a href="/#programs" data-hover>Programs</a>
        <a href="/becoming-unlimited/" data-hover>Becoming Unlimited</a>
        <a href="/omni-source/" data-hover>OmniSource Healing</a>
        <a href="/inner-os/" data-hover>Inner OS™</a>
        <a href="/blog/" data-hover>Blog</a>
      </nav>
      <div class="footer-contact">
        <a href="tel:+14165793700" data-hover>+1 416 579 3700</a>
        <p class="footer-locale">Toronto, Canada</p>
      </div>
      <div class="footer-social">
        <a href="https://www.instagram.com/ajitashahofficial/" target="_blank" rel="noopener" data-hover>Instagram</a>
        <a href="{CHANNEL_URL}" target="_blank" rel="noopener" data-hover>YouTube</a>
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
  </footer>

  <script src="/vendor/gsap.min.js" defer></script>
  <script src="/vendor/ScrollTrigger.min.js" defer></script>
  <script src="/vendor/lenis.min.js" defer></script>
  <script src="/js/main.js" defer></script>
</body>
</html>
"""
    out = ROOT / "videos"
    out.mkdir(exist_ok=True)
    (out / "index.html").write_text(page, encoding="utf-8")
    print(f"built videos/index.html — 1 featured + {len(rest)} recent")


if __name__ == "__main__":
    build()
