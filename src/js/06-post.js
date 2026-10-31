import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

/* ================= кинематографичная картинка: постобработка =================
   Высокое: сглаживание, мягкое свечение ламп и неона, глубина резкости на крупных планах, плёночное зерно.
   Среднее (телефон): свечение и цветокоррекция. Низкое / экономия: только цветокоррекция без лишних проходов.
   Если кадров мало — эффекты отключаются по одному, начиная с самых дорогих. */
const POST = { tier: 0, dof: null, dofOn: false, focusD: 3, focusWant: 3, apWant: 0, ap: 0, t: 0, drops: 0 };
POST.tier = SET.saver || SET.quality === "low" ? 0 : SET.quality === "high" ? 2 : SET.quality === "medium" ? 1 : QUALITY > 1 ? 2 : 1;
const GRADE = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uGrain: { value: .035 }, uVig: { value: .42 }, uWarm: { value: 1 }, uRes: { value: new THREE.Vector2(1, 1) } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime, uGrain, uVig, uWarm; uniform vec2 uRes; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      vec3 col = c.rgb;
      float l = dot(col, vec3(.2126, .7152, .0722));
      // тени чуть в тёплый коричневый, света в янтарь — единый тон заведения
      vec3 sh = vec3(.045, .022, .018), hi = vec3(1.03, .985, .93);
      col = mix(col + sh * (1. - smoothstep(0., .35, l)) * uWarm, col * hi, smoothstep(.45, 1., l) * uWarm);
      // мягкая S-кривая
      col = mix(col, col * col * (3. - 2. * col), .22);
      // виньетка
      vec2 q = vUv - .5; q.x *= uRes.x / uRes.y;
      col *= 1. - uVig * smoothstep(.35, 1.05, length(q));
      // плёночное зерно, сильнее в тенях
      float g = h(vUv * uRes + fract(uTime * 7.31) * 113.) - .5;
      col += g * uGrain * (1.15 - l);
      gl_FragColor = vec4(col, c.a);
    }`
};
const postRT = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: POST.tier === 2 ? 4 : 0 });
const composer = new EffectComposer(renderer, postRT);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const bokeh = new BokehPass(scene, camera, { focus: 3, aperture: 0, maxblur: .007 });
bokeh.enabled = false;
composer.addPass(bokeh);
const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), .3, .5, .86);
bloom.enabled = POST.tier >= 1;
composer.addPass(bloom);
composer.addPass(new OutputPass());
const grade = new ShaderPass(GRADE);
composer.addPass(grade);
POST.composer = composer; POST.bloom = bloom; POST.bokeh = bokeh; POST.grade = grade;
POST.setSize = () => {
  composer.setPixelRatio(renderer.getPixelRatio());
  composer.setSize(innerWidth, innerHeight);
  // свечение считаем в половинном разрешении: мягче и дешевле
  bloom.resolution.set(innerWidth / 2, innerHeight / 2);
  grade.uniforms.uRes.value.set(innerWidth * renderer.getPixelRatio(), innerHeight * renderer.getPixelRatio());
};
/* глубина резкости: фокус на точке; null — выключить (плавно) */
POST.focus = (p, aperture = .0018) => {
  if (!p || POST.tier < 2) { POST.apWant = 0; return; }
  POST.target = p; POST.apWant = aperture;
};
const _pf = new THREE.Vector3();
POST.render = (dt = .016) => {
  POST.t += dt;
  grade.uniforms.uTime.value = reduceMotion.matches ? 0 : POST.t;
  grade.uniforms.uGrain.value = POST.tier === 2 && SET.effects && !SET.saver ? .035 : .018;
  if (POST.tier === 0) { renderer.render(scene, camera); return; }
  // плавное появление и уход размытия
  POST.ap += (POST.apWant - POST.ap) * Math.min(1, dt * 3);
  if (POST.target) {
    camera.getWorldDirection(_pf);
    const want = Math.max(.15, _pf.dot(POST.target.clone().sub(camera.position)));
    POST.focusD += (want - POST.focusD) * Math.min(1, dt * 5);
  }
  bokeh.enabled = POST.ap > .00005;
  bokeh.uniforms.focus.value = POST.focusD;
  bokeh.uniforms.aperture.value = POST.ap;
  composer.render(dt);
};
/* если тормозит: сначала уходит глубина резкости, потом сглаживание и свечение */
POST.degrade = () => {
  POST.drops++;
  if (POST.tier === 2) { POST.tier = 1; postRT.samples = 0; POST.apWant = 0; return true; }
  if (POST.tier === 1 && bloom.enabled) { bloom.enabled = false; return true; }
  if (POST.tier === 1) { POST.tier = 0; return true; }
  return false;
};
