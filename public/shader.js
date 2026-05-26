// shader.js — WebGL fluid shader for Spălătoria Lupancu hero
// 3 visual modes selectable at runtime:
//   0 = "flow"      — flowing fluid (calm, organic)
//   1 = "caustics"  — pool light caustics (bright, premium)
//   2 = "waves"     — sine-wave ridges (dynamic, modern)

(function () {
  const VERT = `
    attribute vec2 a_position;
    void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
  `;

  const FRAG = `
    precision highp float;
    uniform float u_time;
    uniform vec2  u_resolution;
    uniform int   u_mode;
    uniform vec3  u_deep;
    uniform vec3  u_mid;
    uniform vec3  u_bright;
    uniform vec3  u_light;

    // --- hash / noise / fbm ------------------------------------------------
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), u.x),
                 mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; }
      return v;
    }

    // --- mode 0: flowing fluid --------------------------------------------
    vec3 modeFlow(vec2 p, float t){
      vec2 q = p * 1.4;
      // domain warping for organic fluid feel
      vec2 w = vec2(fbm(q + t*0.06), fbm(q + vec2(5.2, 1.3) + t*0.05));
      float n = fbm(q + w * 1.8 + vec2(t*0.04, -t*0.03));
      n = smoothstep(0.15, 0.95, n);

      vec3 col = mix(u_deep, u_mid, smoothstep(0.0, 0.55, n));
      col = mix(col, u_bright, smoothstep(0.5, 0.9, n));
      // glints
      float glint = smoothstep(0.8, 1.0, n);
      col = mix(col, u_light, glint * 0.7);
      return col;
    }

    // --- mode 1: caustics --------------------------------------------------
    vec3 modeCaustics(vec2 p, float t){
      vec2 q = p * 3.0;
      vec2 i = q;
      float c = 1.0;
      float inten = 0.0035;
      for (int n = 0; n < 5; n++){
        float fi = float(n);
        float ti = t * 0.5 + fi;
        i = q + vec2(
          cos(ti - i.x) + sin(ti + i.y),
          sin(ti - i.y) + cos(ti + i.x)
        );
        c = min(c, length(q / (vec2(sin(i.x + ti), cos(i.y + ti)) / inten)));
      }
      c = 1.0 - clamp(c / 5.0, 0.0, 1.0);
      float caustic = pow(c, 1.4);

      vec3 col = mix(u_deep, u_mid, smoothstep(0.0, 0.4, caustic));
      col = mix(col, u_bright, smoothstep(0.35, 0.75, caustic));
      col = mix(col, u_light, smoothstep(0.75, 1.0, caustic));
      return col;
    }

    // --- mode 2: dynamic waves --------------------------------------------
    vec3 modeWaves(vec2 p, float t){
      vec2 q = p * 1.6;
      // layered traveling waves
      float w1 = sin(q.x * 2.2 + t * 0.6) * 0.5;
      float w2 = sin(q.y * 1.8 - t * 0.45 + q.x * 0.4) * 0.5;
      float w3 = sin((q.x + q.y) * 1.4 + t * 0.35) * 0.4;
      float n  = fbm(q * 1.6 + t * 0.08) * 0.6;
      float h  = (w1 + w2 + w3) * 0.25 + n;
      h = h * 0.5 + 0.5;

      // crest highlights
      float crest = smoothstep(0.6, 0.95, h);
      float ridge = smoothstep(0.85, 1.0, h);

      vec3 col = mix(u_deep, u_mid, smoothstep(0.0, 0.55, h));
      col = mix(col, u_bright, crest);
      col = mix(col, u_light, ridge * 0.85);
      return col;
    }

    void main(){
      vec2 frag = gl_FragCoord.xy;
      vec2 uv = frag / u_resolution.xy;
      vec2 p = (frag - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

      float t = u_time;
      vec3 col;
      if (u_mode == 0)      col = modeFlow(p, t);
      else if (u_mode == 1) col = modeCaustics(p, t);
      else                  col = modeWaves(p, t);

      // soft radial vignette toward bottom-left for cinematic depth
      float vig = smoothstep(1.3, 0.2, length(p + vec2(0.0, 0.1)));
      col *= mix(0.55, 1.0, vig);

      // gentle film grain to avoid banding
      float grain = (hash(frag + t) - 0.5) * 0.025;
      col += grain;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error('shader compile error:', gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  function srgbToLinear(c) {
    return c.map(v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  }

  class FluidShader {
    constructor(canvas) {
      this.canvas = canvas;
      const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });
      if (!gl) { console.warn('WebGL not available'); return; }
      this.gl = gl;

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      const prog = gl.createProgram();
      gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error('link error:', gl.getProgramInfoLog(prog)); return;
      }
      this.prog = prog;
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,  1, -1, -1, 1,
        -1,  1,  1, -1,  1, 1
      ]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'a_position');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      this.u = {
        time: gl.getUniformLocation(prog, 'u_time'),
        res:  gl.getUniformLocation(prog, 'u_resolution'),
        mode: gl.getUniformLocation(prog, 'u_mode'),
        deep:   gl.getUniformLocation(prog, 'u_deep'),
        mid:    gl.getUniformLocation(prog, 'u_mid'),
        bright: gl.getUniformLocation(prog, 'u_bright'),
        light:  gl.getUniformLocation(prog, 'u_light'),
      };

      this.mode = 1;
      this.start = performance.now();
      this.running = true;
      this.lastDraw = 0;
      this.visible = true;

      this.setPalette({
        deep:   '#001a33',
        mid:    '#0284c7',
        bright: '#22d3ee',
        light:  '#e0f7ff',
      });

      this.resize();
      window.addEventListener('resize', () => this.resize());

      // pause animation when hero out of view (battery + perf on mobile)
      const hero = canvas.closest('.hero');
      if (hero && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(([e]) => {
          this.visible = e.isIntersecting;
        }, { threshold: 0 });
        io.observe(hero);
      }

      requestAnimationFrame(this.tick.bind(this));
    }

    setMode(m) { this.mode = m | 0; }

    setPalette(p) {
      this.palette = {
        deep:   srgbToLinear(hexToRgb(p.deep)),
        mid:    srgbToLinear(hexToRgb(p.mid)),
        bright: srgbToLinear(hexToRgb(p.bright)),
        light:  srgbToLinear(hexToRgb(p.light)),
      };
    }

    resize() {
      const gl = this.gl; if (!gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      this.canvas.width = Math.max(1, Math.floor(w * dpr));
      this.canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    tick(now) {
      if (!this.gl) return;
      requestAnimationFrame(this.tick.bind(this));
      if (!this.visible) return;

      // throttle to ~45fps for smooth-enough motion at less battery cost
      if (now - this.lastDraw < 22) return;
      this.lastDraw = now;

      const gl = this.gl;
      const t = (now - this.start) / 1000;
      gl.uniform1f(this.u.time, t);
      gl.uniform2f(this.u.res, this.canvas.width, this.canvas.height);
      gl.uniform1i(this.u.mode, this.mode);
      gl.uniform3fv(this.u.deep,   this.palette.deep);
      gl.uniform3fv(this.u.mid,    this.palette.mid);
      gl.uniform3fv(this.u.bright, this.palette.bright);
      gl.uniform3fv(this.u.light,  this.palette.light);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

  window.FluidShader = FluidShader;
})();
