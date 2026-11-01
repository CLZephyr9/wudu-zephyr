'use strict';
const stage=document.getElementById('stage'),form=document.getElementById('nameForm'),input=document.getElementById('visitorName'),next=document.getElementById('continue'),scene=document.getElementById('waterScene');
const copy=document.getElementById('waterCopy'),choices=document.getElementById('choices'),hint=document.getElementById('touchHint');
const systemTheme=matchMedia('(prefers-color-scheme: dark)');
let manualTheme=false,confirmed=false,busy=false,visitorName='',waterStep='intro',typing=false,typeTimer=0;
const texts={intro:'你缓缓睁开眼，周遭是漫开的冷水。视线往下，望见一道身影正朝着水底沉去，她面容苍白，双目紧闭',grab:'她睁开了眼，眼尾泛着一点冷白，雾灰的瞳色很浅，空空的，如同死水',leave:'你懒得管她，回身向岸上游去，却仿佛感觉到有什么阻力拽着你的手腕往回拉，你一回头，对上一片死寂无波的眸子'};
function setTheme(day){stage.classList.toggle('day',day);document.getElementById('themeSymbol').textContent=day?'☼':'☾'}
setTheme(!systemTheme.matches);
systemTheme.addEventListener('change',e=>{if(!manualTheme)setTheme(!e.matches)});
document.getElementById('theme').addEventListener('click',()=>{manualTheme=true;setTheme(!stage.classList.contains('day'))});
for(let i=0;i<27;i++){const flake=new Image();flake.src='__SNOW__';flake.alt='';flake.style.cssText=`left:${(i*37.73)%100}%;width:${3+i%5}px;animation-duration:${16+i%13}s;animation-delay:-${i*1.71}s;opacity:${.18+(i%5)*.055}`;document.getElementById('snow').append(flake)}

// Start on the first user interaction; a single source continues across both pages.
let audioContext,ambienceSource,ambienceGain,audioLoading=false;
async function startWaterAudio(){
 if(['profile','ending-preview','ending'].includes(stage.dataset.scene))return;
 if(audioContext?.state==='suspended')audioContext.resume().catch(()=>{});
 if(ambienceSource||audioLoading)return;
 const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
 audioContext??=new Audio();audioContext.resume().catch(()=>{});audioLoading=true;
 try{
  const raw=Uint8Array.from(atob('__AUDIO_BASE64__'),c=>c.charCodeAt(0));
  const buffer=await audioContext.decodeAudioData(raw.buffer);
  ambienceSource=audioContext.createBufferSource();ambienceSource.buffer=buffer;ambienceSource.loop=true;
  ambienceGain=audioContext.createGain();ambienceGain.gain.setValueAtTime(0,audioContext.currentTime);ambienceGain.gain.linearRampToValueAtTime(.5,audioContext.currentTime+2.4);
  ambienceSource.connect(ambienceGain).connect(audioContext.destination);ambienceSource.start();stage.dataset.audio='playing';
 }catch{stage.dataset.audio='unavailable'}finally{audioLoading=false}
}
document.addEventListener('pointerdown',startWaterAudio,{passive:true});
document.addEventListener('keydown',startWaterAudio);
function waterDrop(){
 if(!audioContext||audioContext.state!=='running')return;
 const now=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain();
 osc.type='sine';osc.frequency.setValueAtTime(1050,now);osc.frequency.exponentialRampToValueAtTime(340,now+.105);
 gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.055,now+.009);gain.gain.exponentialRampToValueAtTime(.0001,now+.22);
 osc.connect(gain).connect(audioContext.destination);osc.start(now);osc.stop(now+.24);osc.onended=()=>{osc.disconnect();gain.disconnect()};
}

form.addEventListener('submit',event=>{event.preventDefault();if(confirmed||!input.value.trim())return;startWaterAudio();confirmed=true;visitorName=input.value.trim();input.readOnly=true;input.blur();form.classList.add('confirmed');setTimeout(()=>{input.hidden=true;next.hidden=false;requestAnimationFrame(()=>next.classList.add('ready'))},550)});
document.addEventListener('click',event=>{
 if(confirmed||busy||document.getElementById('opening').hidden||event.target===input||!input.value.trim())return;
 form.requestSubmit();
});
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
function blurTransition(duration){return new Promise(resolve=>{let start;const opening=document.getElementById('opening');scene.style.visibility='visible';scene.style.opacity='0';scene.style.filter='blur(22px)';scene.classList.add('visible');opening.style.willChange='filter,opacity';scene.style.willChange='filter,opacity';function frame(now){start??=now;const t=Math.min(1,(now-start)/duration),outgoing=ease(Math.min(1,t/.72)),incoming=ease(Math.max(0,Math.min(1,(t-.25)/.75)));opening.style.filter=`blur(${outgoing*20}px)`;opening.style.opacity=String(1-outgoing);scene.style.opacity=String(incoming);scene.style.filter=`blur(${(1-incoming)*22}px)`;if(t<1)requestAnimationFrame(frame);else{opening.hidden=true;opening.style.willChange='auto';scene.style.filter='none';scene.style.opacity='1';scene.style.willChange='auto';resolve()}}requestAnimationFrame(frame)})}
function typeText(text){
 clearTimeout(typeTimer);copy.textContent='';typing=true;scene.dataset.typing='true';hint.hidden=true;
 const characters=Array.from(text);let index=0;
 function append(){
  copy.textContent+=characters[index++];
  if(index<characters.length){const punctuation='，。！？；'.includes(characters[index-1]);typeTimer=setTimeout(append,punctuation?115:36)}
  else{typing=false;scene.dataset.typing='false';copy.setAttribute('aria-label',text);hint.hidden=false}
 }
 append();
}
next.addEventListener('click',async()=>{if(busy||!confirmed)return;startWaterAudio();waterDrop();busy=true;next.disabled=true;document.getElementById('theme').disabled=true;await blurTransition(2200);document.getElementById('theme').disabled=false;stage.dataset.scene='water';busy=false;typeText(texts.intro)});

function touchRipple(event){
 if(stage.dataset.scene!=='water')return;
 const bounds=stage.getBoundingClientRect(),ripple=document.createElement('span');ripple.className='touch-ripple';
 ripple.style.left=`${event.clientX-bounds.left}px`;ripple.style.top=`${event.clientY-bounds.top}px`;
 for(let i=0;i<3;i++)ripple.append(document.createElement('i'));
 const layer=document.getElementById('touchRipples');while(layer.children.length>=10)layer.firstElementChild.remove();layer.append(ripple);
 setTimeout(()=>ripple.remove(),1900);waterDrop();
}
stage.addEventListener('pointerdown',touchRipple,{passive:true});
async function showBranch(key){
 busy=true;hint.hidden=true;choices.classList.add('fading');copy.classList.add('fading');choices.querySelectorAll('button').forEach(b=>b.disabled=true);
 await new Promise(resolve=>setTimeout(resolve,420));choices.hidden=true;copy.textContent='';copy.classList.remove('fading');waterStep='branch';scene.dataset.branch=key;typeText(texts[key]);busy=false;
}
scene.addEventListener('click',event=>{
 if(busy||typing||stage.dataset.scene!=='water')return;
 const choice=event.target.closest('[data-choice]');
 if(choice&&waterStep==='choices'){showBranch(choice.dataset.choice);return}
 if(waterStep==='intro'){waterStep='choices';hint.hidden=true;choices.hidden=false;return}
 if(waterStep==='branch'){
  // The profile page will be authored with the user in the next step.
  scene.dataset.next='profile';stage.dispatchEvent(new CustomEvent('profile-requested',{detail:{visitorName}}));
 }
});
