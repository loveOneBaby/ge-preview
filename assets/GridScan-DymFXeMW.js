import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{a as t,s as n}from"./index-CtIT9NKd.js";import{$ as r,Ct as i,Ft as a,Pt as o,St as s,Z as c,dt as l,lt as u,m as d,r as f,wt as p}from"./three.module-PjEwQlf5.js";var m=e(n()),h=t(),ee=`
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,te=`
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec2 uSkew;
uniform float uTilt;
uniform float uYaw;
uniform float uLineThickness;
uniform vec3 uLinesColor;
uniform vec3 uScanColor;
uniform float uGridScale;
uniform float uLineStyle;
uniform float uLineJitter;
uniform float uScanOpacity;
uniform float uScanDirection;
uniform float uNoise;
uniform float uBloomOpacity;
uniform float uScanGlow;
uniform float uScanSoftness;
uniform float uPhaseTaper;
uniform float uScanDuration;
uniform float uScanDelay;
varying vec2 vUv;

uniform float uScanStarts[8];
uniform float uScanCount;

const int MAX_SCANS = 8;

float smoother01(float a, float b, float x){
  float t = clamp((x - a) / max(1e-5, (b - a)), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;

    vec3 ro = vec3(0.0);
    vec3 rd = normalize(vec3(p, 2.0));

    float cR = cos(uTilt), sR = sin(uTilt);
    rd.xy = mat2(cR, -sR, sR, cR) * rd.xy;

    float cY = cos(uYaw), sY = sin(uYaw);
    rd.xz = mat2(cY, -sY, sY, cY) * rd.xz;

    vec2 skew = clamp(uSkew, vec2(-0.7), vec2(0.7));
    rd.xy += skew * rd.z;

    vec3 color = vec3(0.0);
  float minT = 1e20;
  float gridScale = max(1e-5, uGridScale);
    float fadeStrength = 2.0;
    vec2 gridUV = vec2(0.0);

  float hitIsY = 1.0;
    for (int i = 0; i < 4; i++)
    {
        float isY = float(i < 2);
        float pos = mix(-0.2, 0.2, float(i)) * isY + mix(-0.5, 0.5, float(i - 2)) * (1.0 - isY);
        float num = pos - (isY * ro.y + (1.0 - isY) * ro.x);
        float den = isY * rd.y + (1.0 - isY) * rd.x;
        float t = num / den;
        vec3 h = ro + rd * t;

        float depthBoost = smoothstep(0.0, 3.0, h.z);
        h.xy += skew * 0.15 * depthBoost;

    bool use = t > 0.0 && t < minT;
    gridUV = use ? mix(h.zy, h.xz, isY) / gridScale : gridUV;
    minT = use ? t : minT;
    hitIsY = use ? isY : hitIsY;
    }

    vec3 hit = ro + rd * minT;
    float dist = length(hit - ro);

  float jitterAmt = clamp(uLineJitter, 0.0, 1.0);
  if (jitterAmt > 0.0) {
    vec2 j = vec2(
      sin(gridUV.y * 2.7 + iTime * 1.8),
      cos(gridUV.x * 2.3 - iTime * 1.6)
    ) * (0.15 * jitterAmt);
    gridUV += j;
  }
  float fx = fract(gridUV.x);
  float fy = fract(gridUV.y);
  float ax = min(fx, 1.0 - fx);
  float ay = min(fy, 1.0 - fy);
  float wx = fwidth(gridUV.x);
  float wy = fwidth(gridUV.y);
  float halfPx = max(0.0, uLineThickness) * 0.5;

  float tx = halfPx * wx;
  float ty = halfPx * wy;

  float aax = wx;
  float aay = wy;

  float lineX = 1.0 - smoothstep(tx, tx + aax, ax);
  float lineY = 1.0 - smoothstep(ty, ty + aay, ay);
  if (uLineStyle > 0.5) {
    float dashRepeat = 4.0;
    float dashDuty = 0.5;
    float vy = fract(gridUV.y * dashRepeat);
    float vx = fract(gridUV.x * dashRepeat);
    float dashMaskY = step(vy, dashDuty);
    float dashMaskX = step(vx, dashDuty);
    if (uLineStyle < 1.5) {
      lineX *= dashMaskY;
      lineY *= dashMaskX;
    } else {
      float dotRepeat = 6.0;
      float dotWidth = 0.18;
      float cy = abs(fract(gridUV.y * dotRepeat) - 0.5);
      float cx = abs(fract(gridUV.x * dotRepeat) - 0.5);
      float dotMaskY = 1.0 - smoothstep(dotWidth, dotWidth + fwidth(gridUV.y * dotRepeat), cy);
      float dotMaskX = 1.0 - smoothstep(dotWidth, dotWidth + fwidth(gridUV.x * dotRepeat), cx);
      lineX *= dotMaskY;
      lineY *= dotMaskX;
    }
  }
  float primaryMask = max(lineX, lineY);

  vec2 gridUV2 = (hitIsY > 0.5 ? hit.xz : hit.zy) / gridScale;
  if (jitterAmt > 0.0) {
    vec2 j2 = vec2(
      cos(gridUV2.y * 2.1 - iTime * 1.4),
      sin(gridUV2.x * 2.5 + iTime * 1.7)
    ) * (0.15 * jitterAmt);
    gridUV2 += j2;
  }
  float fx2 = fract(gridUV2.x);
  float fy2 = fract(gridUV2.y);
  float ax2 = min(fx2, 1.0 - fx2);
  float ay2 = min(fy2, 1.0 - fy2);
  float wx2 = fwidth(gridUV2.x);
  float wy2 = fwidth(gridUV2.y);
  float tx2 = halfPx * wx2;
  float ty2 = halfPx * wy2;
  float aax2 = wx2;
  float aay2 = wy2;
  float lineX2 = 1.0 - smoothstep(tx2, tx2 + aax2, ax2);
  float lineY2 = 1.0 - smoothstep(ty2, ty2 + aay2, ay2);
  if (uLineStyle > 0.5) {
    float dashRepeat2 = 4.0;
    float dashDuty2 = 0.5;
    float vy2m = fract(gridUV2.y * dashRepeat2);
    float vx2m = fract(gridUV2.x * dashRepeat2);
    float dashMaskY2 = step(vy2m, dashDuty2);
    float dashMaskX2 = step(vx2m, dashDuty2);
    if (uLineStyle < 1.5) {
      lineX2 *= dashMaskY2;
      lineY2 *= dashMaskX2;
    } else {
      float dotRepeat2 = 6.0;
      float dotWidth2 = 0.18;
      float cy2 = abs(fract(gridUV2.y * dotRepeat2) - 0.5);
      float cx2 = abs(fract(gridUV2.x * dotRepeat2) - 0.5);
      float dotMaskY2 = 1.0 - smoothstep(dotWidth2, dotWidth2 + fwidth(gridUV2.y * dotRepeat2), cy2);
      float dotMaskX2 = 1.0 - smoothstep(dotWidth2, dotWidth2 + fwidth(gridUV2.x * dotRepeat2), cx2);
      lineX2 *= dotMaskY2;
      lineY2 *= dotMaskX2;
    }
  }
    float altMask = max(lineX2, lineY2);

    float edgeDistX = min(abs(hit.x - (-0.5)), abs(hit.x - 0.5));
    float edgeDistY = min(abs(hit.y - (-0.2)), abs(hit.y - 0.2));
    float edgeDist = mix(edgeDistY, edgeDistX, hitIsY);
    float edgeGate = 1.0 - smoothstep(gridScale * 0.5, gridScale * 2.0, edgeDist);
    altMask *= edgeGate;

  float lineMask = max(primaryMask, altMask);

    float fade = exp(-dist * fadeStrength);

    float dur = max(0.05, uScanDuration);
    float del = max(0.0, uScanDelay);
    float scanZMax = 2.0;
    float widthScale = max(0.1, uScanGlow);
    float sigma = max(0.001, 0.18 * widthScale * uScanSoftness);
    float sigmaA = sigma * 2.0;

    float combinedPulse = 0.0;
    float combinedAura = 0.0;

    float cycle = dur + del;
    float tCycle = mod(iTime, cycle);
    float scanPhase = clamp((tCycle - del) / dur, 0.0, 1.0);
    float phase = scanPhase;
    if (uScanDirection > 0.5 && uScanDirection < 1.5) {
      phase = 1.0 - phase;
    } else if (uScanDirection > 1.5) {
      float t2 = mod(max(0.0, iTime - del), 2.0 * dur);
      phase = (t2 < dur) ? (t2 / dur) : (1.0 - (t2 - dur) / dur);
    }
    float scanZ = phase * scanZMax;
    float dz = abs(hit.z - scanZ);
    float lineBand = exp(-0.5 * (dz * dz) / (sigma * sigma));
    float taper = clamp(uPhaseTaper, 0.0, 0.49);
    float headW = taper;
    float tailW = taper;
    float headFade = smoother01(0.0, headW, phase);
    float tailFade = 1.0 - smoother01(1.0 - tailW, 1.0, phase);
    float phaseWindow = headFade * tailFade;
    float pulseBase = lineBand * phaseWindow;
    combinedPulse += pulseBase * clamp(uScanOpacity, 0.0, 1.0);
    float auraBand = exp(-0.5 * (dz * dz) / (sigmaA * sigmaA));
    combinedAura += (auraBand * 0.25) * phaseWindow * clamp(uScanOpacity, 0.0, 1.0);

    for (int i = 0; i < MAX_SCANS; i++) {
      if (float(i) >= uScanCount) break;
      float tActiveI = iTime - uScanStarts[i];
      float phaseI = clamp(tActiveI / dur, 0.0, 1.0);
      if (uScanDirection > 0.5 && uScanDirection < 1.5) {
        phaseI = 1.0 - phaseI;
      } else if (uScanDirection > 1.5) {
        phaseI = (phaseI < 0.5) ? (phaseI * 2.0) : (1.0 - (phaseI - 0.5) * 2.0);
      }
      float scanZI = phaseI * scanZMax;
      float dzI = abs(hit.z - scanZI);
      float lineBandI = exp(-0.5 * (dzI * dzI) / (sigma * sigma));
      float headFadeI = smoother01(0.0, headW, phaseI);
      float tailFadeI = 1.0 - smoother01(1.0 - tailW, 1.0, phaseI);
      float phaseWindowI = headFadeI * tailFadeI;
      combinedPulse += lineBandI * phaseWindowI * clamp(uScanOpacity, 0.0, 1.0);
      float auraBandI = exp(-0.5 * (dzI * dzI) / (sigmaA * sigmaA));
      combinedAura += (auraBandI * 0.25) * phaseWindowI * clamp(uScanOpacity, 0.0, 1.0);
    }

  float lineVis = lineMask;
  vec3 gridCol = uLinesColor * lineVis * fade;
  vec3 scanCol = uScanColor * combinedPulse;
  vec3 scanAura = uScanColor * combinedAura;

    color = gridCol + scanCol + scanAura;

  float n = fract(sin(dot(gl_FragCoord.xy + vec2(iTime * 123.4), vec2(12.9898,78.233))) * 43758.5453123);
  color += (n - 0.5) * uNoise;
  color = clamp(color, 0.0, 1.0);
  float alpha = clamp(max(lineVis, combinedPulse), 0.0, 1.0);
  float gx = 1.0 - smoothstep(tx * 2.0, tx * 2.0 + aax * 2.0, ax);
  float gy = 1.0 - smoothstep(ty * 2.0, ty * 2.0 + aay * 2.0, ay);
  float halo = max(gx, gy) * fade;
  alpha = max(alpha, halo * clamp(uBloomOpacity, 0.0, 1.0));
  fragColor = vec4(color, alpha);
}

void main(){
  vec4 c;
  mainImage(c, vUv * iResolution.xy);
  gl_FragColor = c;
}
`,g=({enableWebcam:e=!1,showPreview:t=!1,modelsPath:n=`https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights`,sensitivity:d=.55,lineThickness:g=1,linesColor:v=`#2F293A`,scanColor:y=`#FF9FFC`,scanOpacity:b=.4,gridScale:x=.1,lineStyle:S=`solid`,lineJitter:C=.1,scanDirection:w=`pingpong`,enablePost:ie=!0,bloomIntensity:T=0,bloomThreshold:E=0,bloomSmoothing:D=0,chromaticAberration:O=.002,noiseIntensity:k=.01,scanGlow:A=.5,scanSoftness:j=2,scanPhaseTaper:M=.9,scanDuration:N=2,scanDelay:P=2,enableGyro:F=!1,scanOnClick:I=!1,snapBackDelay:ae=250,className:L,style:oe})=>{let R=(0,m.useRef)(null),se=(0,m.useRef)(null),ce=(0,m.useRef)(null),z=(0,m.useRef)(null),B=(0,m.useRef)(null),[V,le]=(0,m.useState)(!1),H=(0,m.useRef)(new o(0,0)),U=(0,m.useRef)(0),W=(0,m.useRef)(0),G=(0,m.useRef)(new o(0,0)),ue=(0,m.useRef)(new o(0,0)),K=(0,m.useRef)(0),q=(0,m.useRef)(0),J=(0,m.useRef)(0),Y=(0,m.useRef)(0),de=(0,m.useRef)([]),fe=e=>{let t=de.current.slice();if(t.length>=8&&t.shift(),t.push(e),de.current=t,z.current){let e=z.current.uniforms,n=Array(8).fill(0);for(let e=0;e<t.length&&e<8;e++)n[e]=t[e];e.uScanStarts.value=n,e.uScanCount.value=t.length}};(0,m.useRef)([]),(0,m.useRef)([]),(0,m.useRef)([]),(0,m.useRef)([]);let X=c.clamp(d,0,1),Z=c.lerp(.06,.2,X),pe=c.lerp(.12,.3,X),me=c.lerp(.1,.28,X);c.lerp(.25,.45,X);let Q=c.lerp(.45,.12,X),$=1/0,he=c.lerp(1.2,1.6,X);return(0,m.useEffect)(()=>{let e=R.current;if(!e)return;let t=null,n=n=>{if(V)return;t&&=(clearTimeout(t),null);let r=e.getBoundingClientRect(),i=(n.clientX-r.left)/r.width*2-1,a=-((n.clientY-r.top)/r.height*2-1);H.current.set(i,a)},r=async()=>{let e=performance.now()/1e3;if(I&&fe(e),F&&typeof window<`u`&&window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission)try{await DeviceOrientationEvent.requestPermission()}catch{}},i=()=>{t&&=(clearTimeout(t),null)},a=()=>{V||(t&&clearTimeout(t),t=window.setTimeout(()=>{H.current.set(0,0),U.current=0,W.current=0},Math.max(0,ae||0)))};return e.addEventListener(`mousemove`,n),e.addEventListener(`mouseenter`,i),I&&e.addEventListener(`click`,r),e.addEventListener(`mouseleave`,a),()=>{e.removeEventListener(`mousemove`,n),e.removeEventListener(`mouseenter`,i),e.removeEventListener(`mouseleave`,a),I&&e.removeEventListener(`click`,r),t&&clearTimeout(t)}},[V,ae,I,F]),(0,m.useEffect)(()=>{let e=R.current;if(!e)return;let t=new f({antialias:!0,alpha:!0});ce.current=t,t.setPixelRatio(1),t.setSize(e.clientWidth,e.clientHeight),t.outputColorSpace=s,t.toneMapping=0,t.autoClear=!1,t.setClearColor(0,0),e.appendChild(t.domElement);let n=new p({uniforms:{iResolution:{value:new a(e.clientWidth,e.clientHeight,t.getPixelRatio())},iTime:{value:0},uSkew:{value:new o(0,0)},uTilt:{value:0},uYaw:{value:0},uLineThickness:{value:g},uLinesColor:{value:_(v)},uScanColor:{value:_(y)},uGridScale:{value:x},uLineStyle:{value:S===`dashed`?1:S===`dotted`?2:0},uLineJitter:{value:Math.max(0,Math.min(1,C||0))},uScanOpacity:{value:b},uNoise:{value:k},uBloomOpacity:{value:T},uScanGlow:{value:A},uScanSoftness:{value:j},uPhaseTaper:{value:M},uScanDuration:{value:N},uScanDelay:{value:P},uScanDirection:{value:w===`backward`?1:w===`pingpong`?2:0},uScanStarts:{value:Array(8).fill(0)},uScanCount:{value:0}},vertexShader:ee,fragmentShader:te,transparent:!0,depthWrite:!1,depthTest:!1});z.current=n;let d=new i,m=new u(-1,1,1,-1,0,1),h=new r(new l(2,2),n);d.add(h);let ie=()=>{t.setSize(e.clientWidth,e.clientHeight),n.uniforms.iResolution.value.set(e.clientWidth,e.clientHeight,t.getPixelRatio())};window.addEventListener(`resize`,ie);let E=performance.now(),D=0,O=()=>{let e=performance.now();if(B.current=requestAnimationFrame(O),e-D<33)return;D=e;let r=Math.max(0,Math.min(.1,(e-E)/1e3));E=e,G.current.copy(ne(G.current,H.current,ue.current,Q,$,r));let i=re(K.current,U.current,{v:q.current},Q,$,r);K.current=i.value,q.current=i.v;let a=re(J.current,W.current,{v:Y.current},Q,$,r);J.current=a.value,Y.current=a.v;let s=new o(G.current.x*Z,-G.current.y*he*Z);n.uniforms.uSkew.value.set(s.x,s.y),n.uniforms.uTilt.value=K.current*pe,n.uniforms.uYaw.value=c.clamp(J.current*me,-.6,.6),n.uniforms.iTime.value=e/1e3,t.clear(!0,!0,!0),t.render(d,m)};return B.current=requestAnimationFrame(O),()=>{B.current&&cancelAnimationFrame(B.current),window.removeEventListener(`resize`,ie),n.dispose(),h.geometry.dispose(),t.dispose(),t.forceContextLoss(),e.removeChild(t.domElement)}},[d,g,v,y,b,x,S,C,w,k,T,A,j,M,N,P,E,D,O,Q,$,Z,he,pe,me]),(0,m.useEffect)(()=>{let e=z.current;if(e){let t=e.uniforms;t.uLineThickness.value=g,t.uLinesColor.value.copy(_(v)),t.uScanColor.value.copy(_(y)),t.uGridScale.value=x,t.uLineStyle.value=S===`dashed`?1:S===`dotted`?2:0,t.uLineJitter.value=Math.max(0,Math.min(1,C||0)),t.uBloomOpacity.value=Math.max(0,T),t.uNoise.value=Math.max(0,k),t.uScanGlow.value=A,t.uScanOpacity.value=Math.max(0,Math.min(1,b)),t.uScanDirection.value=w===`backward`?1:w===`pingpong`?2:0,t.uScanSoftness.value=j,t.uPhaseTaper.value=M,t.uScanDuration.value=Math.max(.05,N),t.uScanDelay.value=Math.max(0,P)}},[g,v,y,x,S,C,T,k,A,b,w,j,M,N,P]),(0,m.useEffect)(()=>{if(!F)return;let e=e=>{if(V)return;let t=e.gamma??0,n=e.beta??0,r=c.clamp(t/45,-1,1),i=c.clamp(-n/30,-1,1);H.current.set(r,i),U.current=c.degToRad(t)*.4};return window.addEventListener(`deviceorientation`,e),()=>{window.removeEventListener(`deviceorientation`,e)}},[F,V]),(0,h.jsx)(`div`,{ref:R,className:`gridscan${L?` ${L}`:``}`,style:oe,children:t&&(0,h.jsxs)(`div`,{className:`gridscan__preview`,children:[(0,h.jsx)(`video`,{ref:se,muted:!0,playsInline:!0,autoPlay:!0,className:`gridscan__video`}),(0,h.jsx)(`div`,{className:`gridscan__badge`,children:`Webcam disabled`})]})})};function _(e){return new d(e).convertSRGBToLinear()}function ne(e,t,n,r,i,a){let o=e.clone();r=Math.max(1e-4,r);let s=2/r,c=s*a,l=1/(1+c+.48*c*c+.235*c*c*c),u=e.clone().sub(t),d=t.clone(),f=i*r;u.length()>f&&u.setLength(f),t=e.clone().sub(u);let p=n.clone().addScaledVector(u,s).multiplyScalar(a);n.sub(p.clone().multiplyScalar(s)),n.multiplyScalar(l),o.copy(t.clone().add(u.add(p).multiplyScalar(l)));let m=d.clone().sub(e),h=o.clone().sub(d);return m.dot(h)>0&&(o.copy(d),n.set(0,0)),o}function re(e,t,n,r,i,a){r=Math.max(1e-4,r);let o=2/r,s=o*a,c=1/(1+s+.48*s*s+.235*s*s*s),l=e-t,u=t,d=i*r;l=Math.sign(l)*Math.min(Math.abs(l),d),t=e-l;let f=(n.v+o*l)*a;n.v=(n.v-o*f)*c;let p=t+(l+f)*c;return(u-e)*(p-u)>0&&(p=u,n.v=0),{value:p,v:n.v}}export{g as GridScan};