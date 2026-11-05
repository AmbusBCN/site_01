gsap.registerPlugin(ScrollTrigger);
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
// statement: word-by-word reveal
const r=document.querySelector('.reveal');r.innerHTML=r.textContent.split(' ').map(w=>`<span>${w}</span>`).join(' ');
if(!reduce){
 gsap.to('.reveal span',{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:'.reveal',start:'top 75%',end:'bottom 40%',scrub:true}});
 document.querySelectorAll('.floaters video').forEach((v,i)=>gsap.to(v,{y:i%2?-24:24,duration:3+i*.4,yoyo:true,repeat:-1,ease:'sine.inOut'}));
 addEventListener('mousemove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;document.querySelectorAll('.floaters video').forEach((v,i)=>gsap.to(v,{x:x*(20+i*8),duration:1}))});
}
// play card videos only when visible
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?e.target.play():e.target.pause()),{threshold:.3});
document.querySelectorAll('.card video').forEach(v=>io.observe(v));
// principles: scroll-driven list + ring rotation
const P=[["Concept first.","Every project starts from an idea, not a style."],["Craft is the argument.","Details are what make a concept believable."],["Motion is language.","Movement carries meaning before words do."],["Build systems, not one-offs.","Identities that scale across every screen."],["Culture is context.","Work that belongs to the place it comes from."]];
const li=[...document.querySelectorAll('.words li')],pn=document.getElementById('pn'),pt=document.getElementById('pt');
function setP(i){li.forEach((l,k)=>l.classList.toggle('on',k===i));pn.textContent='0'+(i+1);pt.innerHTML=`<b>${P[i][0]}</b><br>${P[i][1]}`}
setP(0);
ScrollTrigger.create({trigger:'.principles',start:'top top',end:'bottom bottom',onUpdate:s=>{setP(Math.min(4,Math.floor(s.progress*5)));if(!reduce)gsap.set('.ring',{rotation:s.progress*360})}});
