/* ═══════════════════════════════════════════════
   AJITA SHAH — Interaction layer
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TOUCH = window.matchMedia('(hover: none)').matches;

  // Dev helper: ?solo=<sectionId> isolates one section at the top of the page
  var SOLO = new URLSearchParams(location.search).get('solo');
  if (SOLO) {
    document.documentElement.classList.add('solo');
    document.querySelectorAll('main > *, .marquee, .footer').forEach(function (el) {
      if (el.id !== SOLO && !el.classList.contains(SOLO)) el.style.display = 'none';
    });
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    var pre = document.getElementById('preloader');
    if (pre) pre.style.display = 'none';
    setTimeout(function () {
      document.querySelectorAll('.manifesto-text .word').forEach(function (w) { w.style.opacity = 1; });
      document.querySelectorAll('.stat-num').forEach(function (el) {
        el.textContent = parseInt(el.dataset.count, 10).toLocaleString();
      });
    }, 400);
  }

  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ══════════ SMOOTH SCROLL ══════════ */
  var lenis = null;
  if (window.Lenis && !REDUCED) {
    lenis = new Lenis({ duration: 1.25, smoothWheel: true });
    lenis.on('scroll', function () { if (window.ScrollTrigger) ScrollTrigger.update(); });
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Anchor links through Lenis
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ══════════ PRELOADER ══════════ */
  var preloader = document.getElementById('preloader');
  var countEl = document.getElementById('preloaderCount');
  var heroTitle = document.getElementById('heroTitle');

  // Split hero title into letters
  if (heroTitle) {
    var text = heroTitle.textContent;
    heroTitle.textContent = '';
    text.split('').forEach(function (ch) {
      var s = document.createElement('span');
      s.className = 'ch';
      s.innerHTML = ch === ' ' ? '&nbsp;' : ch;
      heroTitle.appendChild(s);
    });
  }

  function revealHero() {
    if (!window.gsap) {
      if (preloader) preloader.style.display = 'none';
      return;
    }
    var tl = gsap.timeline();
    tl.to(preloader, { opacity: 0, duration: 0.9, ease: 'power2.inOut' })
      .set(preloader, { display: 'none' })
      .from('#heroTitle .ch', {
        opacity: 0, y: 90, rotateX: -60, filter: 'blur(8px)',
        duration: 1.4, stagger: 0.045, ease: 'power3.out'
      }, '-=0.25')
      .from('[data-hero-fade]', {
        opacity: 0, y: 30, duration: 1.1, stagger: 0.12, ease: 'power2.out'
      }, '-=0.9');
  }

  if (preloader && countEl && window.gsap && !REDUCED) {
    var counter = { v: 0 };
    gsap.to(counter, {
      v: 100, duration: 1.9, ease: 'power2.inOut',
      onUpdate: function () { countEl.textContent = Math.round(counter.v); },
      onComplete: function () {
        if (document.readyState === 'complete') revealHero();
        else window.addEventListener('load', revealHero, { once: true });
      }
    });
  } else {
    if (preloader) preloader.style.display = 'none';
  }

  /* ══════════ CURSOR ══════════ */
  if (!TOUCH) {
    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (dot) dot.style.transform = 'translate(' + (mx - 3) + 'px,' + (my - 3) + 'px)';
    }, { passive: true });
    (function cursorLoop() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (ring) ring.style.transform = 'translate(' + (rx - 19) + 'px,' + (ry - 19) + 'px)';
      requestAnimationFrame(cursorLoop);
    })();
    document.querySelectorAll('[data-hover]').forEach(function (el) {
      el.addEventListener('pointerenter', function () { ring && ring.classList.add('is-hover'); });
      el.addEventListener('pointerleave', function () { ring && ring.classList.remove('is-hover'); });
    });
  }

  /* ══════════ NAV ══════════ */
  var nav = document.getElementById('nav');
  var lastY = 0;
  function onScrollNav() {
    var y = window.scrollY;
    if (nav) {
      nav.classList.toggle('scrolled', y > 80);
      nav.classList.toggle('hidden', y > 500 && y > lastY);
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  if (lenis) lenis.on('scroll', onScrollNav);

  /* ══════════ SCROLL REVEALS ══════════ */
  if (window.gsap && window.ScrollTrigger && !REDUCED) {

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.3, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true }
      });
    });

    // Manifesto: word-by-word illumination
    var mText = document.getElementById('manifestoText');
    if (mText && SOLO) {
      mText.innerHTML = '<span class="word" style="opacity:1">' + mText.textContent.trim() + '</span>';
    } else if (mText) {
      var words = mText.textContent.trim().split(/\s+/);
      mText.innerHTML = words.map(function (w) {
        return '<span class="word">' + w + '</span>';
      }).join(' ');
      gsap.to('#manifestoText .word', {
        opacity: 1, stagger: 0.06, ease: 'none',
        scrollTrigger: {
          trigger: '#manifesto',
          start: 'top 70%',
          end: 'bottom 75%',
          scrub: 0.6
        }
      });
    }

    // Journey parallax
    gsap.fromTo('#journeyImg',
      { yPercent: -10 },
      {
        yPercent: 10, ease: 'none',
        scrollTrigger: { trigger: '#journey', start: 'top bottom', end: 'bottom top', scrub: true }
      });

    // Stats count-up
    document.querySelectorAll('.stat-num').forEach(function (el) {
      var target = parseInt(el.dataset.count, 10);
      var obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 2.2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate: function () {
          el.textContent = Math.round(obj.v).toLocaleString();
        }
      });
    });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    document.querySelectorAll('.stat-num').forEach(function (el) {
      el.textContent = parseInt(el.dataset.count, 10).toLocaleString();
    });
  }

  /* ══════════ CARD TILT ══════════ */
  if (!TOUCH) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.transform =
          'rotateY(' + ((px - 0.5) * 7) + 'deg) rotateX(' + ((0.5 - py) * 7) + 'deg) translateZ(6px)';
        card.style.setProperty('--gx', (px * 100) + '%');
        card.style.setProperty('--gy', (py * 100) + '%');
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = 'rotateY(0deg) rotateX(0deg)';
      });
    });
  }

  /* ══════════ CHECK-IN ══════════
     Trauma-informed intake. Two rules hold this together:
     nothing the visitor types is ever stored or transmitted, and every
     step keeps a visible way out. Only a "seen" flag is persisted —
     never the chosen answer, never the text.  ?checkin=reset clears it.
  ══════════════════════════════════ */
  (function checkin() {
    var root = document.getElementById('checkin');
    if (!root) return;

    var STORE = 'ajita_checkin_seen';
    var params = new URLSearchParams(location.search);
    if (params.get('checkin') === 'reset') {
      try { localStorage.removeItem(STORE); } catch (e) {}
    }

    var REPLIES = {
      exhausted: {
        text: "Exhaustion that has no name usually isn't about sleep. It's what happens when " +
              "you've carried something for a long time without ever being allowed to set it down.",
        cta: 'Sit in the free circle', href: '#programs'
      },
      stuck: {
        text: "When something won't let you move past it, that isn't weakness. Part of you is " +
              "still standing in that moment, waiting for someone to come back for it.",
        cta: 'Talk with Ajita privately', href: '#begin'
      },
      mask: {
        text: "Holding it together so well that nobody thinks to ask is its own kind of tiring. " +
              "You don't have to perform that here.",
        cta: 'Sit in the free circle', href: '#programs'
      },
      patterns: {
        text: "A pattern that keeps returning isn't a failure of willpower. It's something you " +
              "learned early, still trying to keep you safe in a way that no longer fits.",
        cta: 'Talk with Ajita privately', href: '#begin'
      },
      looking: {
        text: "That's completely fine. Nothing here needs anything from you — stay as long as " +
              "you like, and leave whenever you want.",
        cta: 'Keep reading', href: '#journey', quiet: true
      }
    };

    var steps = root.querySelectorAll('.ci-step');
    var echo = document.getElementById('ciEcho');
    var textEl = document.getElementById('ciText');
    var reflectionEl = document.getElementById('ciReflection');
    var routeEl = document.getElementById('ciRoute');
    var chosen = null;

    // Dynamically added anchors still need to travel through Lenis
    function bindSmooth(scope) {
      scope.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var target = document.querySelector(a.getAttribute('href'));
          if (!target) return;
          e.preventDefault();
          if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
          else target.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }

    function show(n) {
      steps.forEach(function (s) {
        s.classList.toggle('is-active', s.dataset.step === String(n));
      });
      var active = root.querySelector('.ci-step.is-active');
      if (active) {
        active.setAttribute('tabindex', '-1');
        active.focus({ preventScroll: true });
      }
    }

    // Reveal the reflection a beat late, word by word — an instant
    // answer reads as a machine; a pause reads as someone thinking.
    function reflect(key) {
      var reply = REPLIES[key];
      var words = reply.text.split(/\s+/);
      reflectionEl.innerHTML = words.map(function (w) {
        return '<span class="word">' + w + '</span>';
      }).join(' ');

      if (window.gsap && !REDUCED) {
        gsap.to('#ciReflection .word', {
          opacity: 1, duration: 0.5, stagger: 0.055, delay: 0.6, ease: 'none'
        });
      } else {
        reflectionEl.classList.add('is-shown');
      }

      var html = '<a href="' + reply.href + '" class="' +
        (reply.quiet ? 'btn-ghost' : 'btn-gold') + '" data-hover>' + reply.cta + '</a>';
      if (!reply.quiet) {
        html += '<a href="#healer" class="ci-skip" data-hover>Or just keep reading</a>';
      }
      routeEl.innerHTML = html;
      bindSmooth(routeEl);
      show(3);
    }

    root.querySelectorAll('.ci-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        chosen = btn.dataset.key;
        try { localStorage.setItem(STORE, '1'); } catch (e) {}

        // Someone who says they're only browsing is not asked to open up.
        if (chosen === 'looking') { reflect(chosen); return; }

        echo.textContent = btn.textContent.trim();
        show(2);
      });
    });

    root.querySelectorAll('[data-ci-next]').forEach(function (btn) {
      btn.addEventListener('click', function () { reflect(chosen); });
    });

    document.getElementById('ciRestart').addEventListener('click', function () {
      chosen = null;
      if (textEl) textEl.value = '';
      show(1);
    });
  })();

  /* ══════════ VOICES SLIDER ══════════ */
  (function voices() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.voice'));
    var dotsWrap = document.getElementById('voicesDots');
    if (!slides.length || !dotsWrap) return;
    var idx = 0, timer = null;

    slides.forEach(function (_, i) {
      var d = document.createElement('span');
      if (i === 0) d.classList.add('on');
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.children;

    function go(n) {
      slides[idx].classList.remove('active');
      dots[idx].classList.remove('on');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('active');
      dots[idx].classList.add('on');
    }
    function auto() {
      clearInterval(timer);
      timer = setInterval(function () { go(idx + 1); }, 6500);
    }
    document.getElementById('voiceNext').addEventListener('click', function () { go(idx + 1); auto(); });
    document.getElementById('voicePrev').addEventListener('click', function () { go(idx - 1); auto(); });
    auto();
  })();

})();
