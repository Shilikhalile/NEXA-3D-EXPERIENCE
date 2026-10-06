(() => {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  const rail = [...document.querySelectorAll('.rail-line')];
  const sceneNames = ['CORE','GALAXY','DNA','ENERGY','ENTITY','WORLD','FINAL'];
  const root = document.documentElement;
  let last = '';
  document.getElementById('enterButton')?.addEventListener('click', () => {
    const hint = document.getElementById('mobileHint');
    if (hint) hint.textContent = 'SWIPE TO NEXT SCENE';
  });
  addEventListener('pointermove', e => {
    const x = e.clientX / innerWidth, y = e.clientY / innerHeight;
    root.style.setProperty('--mx', `${x * 100}%`);
    root.style.setProperty('--my', `${y * 100}%`);
    glow.style.transform = `translate3d(${e.clientX - 115}px,${e.clientY - 115}px,0)`;
    const info = document.querySelector('.scene-info');
    if (info && innerWidth > 700) info.style.transform = `translateY(-50%) perspective(800px) rotateY(${(x-.5)*-3}deg) rotateX(${(y-.5)*2}deg)`;
  }, { passive: true });
  const sync = () => {
    const num = document.querySelector('.scene-number')?.textContent || '01 / 07';
    const n = Math.max(0, Math.min(6, parseInt(num, 10) - 1));
    const key = `${n}-${num}`;
    if (key === last) return;
    last = key;
    rail.forEach((el, i) => el.classList.toggle('active', i === n));
    document.body.dataset.scene = sceneNames[n];
    document.querySelector('.scene-rail')?.setAttribute('data-label', sceneNames[n]);
    document.querySelector('.scene-info')?.classList.remove('scene-refresh');
    requestAnimationFrame(() => document.querySelector('.scene-info')?.classList.add('scene-refresh'));
  };
  new MutationObserver(sync).observe(document.querySelector('.scene-number'), { childList: true, characterData: true, subtree: true });
  sync();
})();
