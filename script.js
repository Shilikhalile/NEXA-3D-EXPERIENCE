/* NEXA — interactive multi-scene experience */
const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);
scene.fog = new THREE.FogExp2(0x050505, 0.035);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 100);
camera.position.set(0, .2, 7);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);

const world = new THREE.Group(); scene.add(world);
scene.add(new THREE.AmbientLight(0xffffff, .35));
const key = new THREE.PointLight(0xffffff, 4, 20); key.position.set(0, 2, 4); scene.add(key);
const blue = new THREE.PointLight(0x8dbdff, 4, 16); blue.position.set(-4, 1, 2); scene.add(blue);

const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
addEventListener('pointermove', e => { mouse.tx = e.clientX / innerWidth * 2 - 1; mouse.ty = -(e.clientY / innerHeight * 2 - 1); });
let dragStart = null, wheelLock = false;
addEventListener('wheel', e => { if (wheelLock) return; wheelLock = true; goTo(current + (e.deltaY > 0 ? 1 : -1)); setTimeout(() => wheelLock = false, 650); }, { passive: true });
addEventListener('pointerdown', e => dragStart = { x: e.clientX, y: e.clientY });
addEventListener('pointerup', e => { if (!dragStart) return; const dy = e.clientY - dragStart.y, dx = e.clientX - dragStart.x; if (Math.abs(dy) > 45 || Math.abs(dx) > 45) goTo(current + (Math.abs(dy) > Math.abs(dx) ? (dy < 0 ? 1 : -1) : (dx < 0 ? 1 : -1))); dragStart = null; });

const particleCount = innerWidth < 700 ? 1100 : 1900;
const pGeo = new THREE.BufferGeometry(), pPos = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) { const a = Math.random() * Math.PI * 2, r = 3 + Math.random() * 7, j = i * 3; pPos[j] = Math.cos(a) * r; pPos[j + 1] = (Math.random() - .5) * 7; pPos[j + 2] = Math.sin(a) * r; }
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xbfdcff, size: .025, transparent: true, opacity: .62, blending: THREE.AdditiveBlending, depthWrite: false }));
world.add(particles);

function wire(geometry, color = 0xeaf4ff, opacity = .85) { return new THREE.LineSegments(new THREE.WireframeGeometry(geometry), new THREE.LineBasicMaterial({ color, transparent: true, opacity })); }
function mesh(geometry, color = 0x9fc9ff, opacity = .08) { return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide })); }
function groupBase() { const g = new THREE.Group(); g.position.y = -.15; return g; }
function igloo() { const g = groupBase(); g.add(wire(new THREE.SphereGeometry(2.1, 28, 18, 0, Math.PI * 2, 0, Math.PI * .55))); g.add(mesh(new THREE.SphereGeometry(2.05, 28, 16, 0, Math.PI * 2, 0, Math.PI * .55))); for (let i=0;i<6;i++){const r=.5+i*.32, ring=new THREE.Mesh(new THREE.RingGeometry(r,r+.01,64),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.28,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=-1.65;g.add(ring);} return g; }
function sphere() { const g=groupBase(); g.add(wire(new THREE.IcosahedronGeometry(2.15, 3))); g.add(mesh(new THREE.IcosahedronGeometry(2.08, 2),0x6da7ff,.05)); return g; }
function torus() { const g=groupBase(); g.add(wire(new THREE.TorusKnotGeometry(1.55,.48,96,16))); g.add(mesh(new THREE.TorusKnotGeometry(1.48,.44,64,12),0x9de1ff,.06)); return g; }
function crystal() { const g=groupBase(); for(let i=0;i<7;i++){const c=wire(new THREE.OctahedronGeometry(.55+Math.random()*.42,1),0xffffff,.75);c.position.set((i-3)*.55,Math.sin(i)*.5,Math.cos(i)*.4);c.rotation.set(i*.4,i*.7,0);g.add(c);} return g; }
function rings() { const g=groupBase(); for(let i=0;i<9;i++){const r=.35+i*.28,q=new THREE.Mesh(new THREE.RingGeometry(r,r+.018,96),new THREE.MeshBasicMaterial({color:i%2?0xffffff:0x8fcaff,transparent:true,opacity:.55,side:THREE.DoubleSide}));q.rotation.x=Math.PI/2;q.rotation.y=i*.22;g.add(q);} return g; }
function cube() { const g=groupBase(); g.add(wire(new THREE.BoxGeometry(3,3,3))); for(let i=0;i<3;i++){const q=wire(new THREE.BoxGeometry(1.3+i*.45,1.3+i*.45,1.3+i*.45),0x9fd8ff,.55);q.rotation.set(i*.4,i*.6,i*.2);g.add(q);} return g; }
function core() { const g=groupBase(); g.add(wire(new THREE.DodecahedronGeometry(1.6,1))); const glow=mesh(new THREE.SphereGeometry(1.18,24,16),0xb9ddff,.12);g.add(glow); for(let i=0;i<4;i++){const q=wire(new THREE.TorusGeometry(2+i*.2,.012,8,96),0xffffff,.45);q.rotation.set(i*.7,i*.45,0);g.add(q);} return g; }

const scenes = [
  ['DIGITAL IGLOO','GEOMETRIC STRUCTURE // INITIALIZATION',igloo],
  ['ORBITAL SPHERE','DATA FIELD // RESPONSIVE SURFACE',sphere],
  ['TORUS KNOT','MOTION LOOP // CONTINUOUS FORM',torus],
  ['CRYSTAL ARRAY','FRAGMENT SYSTEM // MULTI-OBJECT',crystal],
  ['RING FIELD','SPATIAL GRID // DEPTH ACTIVE',rings],
  ['NEXA CUBE','ARCHITECTURE // LAYERED CORE',cube],
  ['THE CORE','SYSTEM COMPLETE // ENTER NEXA',core]
];
let current = 0, object = null, target = 0, transition = 1, last = performance.now();
function setHUD(){ const [name, desc] = scenes[current]; document.querySelector('.scene-number').textContent = `${String(current+1).padStart(2,'0')} / ${String(scenes.length).padStart(2,'0')}`; document.querySelector('.scene-title').textContent=name; document.querySelector('.scene-description').textContent=desc; document.querySelector('.progress').style.width = `${current/(scenes.length-1)*100}%`; }
function goTo(index){ if(index<0||index>=scenes.length||index===current||transition<1)return; current=index; target=index; transition=0; const next=scenes[current][2](); next.scale.set(.05,.05,.05); world.add(next); object && world.remove(object); object=next; setHUD(); document.getElementById('flash').classList.add('active'); setTimeout(()=>document.getElementById('flash').classList.remove('active'),180); }
document.getElementById('enterButton').addEventListener('click',()=>{ document.getElementById('intro').classList.add('hidden'); document.getElementById('hud').classList.add('active'); document.getElementById('mobileHint').textContent='SWIPE OR SCROLL TO EXPLORE'; setHUD(); if(!object){object=scenes[0][2]();world.add(object);} });
setHUD();
function animate(now){ requestAnimationFrame(animate); const dt=Math.min((now-last)/1000,.05); last=now; mouse.x += (mouse.tx-mouse.x)*.06; mouse.y += (mouse.ty-mouse.y)*.06; if(object){ transition=Math.min(1,transition+dt*1.5); const ease=1-Math.pow(1-transition,3); object.scale.lerp(new THREE.Vector3(1,1,1),.12); object.rotation.y += dt*(.2 + Math.abs(mouse.x)*.35); object.rotation.x += (mouse.y*.25-object.rotation.x)*.04; object.position.x += (mouse.x*.45-object.position.x)*.035; object.position.y += (-.15+mouse.y*.25-object.position.y)*.035; } particles.rotation.y += dt*.015; renderer.render(scene,camera); }
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
animate(performance.now());
