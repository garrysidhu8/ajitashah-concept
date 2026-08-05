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
  // The hero headline is plain server-rendered text so it can be the LCP
  // element — no per-letter splitting, no layout thrash before first paint.
  function revealHero() {
    if (!window.gsap) {
      if (preloader) preloader.style.display = 'none';
      return;
    }
    var tl = gsap.timeline();
    tl.to(preloader, { opacity: 0, duration: 0.9, ease: 'power2.inOut' })
      .set(preloader, { display: 'none' })
      .from('.hero-content > *', {
        opacity: 0, y: 26, duration: 1.2, stagger: 0.14, ease: 'power2.out'
      }, '-=0.35')
      .from('.hero-scroll', { opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.6');
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

  /* ══════════ REDUCE-MOTION TOGGLE ══════════
     A real, persisted control — not just a media-query hope. Stops the
     breathing circle, marquee and pacer without hiding any content.
  ══════════════════════════════════════════════ */
  (function motionToggle() {
    var btn = document.getElementById('motionToggle');
    if (!btn) return;
    var KEY = 'ajita_reduce_motion';
    var on = false;
    try { on = localStorage.getItem(KEY) === '1'; } catch (e) {}

    function apply() {
      document.documentElement.classList.toggle('reduce-motion', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.textContent = on ? 'Motion reduced' : 'Reduce motion';
    }
    apply();

    btn.addEventListener('click', function () {
      on = !on;
      try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
      apply();
    });
  })();

  /* ══════════ GUIDED BREATH ══════════
     Opt-in only. 90 seconds at the 5.5s-in / 5.5s-out resonance pace,
     with a Stop control visible the whole time. A calming ritual —
     deliberately makes no health claim.
  ══════════════════════════════════════ */
  (function guidedBreath() {
    var startBtn = document.getElementById('breathStart');
    var guide = document.getElementById('breathGuide');
    var phaseEl = document.getElementById('breathPhase');
    var progressEl = document.getElementById('breathProgress');
    var stopBtn = document.getElementById('breathStop');
    if (!startBtn || !guide) return;

    var HALF = 5500;          // one phase
    var TOTAL = 90000;        // 90s round
    var phaseTimer = null, tickTimer = null, endTimer = null;

    function stop() {
      clearInterval(phaseTimer); clearInterval(tickTimer); clearTimeout(endTimer);
      guide.hidden = true;
      startBtn.hidden = false;
      progressEl.style.width = '0%';
      startBtn.focus({ preventScroll: true });
    }

    function start() {
      var started = Date.now();
      var inhale = true;
      phaseEl.textContent = 'Breathe in';
      guide.hidden = false;
      startBtn.hidden = true;
      stopBtn.focus({ preventScroll: true });

      phaseTimer = setInterval(function () {
        inhale = !inhale;
        phaseEl.textContent = inhale ? 'Breathe in' : 'Breathe out';
      }, HALF);

      tickTimer = setInterval(function () {
        var pct = Math.min(100, ((Date.now() - started) / TOTAL) * 100);
        progressEl.style.width = pct + '%';
      }, 250);

      endTimer = setTimeout(function () {
        phaseEl.textContent = 'Thank you.';
        clearInterval(phaseTimer); clearInterval(tickTimer);
        setTimeout(stop, 2600);
      }, TOTAL);
    }

    startBtn.addEventListener('click', start);
    stopBtn.addEventListener('click', stop);
  })();

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
      stuck: {
        text: "Feeling stuck rarely means you aren't trying. More often it means the thing " +
              "holding you sits underneath the part you can see.",
        cta: 'See how Ajita works', href: '#programs'
      },
      home: {
        text: "The people closest to us are where the oldest patterns show up first. That " +
              "doesn't mean something is wrong with you.",
        cta: 'See how Ajita works', href: '#programs'
      },
      work: {
        text: "Being overlooked while doing everything right wears down something deeper " +
              "than confidence. It's worth understanding why it keeps happening.",
        cta: 'See how Ajita works', href: '#programs'
      },
      money: {
        text: "Money worry rarely stays in one place — it reaches into sleep, health, and " +
              "the people around you. You're not being dramatic.",
        cta: 'See how Ajita works', href: '#programs'
      },
      giving: {
        text: "Giving everything and still feeling it isn't enough is exhausting in a way " +
              "few people see. That pattern started somewhere.",
        cta: 'See how Ajita works', href: '#programs'
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

  /* ══════════ SCORECARD ══════════
     Ajita's six categories, one question each. No numeric score is ever
     shown — a distressed visitor should not be graded. We name the areas
     they said "no" to and reflect them back. Nothing leaves the browser.
  ══════════════════════════════════ */
  (function scorecard() {
    var root = document.getElementById('scorecard');
    if (!root) return;

    var AREAS = [
      { key: 'money',    label: 'Money',           dot: '--ch-root',
        q: 'Are you satisfied with your financial situation right now?' },
      { key: 'career',   label: 'Career',          dot: '--ch-solar',
        q: 'Are you satisfied with your job or the path your career is on?' },
      { key: 'body',     label: 'Physical health', dot: '--ch-sacral',
        q: 'Are you satisfied with your physical health and energy?' },
      { key: 'people',   label: 'Relationships',   dot: '--ch-heart',
        q: 'Are you satisfied with the closeness of your relationships?' },
      { key: 'mind',     label: 'Inner life',      dot: '--ch-third-eye',
        q: 'Do you feel you are managing your emotions and inner wellbeing?' },
      { key: 'spirit',   label: 'Purpose',         dot: '--ch-crown',
        q: 'Do you feel connected to a sense of purpose in your life?' }
    ];

    // Resolve the chakra vars to literal colours once. Assigning a var()
    // reference to a transitioned property leaves `color` stuck at its old
    // value, since unregistered custom properties don't interpolate.
    var rootStyle = getComputedStyle(document.documentElement);
    AREAS.forEach(function (a) {
      a.hex = rootStyle.getPropertyValue(a.dot).trim();
    });

    var steps = root.querySelectorAll('.sc-step');
    var bar = document.getElementById('scBar');
    var countEl = document.getElementById('scCount');
    var catEl = document.getElementById('scCategory');
    var qEl = document.getElementById('scQuestion');
    var idx = 0, heavy = [];

    function show(name) {
      steps.forEach(function (s) { s.classList.toggle('is-active', s.dataset.sc === name); });
      var active = root.querySelector('.sc-step.is-active');
      if (active) { active.setAttribute('tabindex', '-1'); active.focus({ preventScroll: true }); }
    }

    function render() {
      var a = AREAS[idx];
      bar.style.width = ((idx) / AREAS.length * 100) + '%';
      countEl.textContent = (idx + 1) + ' of ' + AREAS.length;
      catEl.textContent = a.label;
      catEl.style.color = a.hex;
      qEl.textContent = a.q;
    }

    function finish() {
      bar.style.width = '100%';
      var head = document.getElementById('scResultHead');
      var list = document.getElementById('scAreas');
      var note = document.getElementById('scResultNote');
      var actions = document.getElementById('scActions');

      if (!heavy.length) {
        head.innerHTML = 'You answered yes to all six. That is <em>genuinely rare.</em>';
        list.innerHTML = '';
        note.textContent = 'If you came here anyway, something still brought you. That’s ' +
          'worth paying attention to — and you’re welcome to just sit in the circle and listen.';
      } else {
        head.innerHTML = heavy.length === 1
          ? 'One area is asking for <em>attention.</em>'
          : 'These areas are carrying <em>the weight.</em>';
        list.innerHTML = heavy.map(function (a) {
          return '<li style="--dot: ' + a.hex + '">' + a.label + '</li>';
        }).join('');
        note.textContent = heavy.length >= 4
          ? 'When this much feels heavy at once, it usually isn’t several separate problems. ' +
            'It’s more often one pattern showing up in several places — which is the work Ajita does.'
          : 'Ajita’s work starts by looking underneath what you named, rather than at the ' +
            'surface of it. There is no rush, and no wrong place to begin.';
      }

      actions.innerHTML =
        '<a href="#programs" class="btn-gold" data-hover>See how Ajita works</a>' +
        '<a href="#begin" class="btn-ghost" data-hover>Ask about working together</a>';
      actions.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var t = document.querySelector(a.getAttribute('href'));
          if (!t) return;
          e.preventDefault();
          if (lenis) lenis.scrollTo(t, { offset: 0, duration: 1.6 });
          else t.scrollIntoView({ behavior: 'smooth' });
        });
      });
      show('result');
    }

    document.getElementById('scStart').addEventListener('click', function () {
      idx = 0; heavy = [];
      render(); show('q');
    });

    root.querySelectorAll('[data-sc-answer]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.dataset.scAnswer === 'no') heavy.push(AREAS[idx]);
        idx++;
        if (idx >= AREAS.length) finish();
        else render();
      });
    });

    document.getElementById('scQuit').addEventListener('click', function () { show('intro'); });
    document.getElementById('scRestart').addEventListener('click', function () { show('intro'); });
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
