(() => {
  const glow = document.createElement('div'); glow.className = 'cursor-glow'; document.body.appendChild(glow);
  const rail = [...document.querySelectorAll('.rail-line')];
  const sceneNames = ['SIGNAL','INPUT','UNDERSTANDING','CORE','CREATION','SPACE','FINAL'];
  const imagePaths = sceneNames.map((_, i) => `assets/scene_0${i + 1}_${['signal','input','understanding','core','creation','space','final'][i]}.jpg`);
  const root = document.documentElement, image = document.getElementById('sceneImage'), visual = document.getElementById('sceneVisual');
  let last = '';
  document.getElementById('enterButton')?.addEventListener('click', () => {
    const hint = document.getElementById('mobileHint'); if (hint) hint.textContent = 'MOVE TO EXPLORE  ·  SWIPE TO ADVANCE';
    visual?.classList.add('ready');
  });
  addEventListener('pointermove', e => {
    const x = e.clientX / innerWidth, y = e.clientY / innerHeight;
    root.style.setProperty('--mx', `${x * 100}%`); root.style.setProperty('--my', `${y * 100}%`);
    glow.style.transform = `translate3d(${e.clientX - 115}px,${e.clientY - 115}px,0)`;
    const info = document.querySelector('.scene-info');
    if (info && innerWidth > 700) info.style.transform = `translateY(-50%) perspective(800px) rotateY(${(x-.5)*-3}deg) rotateX(${(y-.5)*2}deg)`;
  }, { passive: true });
  const sync = () => {
    const num = document.querySelector('.scene-number')?.textContent || '01 / 07';
    const n = Math.max(0, Math.min(6, parseInt(num, 10) - 1)); const key = `${n}-${num}`;
    if (key === last) return; last = key;
    rail.forEach((el, i) => el.classList.toggle('active', i === n));
    document.body.dataset.scene = sceneNames[n]; document.querySelector('.scene-rail')?.setAttribute('data-label', sceneNames[n]);
    document.querySelector('.scene-info')?.classList.remove('scene-refresh'); requestAnimationFrame(() => document.querySelector('.scene-info')?.classList.add('scene-refresh'));
    if (image && image.src !== new URL(imagePaths[n], location.href).href) { visual?.classList.remove('image-in'); image.onload = () => { visual?.classList.add('image-in'); }; image.src = imagePaths[n]; }
  };
  new MutationObserver(sync).observe(document.querySelector('.scene-number'), { childList: true, characterData: true, subtree: true }); sync();
})();
