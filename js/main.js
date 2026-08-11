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

    /* A three-turn conversation per doorway, not a single reflection:
       acknowledge → how long → what's underneath → a woven reply that uses
       both answers, ending at Ajita. Every turn is skippable, everything is
       client-side, and the words stay in her clients' own register. */
    var DUR = {
      q: 'How long has it been like this?',
      chips: [
        { k: 'months', label: 'A few months' },
        { k: 'year', label: 'A year or two' },
        { k: 'years', label: 'Many years' },
        { k: 'always', label: 'As long as I can remember' },
        { k: 'unsure', label: "I'm not sure", quiet: true }
      ],
      ack: {
        months: 'A few months is recent enough that it still surprises you. That matters — patterns are easiest to shift before they harden.',
        year: "A year or two is long enough to be tired of it — and not so long that it's who you are.",
        years: "Carrying something for years changes how you stand. You've been strong longer than anyone realises.",
        always: 'When something has been there as long as memory, it stops looking like a problem and starts looking like "just how I am." It isn\'t.',
        unsure: "Time blurs around the things we carry. That's normal."
      },
      phrase: {
        months: 'these last months', year: 'this past year or two',
        years: 'so many years', always: 'a whole lifetime', unsure: 'all this time'
      }
    };

    var CONVO = {
      stuck: {
        ack: "Feeling stuck rarely means you aren't trying. More often it means the thing holding you sits underneath the part you can see.",
        q2: 'When you imagine it changing, what gets in the way first?',
        chips: [
          { k: 'start', label: "I don't know where to start" },
          { k: 'fear', label: 'Fear of choosing wrong' },
          { k: 'people', label: 'The people around me' },
          { k: 'tired', label: "I'm just so tired" }
        ],
        base: "Stuck isn't a lack of effort — after {dur}, it's usually one pattern underneath, making every road feel closed. {c} That underneath part is exactly where Ajita works.",
        c: {
          start: 'Not knowing where to start is itself the pattern talking.',
          fear: 'The fear of choosing wrong usually guards an older wound than the choice itself.',
          people: 'When the people around you hold the door shut, the work is finding your own footing first.',
          tired: "And the tiredness is real — it's what carrying this costs."
        }
      },
      home: {
        ack: "The people closest to us are where the oldest patterns show up first. That doesn't mean something is wrong with you.",
        q2: "At home, what's the hardest part right now?",
        chips: [
          { k: 'unheard', label: 'Feeling unheard' },
          { k: 'tension', label: 'The constant tension' },
          { k: 'alone', label: 'Feeling alone in it' },
          { k: 'unreturned', label: "I give, and it isn't returned" }
        ],
        base: "Home is where the oldest patterns surface first — and after {dur}, what's happening there is rarely only about now. {c} This is exactly the kind of knot Ajita works with.",
        c: {
          unheard: 'Feeling unheard by the people closest to you is one of the loneliest things there is.',
          tension: "Constant tension keeps your whole body braced — and that's exhausting in a way sleep doesn't fix.",
          alone: 'Feeling alone inside a full house is its own kind of pain.',
          unreturned: 'Giving without return usually began long before this relationship.'
        }
      },
      work: {
        ack: "Being overlooked while doing everything right wears down something deeper than confidence. It's worth understanding why it keeps happening.",
        q2: 'At work, what wears on you most?',
        chips: [
          { k: 'overlooked', label: 'Being passed over' },
          { k: 'pressure', label: 'The pressure never stops' },
          { k: 'people', label: 'The people' },
          { k: 'pointless', label: 'It feels pointless' }
        ],
        base: "After {dur} of that, it stops being about the job. {c} Understanding why it keeps happening is where Ajita begins.",
        c: {
          overlooked: 'Being passed over while doing everything right asks a very old question — "am I seen?"',
          pressure: 'Pressure that never lets up teaches your body to never let down.',
          people: "Difficult people find the seams we haven't yet learned to protect.",
          pointless: 'When it feels pointless, something deeper than the job is asking for meaning.'
        }
      },
      money: {
        ack: "Money worry rarely stays in one place — it reaches into sleep, health, and the people around you. You're not being dramatic.",
        q2: 'What does the money worry touch most?',
        chips: [
          { k: 'body', label: 'My sleep and my health' },
          { k: 'people', label: 'My relationships' },
          { k: 'self', label: 'How I feel about myself' },
          { k: 'all', label: 'Everything at once' }
        ],
        base: "Money worry after {dur} isn't arithmetic anymore — it becomes the lens everything is seen through. {c} That lens is what Ajita helps take off.",
        c: {
          body: 'When it reaches sleep and health, your body is carrying the ledger.',
          people: "When it reaches your relationships, it's costing more than money.",
          self: 'When it decides how you feel about yourself, it has taken more than it should.',
          all: "When it's everything at once, that's one pattern wearing four masks."
        }
      },
      giving: {
        ack: "Giving everything and still feeling it isn't enough is exhausting in a way few people see. That pattern started somewhere.",
        q2: 'And when you give all of that — what comes back?',
        chips: [
          { k: 'notmuch', label: 'Not much' },
          { k: 'criticism', label: 'Criticism' },
          { k: 'moreasks', label: 'Only more asking' },
          { k: 'stopped', label: "I've stopped noticing" }
        ],
        base: "After {dur} of giving more than comes back, the question isn't whether you're enough — you always were. {c} Ajita helps find where that bargain was first made.",
        c: {
          notmuch: "Emptiness where thanks should be teaches you to need less. That isn't peace — that's shrinking.",
          criticism: 'Criticism in return for care cuts twice.',
          moreasks: 'When giving only earns more asking, the well never refills.',
          stopped: 'Not noticing anymore is what a heart does to stop hurting.'
        }
      }
    };
    var LOOKING = {
      text: 'That\'s completely fine. Nothing here needs anything from you — stay as long as you like, and leave whenever you want.',
      cta: 'Keep reading', href: '#journey'
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

    var followEl = document.getElementById('ciFollow');

    // Reveal a line a beat late, word by word — an instant answer reads
    // as a machine; a pause reads as someone thinking.
    function say(text, followText) {
      reflectionEl.classList.remove('is-shown');
      reflectionEl.innerHTML = text.split(/\s+/).map(function (w) {
        return '<span class="word">' + w + '</span>';
      }).join(' ');
      followEl.hidden = !followText;
      followEl.textContent = followText || '';
      if (window.gsap && !REDUCED) {
        gsap.to('#ciReflection .word', {
          opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.6, ease: 'none'
        });
        if (followText) {
          gsap.fromTo(followEl, { opacity: 0 },
            { opacity: 1, duration: 0.8, delay: 0.6 + text.split(/\s+/).length * 0.05 + 0.3 });
        }
      } else {
        reflectionEl.classList.add('is-shown');
      }
    }

    function chips(list) {
      routeEl.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.className = 'ci-chips';
      list.forEach(function (c) {
        var b = document.createElement('button');
        b.className = 'ci-chip' + (c.quiet ? ' is-quiet' : '');
        b.textContent = c.label;
        b.addEventListener('click', c.fn);
        wrap.appendChild(b);
      });
      routeEl.appendChild(wrap);
    }

    // Turn 3: weave both answers into one reply, then the way to Ajita.
    function weave(door, durKey, cKey) {
      var d = CONVO[door];
      var line = d.base
        .replace('{dur}', DUR.phrase[durKey] || DUR.phrase.unsure)
        .replace('{c}', cKey ? d.c[cKey] : '');
      say(line.replace(/\s+/g, ' ').trim());
      var html =
        '<button class="btn-gold" id="ciTalk" data-hover>Talk with Ajita about this</button>' +
        '<a href="#programs" class="btn-ghost" data-hover>See how she works</a>' +
        '<a href="#healer" class="ci-skip" data-hover>Or just keep reading</a>';
      routeEl.innerHTML = html;
      bindSmooth(routeEl);
      var talk = document.getElementById('ciTalk');
      talk.addEventListener('click', function () {
        // Hand off into the guide's intake flow — same door the site's
        // booking CTA uses. Falls back to the contact section.
        var book = document.getElementById('beginBook');
        if (book) { book.click(); return; }
        var t = document.querySelector('#begin');
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Turn 2: how long → acknowledge it, then ask what's underneath.
    function askUnderneath(door, durKey) {
      var d = CONVO[door];
      say(DUR.ack[durKey], d.q2);
      chips(d.chips.map(function (c) {
        return { label: c.label, fn: function () { weave(door, durKey, c.k); } };
      }).concat([{ label: "I'd rather not say", quiet: true,
        fn: function () { weave(door, durKey, null); } }]));
    }

    // Turn 1: acknowledge the door they chose, then ask how long.
    function startConvo(door) {
      if (door === 'looking') {
        say(LOOKING.text);
        routeEl.innerHTML = '<a href="' + LOOKING.href + '" class="btn-ghost" data-hover>' +
          LOOKING.cta + '</a>';
        bindSmooth(routeEl);
        show(3);
        return;
      }
      var d = CONVO[door];
      say(d.ack, DUR.q);
      chips(DUR.chips.map(function (c) {
        return { label: c.label, quiet: c.quiet,
          fn: function () { askUnderneath(door, c.k); } };
      }));
      show(3);
    }

    root.querySelectorAll('.ci-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        chosen = btn.dataset.key;
        try { localStorage.setItem(STORE, '1'); } catch (e) {}

        // Someone who says they're only browsing is not asked to open up.
        if (chosen === 'looking') { startConvo(chosen); return; }

        echo.textContent = btn.textContent.trim();
        show(2);
      });
    });

    root.querySelectorAll('[data-ci-next]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        // If the free text discloses crisis, stop the funnel: no reflection,
        // no routing — only the crisis message. CRISIS_RE/CRISIS_MSG are
        // shared with the chat guide below.
        if (textEl && CRISIS_RE.test(textEl.value)) {
          reflectionEl.innerHTML = CRISIS_MSG;
          reflectionEl.classList.add('is-shown');
          routeEl.innerHTML = '';
          show(3);
          return;
        }
        startConvo(chosen);
      });
    });

    document.getElementById('ciRestart').addEventListener('click', function () {
      chosen = null;
      if (textEl) textEl.value = '';
      show(1);
    });
  })();

  /* ══════════ YOUTUBE FACADES ══════════
     Program pages embed her videos as click-to-load thumbnails: no YouTube
     JS, no cookies, no tracking until the visitor chooses to play.
  ══════════════════════════════════════ */
  document.querySelectorAll('.yt-facade').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.dataset.yt;
      if (!id) return;
      var frame = document.createElement('iframe');
      frame.className = 'yt-frame';
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      frame.allow = 'autoplay; encrypted-media; picture-in-picture';
      frame.allowFullscreen = true;
      frame.title = btn.getAttribute('aria-label') || 'Video';
      btn.replaceWith(frame);
    });
  });

  /* ══════════ CRISIS DETECTION ══════════
     Shared by every free-text input on the site. If someone discloses
     crisis, the funnel stops — no recommendation, no booking push.
  ══════════════════════════════════════ */
  var CRISIS_RE = /suicid|kill(ing)? myself|end(ing)? (my|it|this) (life|all)|take (my|his|her|their) (own )?life|self.?harm|harm(ing)? myself|hurt(ing)? myself|cut(ting)? myself|want(ed)? to die|wish i (was|were) dead|better off (dead|without me)|don'?t want to (live|be here|exist|wake up)|no reason to (live|go on)|overdose|end it all/i;
  var CRISIS_MSG =
    "I'm really glad you told me, and I want you to have real human support right now — " +
    "I'm only a website guide and this needs more than I can give. In Canada you can call " +
    "or text <strong>9-8-8</strong>, the Suicide Crisis Helpline, any hour of the day. " +
    "If you're in immediate danger, please call <strong>911</strong>. " +
    "You deserve support from a real person.";

  /* ══════════ GUIDE · CHAT ══════════
     Scripted concierge. The flow: greet → pick what feels heaviest →
     three yes/no questions from Ajita's own questionnaire → a warm
     reflection → an honest recommendation → the three appointment
     questions → a summary and her phone number. Client-side only;
     nothing is transmitted. The scripted brain is deliberately shaped
     like a request/response loop so a Claude serverless function can
     replace it at deploy time without touching the UI.
  ══════════════════════════════════════ */
  (function guide() {
    var launcher = document.getElementById('chatLauncher');
    var panel = document.getElementById('chatPanel');
    var log = document.getElementById('chatLog');
    var io = document.getElementById('chatIo');
    if (!launcher || !panel) return;

    // Three questions per area, drawn from Ajita's questionnaire.
    // Clinical items (illness, family history, panic, insomnia) are
    // deliberately excluded. heavyIfYes flags reverse-worded items.
    var AREAS = {
      money: { label: 'Money', qs: [
        { q: 'Do you feel money is hard to come by, no matter what you do?', heavyIfYes: true },
        { q: 'Are you actively working towards your financial goals?', heavyIfYes: false },
        { q: 'Do you feel the money due to you is held back by your circumstances?', heavyIfYes: true }
      ]},
      career: { label: 'Work & career', qs: [
        { q: 'Are you working in the career of your choice?', heavyIfYes: false },
        { q: 'Do you feel valued and appreciated in the work you do?', heavyIfYes: false },
        { q: 'Are you satisfied with the direction your career is heading?', heavyIfYes: false }
      ]},
      health: { label: 'Health & energy', qs: [
        { q: 'Do you make time for yourself every day to relax and recharge?', heavyIfYes: false },
        { q: 'Do you get enough rest most nights?', heavyIfYes: false },
        { q: 'Are you satisfied with your energy through the day?', heavyIfYes: false }
      ]},
      relationships: { label: 'Relationships', qs: [
        { q: 'Do you feel supported and understood by the people close to you?', heavyIfYes: false },
        { q: 'Do you have healthy boundaries in your relationships?', heavyIfYes: false },
        { q: 'Are you able to resolve conflict with the people you love?', heavyIfYes: false }
      ]},
      peace: { label: 'Peace of mind', qs: [
        { q: 'Do you feel generally content and at peace with yourself?', heavyIfYes: false },
        { q: 'Do you get triggered or angry more easily than you would like?', heavyIfYes: true },
        { q: 'Do you tend to keep your feelings to yourself until they overflow?', heavyIfYes: true }
      ]},
      purpose: { label: 'Purpose', qs: [
        { q: 'Do you feel connected to a sense of purpose?', heavyIfYes: false },
        { q: 'Have you made peace with your past?', heavyIfYes: false },
        { q: 'Are you able to forgive the people who have wronged you?', heavyIfYes: false }
      ]}
    };

    var state = { area: null, heavy: 0, qi: 0, book: {} };
    var open = false, greeted = false;

    // One place to turn booking on: <body data-booking-url="…">.
    // Empty string = phone fallback until the scheduler account exists.
    var BOOKING_URL = (document.body.getAttribute('data-booking-url') || '').trim();

    /* — rendering — */
    function addMsg(cls, html) {
      var d = document.createElement('div');
      d.className = 'chat-msg ' + cls;
      d.innerHTML = html;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
      return d;
    }
    function bot(html) { return addMsg('bot', html); }
    function user(text) {
      var d = document.createElement('div');
      d.className = 'chat-msg user';
      d.textContent = text;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
    }
    function chips(list) {
      io.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.className = 'chat-chips';
      list.forEach(function (c) {
        var b = document.createElement('button');
        b.className = 'chat-chip' + (c.quiet ? ' quiet' : '');
        b.textContent = c.label;
        b.addEventListener('click', function () { user(c.label); c.fn(); });
        wrap.appendChild(b);
      });
      io.appendChild(wrap);
      var first = wrap.querySelector('button');
      if (first) first.focus({ preventScroll: true });
    }
    function freeText(placeholder, onSubmit, skipLabel, onSkip) {
      io.innerHTML = '';
      var row = document.createElement('div');
      row.className = 'chat-text-row';
      var ta = document.createElement('textarea');
      ta.className = 'chat-textarea';
      ta.rows = 2;
      ta.placeholder = placeholder;
      ta.setAttribute('aria-label', placeholder);
      var send = document.createElement('button');
      send.className = 'chat-send';
      send.textContent = 'Send';
      function submit() {
        var v = ta.value.trim();
        if (!v) return;
        user(v);
        if (CRISIS_RE.test(v)) { crisisStop(); return; }
        onSubmit(v);
      }
      send.addEventListener('click', submit);
      ta.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
      });
      row.appendChild(ta); row.appendChild(send);
      io.appendChild(row);
      if (skipLabel) {
        var sk = document.createElement('button');
        sk.className = 'chat-skip';
        sk.textContent = skipLabel;
        sk.addEventListener('click', function () { user(skipLabel); onSkip(); });
        io.appendChild(sk);
      }
      ta.focus({ preventScroll: true });
    }
    function goTo(sel) {
      var t = document.querySelector(sel);
      close();
      if (!t) return;
      if (lenis) lenis.scrollTo(t, { offset: 0, duration: 1.6 });
      else t.scrollIntoView({ behavior: 'smooth' });
    }

    /* — crisis — */
    function crisisStop() {
      addMsg('bot crisis', CRISIS_MSG);
      chips([
        { label: 'Close this chat', fn: close, quiet: true }
      ]);
    }

    /* — flow — */
    function greet() {
      bot("Hi — I'm Ajita's website guide. I'm not Ajita, and I'm not a therapist, " +
          "but I can help you find a gentle place to start, or set up time with her. " +
          "How are you doing today?");
      chips([
        { label: 'Help me figure out where to start', fn: pickArea },
        { label: "I'd like to book time with Ajita", fn: bookStart },
        { label: "I'm just looking around", fn: justLooking, quiet: true }
      ]);
    }
    function justLooking() {
      bot("That's completely fine — everything here is yours to explore, and nothing " +
          "needs anything from you. I'll be right here if you want me.");
      chips([
        { label: 'Actually, help me find a starting point', fn: pickArea, quiet: true },
        { label: 'Close', fn: close, quiet: true }
      ]);
    }
    function pickArea() {
      bot('Which part of life feels heaviest right now?');
      var list = Object.keys(AREAS).map(function (k) {
        return { label: AREAS[k].label, fn: function () { startArea(k); } };
      });
      list.push({ label: 'Something else', fn: somethingElse, quiet: true });
      chips(list);
    }
    function somethingElse() {
      bot("Tell me in your own words, if you'd like. There's no wrong way to put it.");
      freeText('Whatever comes out first is fine.', function () {
        bot("Thank you for trusting me with that. What you're describing deserves a " +
            "real conversation rather than a script — and that's exactly what Ajita is for.");
        offerBooking();
      }, "I'd rather not write it", function () {
        bot("Completely fine. You can start with the free circle and just listen — " +
            "no camera, no speaking needed.");
        offerBooking();
      });
    }
    function startArea(key) {
      state.area = key; state.heavy = 0; state.qi = 0;
      bot('Three quick questions — yes or no, and honest is better than impressive.');
      askQ();
    }
    function askQ() {
      var a = AREAS[state.area];
      if (state.qi >= a.qs.length) { areaReflect(); return; }
      var item = a.qs[state.qi];
      bot(item.q);
      chips([
        { label: 'Yes', fn: function () { answer(item, true); } },
        { label: 'No', fn: function () { answer(item, false); } },
        { label: 'Prefer not to answer', fn: function () { state.qi++; askQ(); }, quiet: true }
      ]);
    }
    function answer(item, saidYes) {
      if (saidYes === item.heavyIfYes) state.heavy++;
      state.qi++;
      askQ();
    }
    function areaReflect() {
      var label = AREAS[state.area].label.toLowerCase();
      if (state.heavy >= 2) {
        bot('From your answers, ' + label + " is carrying real weight right now — and " +
            "you've likely been carrying it quietly for a while. That kind of pattern " +
            "rarely shifts by pushing harder. It shifts when someone helps you look " +
            "underneath it.");
        bot("Ajita's <em>Rewrite Your Destiny</em> group works on exactly this over 90 days — " +
            "and for something this persistent, a private conversation with her can " +
            "tell you more in twenty minutes than any page here.");
      } else {
        bot('From your answers, ' + label + " sounds like it's asking for attention rather " +
            "than rescue. That's a good place to be — small, steady care goes a long way " +
            "from here.");
        bot("The free <em>Becoming Unlimited</em> circle is a lovely way to begin — you can " +
            "keep your camera off and simply listen.");
      }
      offerBooking();
    }
    function offerBooking() {
      chips([
        { label: 'Book time with Ajita', fn: bookStart },
        { label: 'Show me the programs', fn: function () { goTo('#programs'); } },
        { label: "I'm done for now", fn: close, quiet: true }
      ]);
    }

    /* — booking: the three appointment questions — */
    function bookStart() {
      bot("Ajita likes to understand a little before a first conversation. " +
          "Three short questions — you can skip any of them, and nothing is sent " +
          "anywhere. This stays on your screen for you to share when you call.");
      bot('What is your most pressing issue or concern right now?');
      freeText('In your own words…', function (v) {
        state.book.issue = v; bookDuration();
      }, 'Skip this question', function () {
        state.book.issue = null; bookDuration();
      });
    }
    function bookDuration() {
      bot('How long have you been experiencing it?');
      chips([
        { label: 'Less than a year', fn: function () { state.book.duration = 'Less than a year'; bookPrior(); } },
        { label: 'One to five years', fn: function () { state.book.duration = 'One to five years'; bookPrior(); } },
        { label: 'As long as I can remember', fn: function () { state.book.duration = 'As long as I can remember'; bookPrior(); } },
        { label: 'Prefer not to say', fn: function () { state.book.duration = null; bookPrior(); }, quiet: true }
      ]);
    }
    function bookPrior() {
      bot('Have you sought help from other professionals before?');
      chips([
        { label: 'Yes', fn: function () { state.book.prior = 'Yes'; bookDone(); } },
        { label: 'No', fn: function () { state.book.prior = 'No'; bookDone(); } },
        { label: 'Prefer not to say', fn: function () { state.book.prior = null; bookDone(); }, quiet: true }
      ]);
    }
    function bookDone() {
      var b = state.book;
      var lines = [];
      if (state.area) lines.push('<strong>Area:</strong> ' + AREAS[state.area].label);
      lines.push('<strong>Concern:</strong> ' + (b.issue ? b.issue : '(skipped)'));
      lines.push('<strong>How long:</strong> ' + (b.duration || '(skipped)'));
      lines.push('<strong>Help before:</strong> ' + (b.prior || '(skipped)'));
      bot('Here is what you shared — it lives only on your screen:<br><br>' + lines.join('<br>'));
      if (BOOKING_URL) {
        bot('Whenever you\'re ready: <a href="' + BOOKING_URL + '" target="_blank" ' +
            'rel="noopener">pick a time with Ajita →</a><br><br>Bring whatever feels ' +
            'right from the above — or none of it. You can also call or text her at ' +
            '<a href="tel:+14165793700">+1 416 579 3700</a>.');
      } else {
        bot('The fastest way to reach Ajita right now is to call or text her at ' +
            '<a href="tel:+14165793700">+1 416 579 3700</a>. Mention whatever feels ' +
            'right from the above — or none of it. Online booking is on its way.');
      }
      chips([
        { label: 'Start over', fn: function () { state = { area: null, heavy: 0, qi: 0, book: {} }; pickArea(); }, quiet: true },
        { label: 'Close', fn: close, quiet: true }
      ]);
    }

    /* — open/close — */
    function openPanel() {
      panel.hidden = false;
      launcher.setAttribute('aria-expanded', 'true');
      open = true;
      if (!greeted) { greeted = true; greet(); }
      var f = io.querySelector('button, textarea');
      if (f) f.focus({ preventScroll: true });
    }
    function close() {
      panel.hidden = true;
      launcher.setAttribute('aria-expanded', 'false');
      open = false;
      launcher.focus({ preventScroll: true });
    }
    launcher.addEventListener('click', openPanel);
    document.getElementById('chatClose').addEventListener('click', close);

    // "Book a Private Session" opens the guide straight at the intake
    // questions — every booking path runs through the same gentle flow.
    var beginBook = document.getElementById('beginBook');
    if (beginBook) {
      beginBook.addEventListener('click', function () {
        panel.hidden = false;
        launcher.setAttribute('aria-expanded', 'true');
        open = true;
        greeted = true;
        user('Book a Private Session');
        bookStart();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) close();
      // basic focus containment while open
      if (e.key === 'Tab' && open) {
        var els = panel.querySelectorAll('button, textarea, a[href]');
        if (!els.length) return;
        var first = els[0], last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
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

    function reset() {
      idx = 0; heavy = [];
      var t = document.getElementById('scText');
      if (t) t.value = '';
      render();
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

    root.querySelectorAll('[data-sc-answer]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.dataset.scAnswer === 'no') heavy.push(AREAS[idx]);
        idx++;
        if (idx >= AREAS.length) finish();
        else render();
      });
    });

    document.getElementById('scQuit').addEventListener('click', function () {
      reset(); show('rest');
    });
    document.getElementById('scResume').addEventListener('click', function () {
      reset(); show('q');
    });
    document.getElementById('scRestart').addEventListener('click', function () {
      reset(); show('q');
    });

    // The open-up box on the result step. Client-side only. If the text
    // discloses crisis, the routing CTAs disappear and only 9-8-8 remains.
    var scText = document.getElementById('scText');
    if (scText) {
      scText.addEventListener('input', function () {
        var note = document.getElementById('scResultNote');
        var actions = document.getElementById('scActions');
        if (CRISIS_RE.test(scText.value)) {
          note.innerHTML = CRISIS_MSG;
          actions.innerHTML = '';
        }
      });
    }

    // No "Begin" gate: question one is live as soon as the page is.
    reset();
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
