import * as THREE from 'three';
import {SVGLoader} from 'three/addons/loaders/SVGLoader.js';
const ring=document.querySelector('.ring'),canvas=document.getElementById('mark3d');
try{
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,50);camera.position.z=7;
scene.add(new THREE.HemisphereLight(0xffffff,0x303030,1.4));
const key=new THREE.DirectionalLight(0xffffff,2.6);key.position.set(3,4,5);scene.add(key);
const rim=new THREE.DirectionalLight(0xbfd0ff,1.8);rim.position.set(-4,-2,-3);scene.add(rim);
const mat=new THREE.MeshStandardMaterial({color:0xf3f1ea,roughness:.3,metalness:.2,side:THREE.DoubleSide});
const svg=`<svg xmlns="http://www.w3.org/2000/svg"><path d="M464.7,264.73c-5.6,0-9.08,1.86-13.12,7.63,0,0-28.25,41.2-31.15,46.24l-.37-43.25c-.04-5.19-4.07-10.45-9.7-10.45-5.18,0-8.49,1.33-11.73,5.2l-44.44,52.6-.18-64.81c-.15-7.91-7.78-11.65-11.87-12.99s-14.4-2.68-20.12,4.79l-20.98,28.89-25.38-30.95c-4.67-5.03-11.37-4.64-15.11-.9-4.54,4.55-4.43,10.74.68,16.52l27.11,33.64-36.31,47.72c-3.22,4.57-3.4,11.33,1.29,15.15,4.3,3.5,12.64,1.99,14.93-1.34l34.17-43.38,32.04,41.63c2.72,3.33,6.45,4.92,10.22,4.84,4.03-.09,7.08-2.17,9.88-5.51l42.59-54.26.4,44.98c.08,9.22,8.59,15.68,15.34,14.79,3.89-.51,7.31-1.52,9.7-5.14l29.52-44.7.55,39.74c.1,6.68,7.06,10.96,13.02,10.13,5.96-.82,10.2-5.86,10.19-12.42l-.23-73.78c-.02-6.34-6.47-10.61-10.94-10.61ZM315.52,296.39l15.62-22.46v43.1l-15.62-20.64Z"/><circle cx="495.18" cy="351.84" r="9.91"/></svg>`;
const inner=new THREE.Group();
new SVGLoader().parse(svg).paths.forEach(p=>SVGLoader.createShapes(p).forEach(sh=>{
 const g=new THREE.ExtrudeGeometry(sh,{depth:46,bevelEnabled:true,bevelThickness:7,bevelSize:6,bevelSegments:5,curveSegments:24});
 inner.add(new THREE.Mesh(g,mat));}));
const box=new THREE.Box3().setFromObject(inner),c=box.getCenter(new THREE.Vector3()),sz=box.getSize(new THREE.Vector3());
inner.position.sub(c);const holder=new THREE.Group();holder.add(inner);
const s=3.3/Math.max(sz.x,sz.y);holder.scale.set(s,-s,s);scene.add(holder);
function size(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
size();addEventListener('resize',size);
let cur=0;
renderer.setAnimationLoop(t=>{const p=window.ambushProgress||0;cur+=(p-cur)*.08;
 holder.rotation.y=cur*Math.PI*4+Math.sin(t/2200)*.15;holder.rotation.x=Math.sin(t/3100)*.08;renderer.render(scene,camera);});
ring.classList.add('is3d');
}catch(e){console.warn('3D fallback',e)}
