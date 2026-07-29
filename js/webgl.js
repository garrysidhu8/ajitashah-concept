/* ═══════════════════════════════════════════════
   AJITA SHAH — WebGL layer
   1. Hero: golden particle nebula
   2. Healer: portrait assembled from ~30k particles
   3. Begin: rising ember field
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 1.75);

  if (REDUCED || !window.THREE) {
    document.documentElement.classList.add('reduced');
    // Static fallback for the portrait
    var pc = document.getElementById('portraitCanvas');
    if (pc && pc.parentNode) {
      var img = new Image();
      img.src = 'assets/portrait-135mm.webp';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:6px;filter:sepia(.35) contrast(.95)';
      pc.parentNode.replaceChild(img, pc);
    }
    return;
  }

  var GOLD = new THREE.Color(0xc9a227);
  var CHAMPAGNE = new THREE.Color(0xe8d9b0);
  var AMBER = new THREE.Color(0x8a5a18);

  function makeRenderer(canvas) {
    var r = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
    r.setPixelRatio(DPR);
    return r;
  }

  function visibilityLoop(el, tick) {
    var running = false, rafId = null;
    var clock = new THREE.Clock();
    function frame() {
      rafId = requestAnimationFrame(frame);
      tick(clock.getElapsedTime());
    }
    var io = new IntersectionObserver(function (entries) {
      var vis = entries[0].isIntersecting;
      if (vis && !running) { running = true; frame(); }
      if (!vis && running) { running = false; cancelAnimationFrame(rafId); }
    }, { rootMargin: '80px' });
    io.observe(el);
  }

  /* ══════════ 1. HERO NEBULA ══════════ */
  (function heroNebula() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    var renderer = makeRenderer(canvas);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
    camera.position.z = 34;

    var COUNT = 6500;
    var pos = new Float32Array(COUNT * 3);
    var col = new Float32Array(COUNT * 3);
    var siz = new Float32Array(COUNT);
    var pha = new Float32Array(COUNT);

    var c = new THREE.Color();
    for (var i = 0; i < COUNT; i++) {
      // Distribution: flattened galaxy disc + outer halo
      var isHalo = Math.random() < 0.35;
      var radius, theta, y;
      if (isHalo) {
        radius = 18 + Math.pow(Math.random(), 1.6) * 42;
        theta = Math.random() * Math.PI * 2;
        y = (Math.random() - 0.5) * 34;
      } else {
        radius = 4 + Math.pow(Math.random(), 2.2) * 26;
        theta = Math.random() * Math.PI * 2;
        y = (Math.random() - 0.5) * (radius * 0.28);
      }
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * radius - 6;

      var t = Math.random();
      c.copy(t < 0.55 ? GOLD : (t < 0.85 ? CHAMPAGNE : AMBER));
      c.multiplyScalar(0.55 + Math.random() * 0.7);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;

      siz[i] = 0.6 + Math.pow(Math.random(), 2.8) * 3.4;
      pha[i] = Math.random() * Math.PI * 2;
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(siz, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(pha, 1));

    var mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: DPR }
      },
      vertexShader: [
        'attribute vec3 aColor;',
        'attribute float aSize;',
        'attribute float aPhase;',
        'uniform float uTime;',
        'uniform float uPixelRatio;',
        'varying vec3 vColor;',
        'varying float vTwinkle;',
        'void main() {',
        '  vec3 p = position;',
        '  float drift = sin(uTime * 0.35 + aPhase) * 0.9;',
        '  p.y += drift;',
        '  p.x += cos(uTime * 0.22 + aPhase * 1.7) * 0.7;',
        '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
        '  gl_Position = projectionMatrix * mv;',
        '  float tw = 0.62 + 0.38 * sin(uTime * 1.4 + aPhase * 3.0);',
        '  vTwinkle = tw;',
        '  vColor = aColor;',
        '  gl_PointSize = aSize * uPixelRatio * (52.0 / -mv.z) * (0.75 + 0.25 * tw);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vColor;',
        'varying float vTwinkle;',
        'void main() {',
        '  float d = length(gl_PointCoord - 0.5);',
        '  if (d > 0.5) discard;',
        '  float a = smoothstep(0.5, 0.0, d);',
        '  a *= a;',
        '  gl_FragColor = vec4(vColor, a * vTwinkle);',
        '}'
      ].join('\n')
    });

    var points = new THREE.Points(geo, mat);
    scene.add(points);

    // Soft central glow
    var glowTex = (function () {
      var cv = document.createElement('canvas');
      cv.width = cv.height = 256;
      var ctx = cv.getContext('2d');
      var g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, 'rgba(201,162,39,0.55)');
      g.addColorStop(0.35, 'rgba(138,90,24,0.22)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(cv);
    })();
    var glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, opacity: 0.8
    }));
    glow.scale.set(46, 30, 1);
    glow.position.set(0, -1, -10);
    scene.add(glow);

    var mouse = { x: 0, y: 0 }, sm = { x: 0, y: 0 };
    window.addEventListener('pointermove', function (e) {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    visibilityLoop(canvas, function (t) {
      mat.uniforms.uTime.value = t;
      points.rotation.y = t * 0.02;
      sm.x += (mouse.x - sm.x) * 0.04;
      sm.y += (mouse.y - sm.y) * 0.04;
      camera.position.x = sm.x * 3.2;
      camera.position.y = -sm.y * 2.2;
      camera.lookAt(0, 0, -6);
      renderer.render(scene, camera);
    });
  })();

  /* ══════════ 2. PARTICLE PORTRAIT ══════════ */
  (function portrait() {
    var canvas = document.getElementById('portraitCanvas');
    if (!canvas) return;

    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = build;
    img.onerror = function () { console.warn('Portrait image failed to load'); };
    img.src = 'assets/portrait-135mm.webp';

    function build() {
      var GRID_W = 240;
      var GRID_H = Math.round(GRID_W * (img.naturalHeight / img.naturalWidth));
      var cv = document.createElement('canvas');
      cv.width = GRID_W; cv.height = GRID_H;
      var ctx = cv.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, GRID_W, GRID_H);
      var data = ctx.getImageData(0, 0, GRID_W, GRID_H).data;

      var targets = [], tones = [];
      var cx = GRID_W / 2, cy = GRID_H / 2;
      var maxR = Math.sqrt(cx * cx + cy * cy);
      for (var y = 0; y < GRID_H; y++) {
        for (var x = 0; x < GRID_W; x++) {
          var idx = (y * GRID_W + x) * 4;
          var r = data[idx] / 255, g = data[idx + 1] / 255, b = data[idx + 2] / 255;
          var lum = r * 0.299 + g * 0.587 + b * 0.114;
          // Subject mask: her skin/hair are warm (r >> b), the studio bg is neutral gray.
          // Darkness catches deep features (eyes, hair shadow) that read neutral.
          var warm = Math.max(0, r - b);
          var ink = Math.min(1, Math.pow(1 - lum, 1.2) * 0.9 + warm * 3.0);
          // Edge falloff so any residual background shading melts away
          var dx = (x - cx) / cx, dy = (y - cy) / cy;
          var edge = 1 - Math.min(1, Math.pow(dx * dx * 1.15 + dy * dy * 0.9, 2.2));
          var w = ink * edge;
          if (w < 0.14) continue;
          // Inside the subject, tone follows the photo directly: lit skin glows,
          // eyes/brows/hair shadows stay dark — reads like a golden duotone print.
          var tone = Math.min(1, Math.pow(lum, 1.1) * 1.4);
          targets.push(x - cx, cy - y, (tone - 0.4) * 9);
          tones.push(tone);
        }
      }

      var COUNT = tones.length;
      var tArr = new Float32Array(targets);
      var scatter = new Float32Array(COUNT * 3);
      var tone = new Float32Array(tones);
      var seed = new Float32Array(COUNT);
      for (var i = 0; i < COUNT; i++) {
        var r = 130 + Math.random() * 180;
        var th = Math.random() * Math.PI * 2;
        var ph = Math.acos(2 * Math.random() - 1);
        scatter[i * 3] = r * Math.sin(ph) * Math.cos(th);
        scatter[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
        scatter[i * 3 + 2] = r * Math.cos(ph) - 60;
        seed[i] = Math.random();
      }

      var renderer = makeRenderer(canvas);
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 900);
      var FIT = GRID_H * 1.15;
      camera.position.z = FIT;

      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(tArr, 3));
      geo.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3));
      geo.setAttribute('aTone', new THREE.BufferAttribute(tone, 1));
      geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

      var mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uMouse: { value: new THREE.Vector2(9999, 9999) },
          uPixelRatio: { value: DPR }
        },
        vertexShader: [
          'attribute vec3 aScatter;',
          'attribute float aTone;',
          'attribute float aSeed;',
          'uniform float uTime;',
          'uniform float uProgress;',
          'uniform vec2 uMouse;',
          'uniform float uPixelRatio;',
          'varying float vTone;',
          'varying float vFade;',
          'void main() {',
          '  float stag = clamp(uProgress * 1.6 - aSeed * 0.6, 0.0, 1.0);',
          '  float e = 1.0 - pow(1.0 - stag, 3.0);',
          '  vec3 p = mix(aScatter, position, e);',
          // idle breathing
          '  p.x += sin(uTime * 0.8 + aSeed * 40.0) * 0.7;',
          '  p.y += cos(uTime * 0.6 + aSeed * 55.0) * 0.7;',
          // mouse repulsion (world-space, xy plane)
          '  vec2 toM = p.xy - uMouse;',
          '  float md = length(toM);',
          '  float force = smoothstep(34.0, 0.0, md);',
          '  p.xy += normalize(toM + 0.0001) * force * 16.0;',
          '  p.z += force * 12.0;',
          '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
          '  gl_Position = projectionMatrix * mv;',
          '  vTone = aTone;',
          '  vFade = e;',
          '  float sz = (0.55 + aTone * 1.75) * uPixelRatio * (240.0 / -mv.z);',
          '  gl_PointSize = sz * (0.35 + 0.65 * e);',
          '}'
        ].join('\n'),
        fragmentShader: [
          'varying float vTone;',
          'varying float vFade;',
          'void main() {',
          '  float d = length(gl_PointCoord - 0.5);',
          '  if (d > 0.5) discard;',
          '  float a = smoothstep(0.5, 0.05, d);',
          '  vec3 deep = vec3(0.54, 0.35, 0.09);',
          '  vec3 bright = vec3(0.95, 0.86, 0.62);',
          '  vec3 col = mix(deep, bright, vTone);',
          '  gl_FragColor = vec4(col, a * (0.25 + 0.75 * vTone) * vFade);',
          '}'
        ].join('\n')
      });

      var points = new THREE.Points(geo, mat);
      scene.add(points);

      // Mouse → world coords on the portrait plane
      var rect = null;
      canvas.addEventListener('pointermove', function (e) {
        rect = canvas.getBoundingClientRect();
        var nx = (e.clientX - rect.left) / rect.width * 2 - 1;
        var ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        var halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
        var halfW = halfH * camera.aspect;
        mat.uniforms.uMouse.value.set(nx * halfW, ny * halfH);
      }, { passive: true });
      canvas.addEventListener('pointerleave', function () {
        mat.uniforms.uMouse.value.set(9999, 9999);
      });

      function resize() {
        var w = canvas.clientWidth, h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      window.addEventListener('resize', resize);
      resize();

      var sway = { x: 0, y: 0 };
      window.addEventListener('pointermove', function (e) {
        sway.x = (e.clientX / window.innerWidth - 0.5);
        sway.y = (e.clientY / window.innerHeight - 0.5);
      }, { passive: true });

      visibilityLoop(canvas, function (t) {
        mat.uniforms.uTime.value = t;
        points.rotation.y += ((sway.x * 0.22) - points.rotation.y) * 0.05;
        points.rotation.x += ((-sway.y * 0.12) - points.rotation.x) * 0.05;
        renderer.render(scene, camera);
      });

      // Assembly on scroll
      if (window.gsap && window.ScrollTrigger) {
        gsap.to(mat.uniforms.uProgress, {
          value: 1,
          ease: 'power2.inOut',
          duration: 2.6,
          scrollTrigger: {
            trigger: canvas,
            start: 'top 78%',
            once: true
          }
        });
      } else {
        mat.uniforms.uProgress.value = 1;
      }
    }
  })();

  /* ══════════ 3. BEGIN · EMBERS ══════════ */
  (function embers() {
    var canvas = document.getElementById('beginCanvas');
    if (!canvas) return;

    var renderer = makeRenderer(canvas);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 30;

    var COUNT = 900;
    var pos = new Float32Array(COUNT * 3);
    var spd = new Float32Array(COUNT);
    var pha = new Float32Array(COUNT);
    var siz = new Float32Array(COUNT);
    for (var i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 90;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      spd[i] = 0.4 + Math.random() * 1.4;
      pha[i] = Math.random() * Math.PI * 2;
      siz[i] = 0.5 + Math.pow(Math.random(), 2.5) * 2.2;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(spd, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(pha, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(siz, 1));

    var mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: DPR } },
      vertexShader: [
        'attribute float aSpeed;',
        'attribute float aPhase;',
        'attribute float aSize;',
        'uniform float uTime;',
        'uniform float uPixelRatio;',
        'varying float vA;',
        'void main() {',
        '  vec3 p = position;',
        '  p.y = mod(p.y + uTime * aSpeed * 2.0 + 20.0, 40.0) - 20.0;',
        '  p.x += sin(uTime * 0.5 + aPhase) * 2.0;',
        '  vA = smoothstep(20.0, 12.0, abs(p.y)) * (0.35 + 0.65 * sin(uTime * 2.0 + aPhase));',
        '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
        '  gl_Position = projectionMatrix * mv;',
        '  gl_PointSize = aSize * uPixelRatio * (40.0 / -mv.z);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying float vA;',
        'void main() {',
        '  float d = length(gl_PointCoord - 0.5);',
        '  if (d > 0.5) discard;',
        '  float a = smoothstep(0.5, 0.0, d) * max(vA, 0.0);',
        '  gl_FragColor = vec4(0.79, 0.64, 0.24, a * 0.8);',
        '}'
      ].join('\n')
    });
    scene.add(new THREE.Points(geo, mat));

    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    visibilityLoop(canvas, function (t) {
      mat.uniforms.uTime.value = t;
      renderer.render(scene, camera);
    });
  })();

})();
