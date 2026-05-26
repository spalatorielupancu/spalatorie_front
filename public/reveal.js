(function () {
  'use strict';

  var VERT = 'attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';

  // Wave-sweep reveal: a solid colour block with a rippling sine edge sweeps bottom → top.
  // At t=0 the entire section is covered; at t=1 it is fully revealed.
  // The wave amplitude peaks mid-animation and settles to 0 at t=1 (organic "paint" feel).
  var FRAG = [
    'precision mediump float;',
    'varying vec2 v;',
    'uniform float u_t;',    // 0 = section covered, 1 = revealed
    'uniform vec3  u_col;',
    'void main(){',
    '  float amp  = sin(u_t * 3.14159) * 0.055;',           // wave peaks mid-animation
    '  float wave = sin(v.x * 7.0 + u_t * 5.5) * amp;',    // horizontal ripple
    '  float edge = u_t + wave;',                           // front of the sweeping block
    '  float a    = 1. - smoothstep(edge-.018, edge+.018, v.y);', // above edge → transparent
    '  gl_FragColor = vec4(u_col, a);',
    '}',
  ].join('\n');

  var canvas, gl, prog, uT, uCol;
  var queue       = [];
  var raf         = null;
  var initialized = false;
  var done        = typeof WeakSet !== 'undefined' ? new WeakSet() : null;

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  function resize() {
    var dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width  = Math.round(window.innerWidth  * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
  }

  function initGL() {
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:49;';
    document.body.appendChild(canvas);
    resize();
    window.addEventListener('resize', resize, { passive: true });

    gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false })
      || canvas.getContext('experimental-webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) { canvas.remove(); return false; }

    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER,   VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    var aLoc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    uT   = gl.getUniformLocation(prog, 'u_t');
    uCol = gl.getUniformLocation(prog, 'u_col');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.SCISSOR_TEST);
    return true;
  }

  // Smooth deceleration — fast start, elegant finish, no overshoot
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function tick(now) {
    if (!queue.length) { raf = null; return; }

    var DURATION = 820;
    var dpr = Math.min(devicePixelRatio || 1, 2);
    var vh  = window.innerHeight;
    var i   = 0;

    while (i < queue.length) {
      var item = queue[i];
      var raw  = Math.min((now - item.start) / DURATION, 1);
      var t    = easeOutQuart(raw);
      var r    = item.section.getBoundingClientRect();

      // Pixel coords in WebGL space (origin = bottom-left), clamped to canvas
      var x0 = Math.max(0, Math.floor(r.left   * dpr));
      var y0 = Math.max(0, Math.floor((vh - r.bottom) * dpr));
      var x1 = Math.min(canvas.width,  Math.ceil(r.right  * dpr));
      var y1 = Math.min(canvas.height, Math.ceil((vh - r.top) * dpr));
      var sw = x1 - x0;
      var sh = y1 - y0;

      if (sw > 0 && sh > 0) {
        gl.scissor(x0, y0, sw, sh);
        gl.viewport(x0, y0, sw, sh);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uT, t);
        gl.uniform3f(uCol, item.r, item.g, item.b);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      if (raw >= 1) { queue.splice(i, 1); } else { i++; }
    }

    raf = requestAnimationFrame(tick);
  }

  function sectionColor(section) {
    if (section.classList.contains('de-ce'))
      return { r: 0.0, g: 0.102, b: 0.2 };    // --deep #001a33
    if (section.classList.contains('testimoniale'))
      return { r: 0.95, g: 0.97, b: 0.99 };
    return { r: 0.953, g: 0.973, b: 0.992 };   // --bg  #f3f9fd
  }

  function revealSection(section) {
    if (done && done.has(section)) return;
    if (done) done.add(section);
    section.classList.remove('reveal-pending');
    section.classList.add('reveal-active');
    var c = sectionColor(section);
    queue.push({ section: section, start: performance.now(), r: c.r, g: c.g, b: c.b });
    if (!raf) raf = requestAnimationFrame(tick);
  }

  window.initSectionReveal = function () {
    if (initialized) return;   // guard against React StrictMode double-call
    initialized = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('section[data-screen-label]').forEach(function (s) {
        s.classList.remove('reveal-pending');
      });
      return;
    }

    if (!initGL()) return;

    var sections = Array.from(
      document.querySelectorAll('section[data-screen-label]')
    ).slice(1); // skip hero — it has its own WebGL

    sections.forEach(function (s) {
      // Only hide sections that start below the viewport
      if (s.getBoundingClientRect().top >= window.innerHeight - 60) {
        s.classList.add('reveal-pending');
      }
    });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { obs.unobserve(e.target); revealSection(e.target); }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -20px 0px' });

    sections.forEach(function (s) { obs.observe(s); });
  };
})();
