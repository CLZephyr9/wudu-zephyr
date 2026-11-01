(()=>{
 const butterflies=document.querySelector('.archive-butterflies'),camera=document.getElementById('cameraGlint');let lastAwake=-10000;
 function awaken(){
  if(motionPreference.matches||performance.now()-lastAwake<7500)return;
  lastAwake=performance.now();butterflies.classList.remove('is-awake');requestAnimationFrame(()=>butterflies.classList.add('is-awake'));setTimeout(()=>butterflies.classList.remove('is-awake'),3200);
 }
 if('IntersectionObserver'in window){new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting&&stage.dataset.scene==='profile')awaken()},{root:profilePage,threshold:.22}).observe(butterflies)}
 camera.addEventListener('click',()=>{if(stage.classList.contains('day')||motionPreference.matches)return;camera.classList.remove('is-pulsing');void camera.offsetWidth;camera.classList.add('is-pulsing');setTimeout(()=>camera.classList.remove('is-pulsing'),1100)});
 const dust=document.createElement('div');dust.className='profile-night-dust';dust.id='profileNightDust';dust.setAttribute('aria-hidden','true');
 for(let i=0;i<20;i++){
  const particle=document.createElement('i'),size=i%6===0?5:1.3+(i%4)*.45;
  particle.style.cssText=`--dust-x:${(i*37.37+8)%100}%;--dust-size:${size}px;--dust-blur:${size>4?1.7:.25}px;--dust-opacity:${size>4?.09:.14+(i%3)*.045};--dust-time:${20+i%13}s;--dust-delay:-${(i*3.7)%30}s;--dust-sway:${(i%2?1:-1)*(12+i%4*8)}px`;
  dust.append(particle);
 }
 stage.append(dust);
})();
