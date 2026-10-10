const images=[
  'assets/hub_01_command.jpg','assets/hub_02_vision.jpg','assets/hub_03_voice.jpg',
  'assets/hub_04_build.jpg','assets/hub_05_automate.jpg','assets/hub_06_ecosystem.jpg','assets/hub_07_reveal.jpg'
];
const img=document.getElementById('hubImage'), intro=document.getElementById('intro'), enter=document.getElementById('enterButton'), gesture=document.querySelector('.gesture');
let current=0, ready=false, pointer=null, wheelEnergy=0, wheelTimer=null, changing=false;
function load(index,direction=1){if(index<0||index>=images.length||index===current||changing)return;changing=true;const next=new Image();next.onload=()=>{img.classList.remove('loaded');setTimeout(()=>{img.src=images[index];img.onload=()=>img.classList.add('loaded');current=index;changing=false},180)};next.src=images[index]}
function advance(direction){load(current+direction,direction)}
addEventListener('pointermove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;document.documentElement.style.setProperty('--x',`${x*3.2}deg`);document.documentElement.style.setProperty('--y',`${-y*2.2}deg`);document.documentElement.style.setProperty('--mx',`${e.clientX/innerWidth*100}%`);document.documentElement.style.setProperty('--my',`${e.clientY/innerHeight*100}%`)});
addEventListener('pointerdown',e=>{pointer={x:e.clientX,y:e.clientY,time:performance.now()}});
addEventListener('pointerup',e=>{if(!pointer)return;const dy=e.clientY-pointer.y,dx=e.clientX-pointer.x,force=Math.max(Math.abs(dx),Math.abs(dy));if(force>135&&Math.abs(dy)>Math.abs(dx)){advance(dy<0?1:-1)}pointer=null});
addEventListener('wheel',e=>{if(!ready)return;wheelEnergy+=e.deltaY;clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>wheelEnergy=0,420);if(Math.abs(wheelEnergy)>=680){const dir=wheelEnergy>0?1:-1;wheelEnergy=0;advance(dir)}},{passive:true});
addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowRight')advance(1);if(e.key==='ArrowUp'||e.key==='ArrowLeft')advance(-1)});
enter.addEventListener('click',()=>{ready=true;intro.classList.add('hidden');gesture.classList.add('show');img.classList.add('loaded')});
img.onload=()=>img.classList.add('loaded');img.src=images[0];
