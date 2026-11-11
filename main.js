gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,mobile=matchMedia('(max-width:800px)').matches;
if(reduce)document.documentElement.classList.add('rm');
if(mobile)$('.fl:nth-child(7)')?.remove();
// videos: light files on phones, remove the full-screen fallback layer unless needed
const clip=n=>`assets/clips/${mobile?'m/':''}${n}.mp4`;
$$('video[data-clip]').forEach(v=>{if(v.classList.contains('zfull')&&!reduce){v.remove();return}v.muted=true;v.src=clip(v.dataset.clip)});
// statement: colour reveal word by word (opacity only, active also with reduced motion)
const r=$('.reveal');r.innerHTML=r.textContent.split(' ').map(w=>`<span>${w}</span>`).join(' ');
gsap.to('.reveal span',{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:'.reveal',start:'top 85%',end:'bottom 55%',scrub:true}});
if(!reduce){
 // hero: float + parallax on inner video, scroll-zoom on wrapper
 $$('.fl video').forEach((v,i)=>gsap.to(v,{y:i%2?-14:14,duration:3+i*.4,yoyo:true,repeat:-1,ease:'sine.inOut'}));
 if(!mobile)addEventListener('mousemove',e=>{const x=e.clientX/innerWidth-.5;$$('.fl video').forEach((v,i)=>gsap.to(v,{x:x*(14+i*5),duration:1,overwrite:'auto'}))});
 const hero=$('.hero'),tl=gsap.timeline({scrollTrigger:{trigger:hero,start:'top top',end:'+=140%',scrub:.6,pin:true,invalidateOnRefresh:true}});
 $$('.fl').forEach(el=>{
  const d=a=>()=>(a=='x'?el.offsetLeft+el.offsetWidth/2-hero.offsetWidth/2:el.offsetTop+el.offsetHeight/2-hero.offsetHeight/2)*1.7;
  tl.to(el,{scale:mobile?4:4.5,x:d('x'),y:d('y'),ease:'power2.in',duration:1},0).to(el,{opacity:0,duration:.25},.75);
 });
 tl.to('.hero-c',{opacity:0,scale:.92,duration:.35},0);
}else{
 // reduced motion: gentle fades only (no zoom, no float)
 gsap.from('.fl',{opacity:0,duration:1.1,stagger:.12,ease:'power1.out'});gsap.from('.hero-c',{opacity:0,duration:1.2});
 gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'+=90%',scrub:.6,pin:true}}).to('.fl',{opacity:0,duration:1},0).to('.hero-c',{opacity:0,duration:.6},0);
}
// play videos only when visible; if autoplay is blocked (iOS Low Power Mode) show a slow drift on the poster and retry on first touch
const vis=new WeakSet(),go=v=>v.play().then(()=>v.classList.remove('still')).catch(()=>v.classList.add('still'));
const io=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){vis.add(v);go(v)}else{vis.delete(v);v.pause()}}),{threshold:.1});
$$('video[data-clip]').forEach(v=>io.observe(v));
['touchend','click'].forEach(ev=>addEventListener(ev,()=>$$('video[data-clip]').forEach(v=>{if(v.paused&&vis.has(v))go(v)}),{passive:true}));
// principles: ring = progress bar, 3D mark follows window.ambushProgress
const P=[["Concept first.","Every project starts from an idea, not a style."],["Craft is the argument.","Details are what make a concept believable."],["Motion is language.","Movement carries meaning before words do."],["Build systems, not one-offs.","Identities that scale across every screen."],["Culture is context.","Work that belongs to the place it comes from."]];
const N=120,svg=$('.ring svg');let h='';for(let i=0;i<N;i++){const a=i/N*2*Math.PI-Math.PI/2,c=Math.cos(a),s=Math.sin(a);h+=`<line x1="${50+c*44}" y1="${50+s*44}" x2="${50+c*49}" y2="${50+s*49}"/>`}svg.innerHTML=h;
const ticks=$$('.ring line'),li=$$('.words li'),pn=$('#pn'),pt=$('#pt');let last=-1,lastP=-1;
function setP(i){li.forEach((l,k)=>l.classList.toggle('on',k===i));pn.textContent='0'+(i+1);pt.innerHTML=`<b>${P[i][0]}</b><br>${P[i][1]}`}
setP(0);window.ambushProgress=0;
ScrollTrigger.create({trigger:'.principles',start:'top top',end:'bottom bottom',onUpdate:s=>{
 window.ambushProgress=s.progress;const n=Math.round(s.progress*N);
 if(n!==last){ticks.forEach((t,i)=>t.classList.toggle('on',i<n));last=n}
 const i=Math.min(4,Math.floor(s.progress*5));if(i!==lastP){setP(i);lastP=i}}});
// founder: "Zoom in with" scroll-zoom (gentle crossfade when reduced motion)
const zin=$('.zbox');
if(!reduce){
 const zt=gsap.timeline({scrollTrigger:{trigger:'.zoom',start:'top top',end:'+=260%',scrub:.6,pin:true,invalidateOnRefresh:true}});
 const out=s=>mobile?{yPercent:s*400,opacity:0,duration:1}:{xPercent:s*160,opacity:0,duration:1};
 zt.to(zin,{scale:()=>Math.max(innerWidth/zin.offsetWidth,innerHeight/zin.offsetHeight)*1.02,duration:1.4,ease:'power2.inOut'},0)
   .to('.zl',out(-1),0).to('.zr',out(1),0).to('.zbio',{opacity:1,duration:.6},1.2).to({},{duration:.5});
}else{
 gsap.timeline({scrollTrigger:{trigger:'.zoom',start:'top top',end:'+=200%',scrub:.6,pin:true}})
  .to('.zfull',{opacity:1,duration:1},0).to(['.zl','.zr','.zbox'],{opacity:0,duration:.8},.1).to('.zbio',{opacity:1,duration:.6},1).to({},{duration:.4});
}
// footer: slow warp on hover / touch
const turb=$('#turb'),disp=$('#disp'),f={fx:.003,fy:.008},ft=$('footer');
const upd=()=>turb.setAttribute('baseFrequency',`${f.fx} ${f.fy}`);
const on=()=>gsap.to(disp,{attr:{scale:70},duration:2,ease:'power2.out'}),off=()=>gsap.to(disp,{attr:{scale:0},duration:2.6,ease:'power2.out'});
ft.addEventListener('mouseenter',on);ft.addEventListener('mouseleave',off);ft.addEventListener('touchstart',on,{passive:true});ft.addEventListener('touchend',off);
ft.addEventListener('mousemove',e=>{const b=ft.getBoundingClientRect();gsap.to(f,{fx:.002+(e.clientX-b.left)/b.width*.006,fy:.005+(e.clientY-b.top)/b.height*.012,duration:2.2,ease:'power2.out',onUpdate:upd,overwrite:true})});
