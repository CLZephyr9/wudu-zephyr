const profilePage=document.getElementById('profilePage');
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const nightSelection=new Set();
let profileMotionReady=false,parallaxFrame=0;
const styleButtons=Array.from(document.querySelectorAll('.style-tag'));
function drawConstellation(){
 const surface=document.getElementById('constellationSurface'),svg=document.getElementById('constellationLines');
 const bounds=surface.getBoundingClientRect();svg.replaceChildren();
 if(!bounds.width||!bounds.height)return;
 svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
 if(stage.classList.contains('day'))return;
 const points=Array.from(nightSelection,button=>{
  let x=button.offsetLeft+button.offsetWidth/2,y=button.offsetTop+button.offsetHeight-7,parent=button.offsetParent;
  while(parent&&parent!==surface){x+=parent.offsetLeft;y+=parent.offsetTop;parent=parent.offsetParent}
  return{x,y};
 });
 const namespace='http://www.w3.org/2000/svg';
 if(points.length>1){const path=document.createElementNS(namespace,'path');path.setAttribute('pathLength','1');path.setAttribute('d',points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' '));svg.append(path)}
 for(const p of points){const circle=document.createElementNS(namespace,'circle');circle.setAttribute('cx',p.x);circle.setAttribute('cy',p.y);circle.setAttribute('r','1.8');svg.append(circle)}
}
function syncStyleTheme(){
 const day=stage.classList.contains('day');
 for(const button of styleButtons){button.setAttribute('aria-pressed',String(!day&&nightSelection.has(button)))}
 requestAnimationFrame(drawConstellation);
}
for(const button of styleButtons){
 button.addEventListener('click',()=>{
  if(!stage.classList.contains('day')){
   if(nightSelection.has(button)){nightSelection.delete(button);button.classList.remove('is-selected')}
   else{nightSelection.add(button);button.classList.add('is-selected')}
   button.setAttribute('aria-pressed',String(nightSelection.has(button)));drawConstellation();
  }
 });
}
new MutationObserver(syncStyleTheme).observe(stage,{attributes:true,attributeFilter:['class']});
new ResizeObserver(()=>requestAnimationFrame(drawConstellation)).observe(document.getElementById('constellationSurface'));
function updateParallax(){
 parallaxFrame=0;const y=profilePage.scrollTop;
 if(motionPreference.matches)return;
 profilePage.style.setProperty('--portrait-drift',`${Math.min(18,y*.075)}px`);
 profilePage.style.setProperty('--ice-drift',`${Math.min(20,y*.035)}px`);
 profilePage.style.setProperty('--butterfly-drift',`${Math.min(32,y*.055)}px`);
 profilePage.style.setProperty('--flower-drift',`${Math.min(18,y*.025)}px`);
}
profilePage.addEventListener('scroll',()=>{if(!parallaxFrame)parallaxFrame=requestAnimationFrame(updateParallax)},{passive:true});
function initializeProfileMotion(){
 if(profileMotionReady)return;profileMotionReady=true;
 const targets=profilePage.querySelectorAll('.profile-section>h2,.attributes,.style-block,.models-section>p,.profile-quote,.profile-grid>button');
 targets.forEach((element,index)=>{element.classList.add('reveal-item');element.style.setProperty('--reveal-delay',`${element.closest('.profile-grid')?(index%2)*65:0}ms`)});
 if(!motionPreference.matches&&'IntersectionObserver'in window){
  profilePage.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target)}},{root:profilePage,threshold:.08,rootMargin:'0px 0px -12px 0px'});
  targets.forEach(element=>observer.observe(element));
 }else{targets.forEach(element=>element.classList.add('is-revealed'))}
 updateParallax();syncStyleTheme();
}
async function enterProfile(immediate=false){
 if(stage.dataset.scene==='profile'||stage.dataset.scene==='profile-transition')return;
 busy=true;clearTimeout(typeTimer);typing=false;
 if(!immediate)startProfileMusic();
 if(ambienceGain&&audioContext){ambienceGain.gain.cancelScheduledValues(audioContext.currentTime);ambienceGain.gain.setValueAtTime(ambienceGain.gain.value,audioContext.currentTime);ambienceGain.gain.linearRampToValueAtTime(0,audioContext.currentTime+.7)}
 const animate=!immediate&&!motionPreference.matches,themeButton=document.getElementById('theme');let veil;
 if(animate){
  stage.dataset.scene='profile-transition';themeButton.disabled=true;hint.hidden=true;
  veil=document.createElement('div');veil.className='profile-transition-veil';veil.setAttribute('aria-hidden','true');stage.append(veil);
  const out=scene.animate([{filter:'blur(0px)',opacity:1},{filter:'blur(24px)',opacity:0}],{duration:1100,easing:'ease-in',fill:'forwards'});
  await veil.animate([{opacity:0},{opacity:1}],{duration:1100,easing:'ease-in',fill:'forwards'}).finished;
  scene.style.visibility='hidden';out.cancel();
  await new Promise(resolve=>setTimeout(resolve,200));
 }
 stage.dataset.scene='profile';document.getElementById('opening').hidden=true;scene.style.visibility='hidden';hint.hidden=true;profilePage.hidden=false;profilePage.scrollTop=0;
 profilePage.style.transition='none';profilePage.classList.add('visible');initializeProfileMotion();
 if(animate){
  const reveal=profilePage.animate([{filter:'blur(24px)',opacity:0},{filter:'blur(0px)',opacity:1}],{duration:2000,easing:'cubic-bezier(.2,.5,.3,1)'});
  await veil.animate([{opacity:1},{opacity:0}],{duration:2000,easing:'ease-out',fill:'forwards'}).finished;
  await reveal.finished;veil.remove();
 }
 themeButton.disabled=false;busy=false;
}
stage.addEventListener('profile-requested',()=>enterProfile());
if(location.hash==='#profile')enterProfile(true);
