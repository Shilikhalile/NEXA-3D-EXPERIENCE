/* NEXA — deep interactive 3D experience */
const canvas=document.getElementById('canvas');
const scene=new THREE.Scene(); scene.background=new THREE.Color(0x030509); scene.fog=new THREE.FogExp2(0x030509,.028);
const camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.1,120); camera.position.set(0,.2,8);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,1.6)); renderer.setSize(innerWidth,innerHeight);
const world=new THREE.Group(); scene.add(world);
scene.add(new THREE.AmbientLight(0x9db8d8,.35)); const key=new THREE.PointLight(0xddeeff,5,28); key.position.set(0,3,5); scene.add(key);
const rim=new THREE.PointLight(0x4d8dff,6,24); rim.position.set(-5,1,1); scene.add(rim);
const mouse={x:0,y:0,tx:0,ty:0}; addEventListener('pointermove',e=>{mouse.tx=e.clientX/innerWidth*2-1;mouse.ty=-(e.clientY/innerHeight*2-1)});
let drag=null,locked=false; addEventListener('pointerdown',e=>drag={x:e.clientX,y:e.clientY}); addEventListener('pointerup',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.max(Math.abs(dx),Math.abs(dy))>42)goTo(current+(Math.abs(dy)>Math.abs(dx)?(dy<0?1:-1):(dx<0?1:-1)));drag=null});
addEventListener('wheel',e=>{if(locked)return;locked=true;goTo(current+(e.deltaY>0?1:-1));setTimeout(()=>locked=false,760)},{passive:true});

const COUNT=innerWidth<700?2600:5200, positions=new Float32Array(COUNT*3), targets=new Float32Array(COUNT*3), velocities=new Float32Array(COUNT*3), seed=[];
for(let i=0;i<COUNT;i++){const j=i*3,a=Math.random()*Math.PI*2,r=3+Math.random()*8;positions[j]=Math.cos(a)*r;positions[j+1]=(Math.random()-.5)*8;positions[j+2]=Math.sin(a)*r;targets[j]=positions[j];targets[j+1]=positions[j+1];targets[j+2]=positions[j+2];seed.push(Math.random())}
const pgeo=new THREE.BufferGeometry();pgeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
const pmat=new THREE.PointsMaterial({color:0xbad8ff,size:innerWidth<700?.025:.038,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false});const pts=new THREE.Points(pgeo,pmat);world.add(pts);
function setTarget(fn){for(let i=0;i<COUNT;i++){const p=fn(i,seed[i]),j=i*3;targets[j]=p[0];targets[j+1]=p[1];targets[j+2]=p[2]}}
function spherePoint(i,s,r=2.2){const a=s*Math.PI*2,b=((i*0.618033)%1)*Math.PI;return[Math.cos(a)*Math.sin(b)*r,Math.cos(b)*r,Math.sin(a)*Math.sin(b)*r]}
function galaxy(i,s){const arm=(i%5)/5*Math.PI*2, r=Math.pow(s,.55)*4.8, a=arm+r*1.75+(s-.5)*.7;return[Math.cos(a)*r,(s-.5)*1.1+Math.sin(a*3+i)*.16,Math.sin(a)*r]}
function dna(i,s){const t=(i/COUNT)*Math.PI*14, r=1.25, strand=i%2?Math.PI:0;return[Math.cos(t+strand)*r,((i/COUNT)-.5)*5.4,Math.sin(t+strand)*r]}
function energy(i,s){const a=s*Math.PI*2, r=.7+((i%90)/90)*3.5;return[Math.cos(a)*r,Math.sin(a*2+i)*.2,Math.sin(a)*r]}
function entity(i,s){const a=s*Math.PI*2, y=((i%80)/80-0.5)*3.8, r=.55+(Math.floor(i/80)%4)*.28;return[Math.cos(a)*r,y,Math.sin(a)*r]}
function worldPoint(i,s){const a=s*Math.PI*2, r=1.5+((i%13)/13)*3.5;return[Math.cos(a)*r,(Math.sin(a*2)+s-.5)*2,Math.sin(a)*r]}
const presets=[i=>spherePoint(i,seed[i],2.35),galaxy,dna,energy,entity,worldPoint,i=>spherePoint(i,seed[i],1.8)];
function wire(g,c=0xe7f4ff,o=.78){return new THREE.LineSegments(new THREE.WireframeGeometry(g),new THREE.LineBasicMaterial({color:c,transparent:true,opacity:o}))}
function glow(g,c=0x76baff,o=.1){return new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,side:THREE.DoubleSide}))}
function addRings(g,n=5){for(let i=0;i<n;i++){const q=new THREE.Mesh(new THREE.TorusGeometry(1.6+i*.25,.012,8,96),new THREE.MeshBasicMaterial({color:i%2?0x8fcaff:0xffffff,transparent:true,opacity:.4}));q.rotation.set(i*.55,i*.37,i*.2);g.add(q)}}
function makeVisual(index){const g=new THREE.Group();g.position.y=-.15;
 if(index===0){g.add(wire(new THREE.IcosahedronGeometry(2.1,3)));g.add(glow(new THREE.IcosahedronGeometry(2.04,2),0x78baff,.055));addRings(g,3)}
 if(index===1){addRings(g,9);g.add(glow(new THREE.SphereGeometry(1.2,24,16),0x7abaff,.08))}
 if(index===2){for(let z=-1;z<=1;z+=2){const q=wire(new THREE.TorusKnotGeometry(1.2,.04,96,10),0xbedfff,.55);q.position.z=z*.5;q.rotation.x=z*.35;g.add(q)}}
 if(index===3){g.add(wire(new THREE.SphereGeometry(1.6,18,10),0xa9d5ff,.55));for(let i=0;i<6;i++){const q=wire(new THREE.OctahedronGeometry(.4+i*.12,1));q.position.set(Math.sin(i)*1.5,Math.cos(i*1.7)*.8,Math.cos(i)*1.5);g.add(q)}}
 if(index===4){const head=wire(new THREE.SphereGeometry(1.15,16,12),0xbadfff,.8);head.position.y=.85;g.add(head);const body=wire(new THREE.BoxGeometry(1.8,2.1,1.2),0x8bc8ff,.7);body.position.y=-.7;g.add(body);for(let i=0;i<2;i++){const eye=glow(new THREE.SphereGeometry(.13,12,8),0xffffff,.9);eye.position.set(i ? .34 : -.34,1.05,1.02);g.add(eye)}}
 if(index===5){g.add(wire(new THREE.SphereGeometry(1.55,18,12)));addRings(g,6);for(let i=0;i<8;i++){const q=wire(new THREE.OctahedronGeometry(.28,1),0xa8d7ff,.65);q.position.set(Math.sin(i)*2.6,(i%3-1)*.8,Math.cos(i)*2.6);g.add(q)}}
 if(index===6){g.add(wire(new THREE.DodecahedronGeometry(1.8,2),0xffffff,.95));g.add(glow(new THREE.SphereGeometry(1.3,24,18),0x75b8ff,.14));addRings(g,5)}
 return g}

const sceneData=[['NEXA CORE','OBJECT / RESPONSIVE / INITIALIZATION'],['NEXA GALAXY','PARTICLE SYSTEM / ORBITAL FIELD'],['DIGITAL DNA','STRUCTURE / MORPHING / MEMORY'],['ENERGY CORE','WAVEFORM / POWER / ACTIVE'],['AI ENTITY','ENTITY / VISION / AWARE'],['NEXA WORLD','ECOSYSTEM / NETWORK / ALIVE'],['FINAL NEXA','CORE COMPLETE / ENTER THE EXPERIENCE']];
let current=0,visual=null,transition=1,shake=0,last=performance.now();
function updateHUD(){const d=sceneData[current];document.querySelector('.scene-number').textContent=`${String(current+1).padStart(2,'0')} / 07`;document.querySelector('.scene-title').textContent=d[0];document.querySelector('.scene-description').textContent=d[1];document.querySelector('.progress').style.width=`${current/6*100}%`}
function goTo(n){if(n<0||n>6||n===current||transition<1)return;current=n;transition=0;shake=1.4;setTarget(presets[current]);const next=makeVisual(current);next.scale.set(.03,.03,.03);world.add(next);if(visual)world.remove(visual);visual=next;updateHUD();document.getElementById('flash').classList.add('active');setTimeout(()=>document.getElementById('flash').classList.remove('active'),220)}
document.getElementById('enterButton').addEventListener('click',()=>{document.getElementById('intro').classList.add('hidden');document.getElementById('hud').classList.add('active');document.getElementById('mobileHint').textContent='SWIPE OR SCROLL TO EXPLORE';if(!visual){visual=makeVisual(0);world.add(visual);setTarget(presets[0])}updateHUD()});updateHUD();
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;mouse.x+=(mouse.tx-mouse.x)*.055;mouse.y+=(mouse.ty-mouse.y)*.055;const morph=Math.min(1,transition+=dt*1.15),ease=1-Math.pow(1-morph,3);for(let i=0;i<COUNT;i++){const j=i*3,dx=targets[j]-positions[j],dy=targets[j+1]-positions[j+1],dz=targets[j+2]-positions[j+2];const burst=(1-ease)*Math.sin(ease*Math.PI)*(.7+seed[i]*1.8);velocities[j]=(velocities[j]+dx*.022)*.91;velocities[j+1]=(velocities[j+1]+dy*.022)*.91;velocities[j+2]=(velocities[j+2]+dz*.022)*.91;positions[j]+=velocities[j]+mouse.x*.002*positions[j+2]+(i%17===0?burst*dx*.012:0);positions[j+1]+=velocities[j+1]+mouse.y*.002*positions[j];positions[j+2]+=velocities[j+2]}
pgeo.attributes.position.needsUpdate=true;pts.rotation.y+=dt*(.08+Math.abs(mouse.x)*.28);pts.rotation.x+=(mouse.y*.12-pts.rotation.x)*.025;if(visual){visual.scale.lerp(new THREE.Vector3(1,1,1),.085);visual.rotation.y+=dt*(.18+Math.abs(mouse.x)*.48);visual.rotation.x+=(mouse.y*.28-visual.rotation.x)*.04;visual.position.x+=(mouse.x*.45-visual.position.x)*.035;visual.position.y+=(-.15+mouse.y*.3-visual.position.y)*.035}
shake*=.9;camera.position.x+=(mouse.x*.45+(Math.random()-.5)*shake*.06-camera.position.x)*.035;camera.position.y+=(.2+mouse.y*.22+(Math.random()-.5)*shake*.04-camera.position.y)*.035;camera.lookAt(0,0,0);renderer.render(scene,camera)}requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});animate(performance.now());
