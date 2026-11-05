gsap.registerPlugin(ScrollTrigger);
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
// statement: word reveal
const r=$('.reveal');r.innerHTML=r.textContent.split(' ').map(w=>`<span>${w}</span>`).join(' ');
if(!reduce){
 gsap.to('.reveal span',{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:'.reveal',start:'top 75%',end:'bottom 40%',scrub:true}});
 // hero: float + parallax on inner video, scroll-zoom on wrapper
 $$('.fl video').forEach((v,i)=>gsap.to(v,{y:i%2?-18:18,duration:3+i*.4,yoyo:true,repeat:-1,ease:'sine.inOut'}));
 addEventListener('mousemove',e=>{const x=e.clientX/innerWidth-.5;$$('.fl video').forEach((v,i)=>gsap.to(v,{x:x*(14+i*5),duration:1,overwrite:'auto'}))});
 const hero=$('.hero'),tl=gsap.timeline({scrollTrigger:{trigger:hero,start:'top top',end:'+=140%',scrub:.6,pin:true}});
 $$('.fl').forEach(el=>{
  const d=a=>()=>(a=='x'?el.offsetLeft+el.offsetWidth/2-hero.offsetWidth/2:el.offsetTop+el.offsetHeight/2-hero.offsetHeight/2)*1.7;
  tl.to(el,{scale:4.5,x:d('x'),y:d('y'),ease:'power2.in',duration:1},0).to(el,{opacity:0,duration:.25},.75);
 });
 tl.to('.hero-c',{opacity:0,scale:.92,duration:.35},0);
}
// play videos only when visible
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?e.target.play().catch(()=>{}):e.target.pause()),{threshold:.2});
$$('.card video,.zbox video').forEach(v=>io.observe(v));
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
// founder: "Zoom in with" scroll-zoom
if(!reduce){
 const box=$('.zbox'),zt=gsap.timeline({scrollTrigger:{trigger:'.zoom',start:'top top',end:'+=260%',scrub:.6,pin:true}});
 zt.to(box,{scale:()=>Math.max(innerWidth/box.offsetWidth,innerHeight/box.offsetHeight)*1.02,duration:1.4,ease:'power2.inOut'},0)
   .to('.zl',{xPercent:-160,opacity:0,duration:1},0).to('.zr',{xPercent:160,opacity:0,duration:1},0)
   .to('.zbio',{opacity:1,duration:.6},1.2).to({},{duration:.5});
}else{$('.zbio').style.opacity=1}
// footer: slow warp on hover
const turb=$('#turb'),disp=$('#disp'),f={fx:.003,fy:.008},ft=$('footer');
const upd=()=>turb.setAttribute('baseFrequency',`${f.fx} ${f.fy}`);
ft.addEventListener('mouseenter',()=>gsap.to(disp,{attr:{scale:70},duration:2,ease:'power2.out'}));
ft.addEventListener('mouseleave',()=>gsap.to(disp,{attr:{scale:0},duration:2.6,ease:'power2.out'}));
ft.addEventListener('mousemove',e=>{const b=ft.getBoundingClientRect();gsap.to(f,{fx:.002+(e.clientX-b.left)/b.width*.006,fy:.005+(e.clientY-b.top)/b.height*.012,duration:2.2,ease:'power2.out',onUpdate:upd,overwrite:true})});
