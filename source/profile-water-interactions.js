(()=>{
 const surface=document.getElementById('constellationSurface'),canvas=document.getElementById('styleMist'),ctx=canvas.getContext('2d');
 const mask=document.createElement('canvas');const maskCtx=mask.getContext('2d');
 const edge=document.createElement('canvas'),edgeCtx=edge.getContext('2d');
 const waveTexture=new Image();waveTexture.src='__REAL_RIPPLE__';
 let width=0,height=0,ratio=1,wiping=false,lastPoint=null,lastRipple=0,lastSound=0,hasMask=false;
 function dayActive(){return stage.dataset.scene==='profile'&&stage.classList.contains('day')}
 function resizeMist(){
  const w=surface.clientWidth+24,h=surface.clientHeight+24;if(!surface.clientWidth||!surface.clientHeight)return;
  const previous=document.createElement('canvas');previous.width=hasMask?mask.width:0;previous.height=hasMask?mask.height:0;if(hasMask)previous.getContext('2d').drawImage(mask,0,0);
  width=w;height=h;ratio=Math.min(devicePixelRatio||1,2);canvas.width=mask.width=edge.width=Math.round(w*ratio);canvas.height=mask.height=edge.height=Math.round(h*ratio);
  maskCtx.setTransform(1,0,0,1,0,0);maskCtx.fillStyle='#fff';maskCtx.fillRect(0,0,mask.width,mask.height);
  if(previous.width){maskCtx.globalCompositeOperation='destination-in';maskCtx.drawImage(previous,0,0,mask.width,mask.height);maskCtx.globalCompositeOperation='source-over'}
  edgeCtx.setTransform(ratio,0,0,ratio,0,0);edgeCtx.clearRect(0,0,w,h);
  const points=[];
  for(let x=12;x<w-12;x+=10)points.push({x,y:5+Math.sin(x*.13)*2.5+Math.cos(x*.037)*2});
  for(let y=12;y<h-12;y+=10)points.push({x:w-5+Math.sin(y*.11)*2.6,y});
  for(let x=w-12;x>12;x-=10)points.push({x,y:h-5+Math.sin(x*.095)*2.8});
  for(let y=h-12;y>12;y-=10)points.push({x:5+Math.sin(y*.083)*2.8,y});
  const first=points[0],last=points[points.length-1];edgeCtx.beginPath();edgeCtx.moveTo((first.x+last.x)/2,(first.y+last.y)/2);
  points.forEach((point,i)=>{const next=points[(i+1)%points.length];edgeCtx.quadraticCurveTo(point.x,point.y,(point.x+next.x)/2,(point.y+next.y)/2)});edgeCtx.closePath();edgeCtx.fillStyle='#fff';edgeCtx.filter='blur(.7px)';edgeCtx.fill();edgeCtx.filter='none';
  maskCtx.setTransform(ratio,0,0,ratio,0,0);hasMask=true;paintMist();
 }
 function paintMist(){
  if(!width||!height)return;
  ctx.setTransform(ratio,0,0,ratio,0,0);ctx.globalCompositeOperation='source-over';ctx.fillStyle='#dce5eb';ctx.fillRect(0,0,width,height);
  const phase=motionPreference.matches?0:performance.now()/12000;
  for(let i=0;i<15;i++){
   const x=width*((i*.389)%1)+Math.sin(phase+i)*9,y=height*((i*.617)%1)+Math.cos(phase*.8+i)*8,radius=60+(i%4)*20;
   const cloud=ctx.createRadialGradient(x,y,0,x,y,radius);cloud.addColorStop(0,i%2?'#ffffffba':'#b8cbd67a');cloud.addColorStop(1,'#ffffff00');ctx.fillStyle=cloud;ctx.fillRect(x-radius,y-radius,radius*2,radius*2);
  }
  ctx.globalCompositeOperation='destination-in';ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(mask,0,0);ctx.drawImage(edge,0,0);ctx.globalCompositeOperation='source-over';
 }
 function eraseAt(x,y){
  const radius=34;maskCtx.globalCompositeOperation='destination-out';
  const brush=maskCtx.createRadialGradient(x,y,radius*.65,x,y,radius);brush.addColorStop(0,'#000');brush.addColorStop(1,'#0000');maskCtx.fillStyle=brush;maskCtx.fillRect(x-radius,y-radius,radius*2,radius*2);maskCtx.globalCompositeOperation='source-over';
 }
 function wipe(event){
  const box=canvas.getBoundingClientRect(),point={x:event.clientX-box.left,y:event.clientY-box.top};
  if(lastPoint){const distance=Math.hypot(point.x-lastPoint.x,point.y-lastPoint.y),steps=Math.max(1,Math.ceil(distance/8));for(let i=1;i<=steps;i++)eraseAt(lastPoint.x+(point.x-lastPoint.x)*i/steps,lastPoint.y+(point.y-lastPoint.y)*i/steps)}else eraseAt(point.x,point.y);
  lastPoint=point;surface.classList.add('mist-touched');canvas.dataset.wiped='true';paintMist();
 }
 canvas.addEventListener('pointerdown',event=>{if(!dayActive())return;wiping=true;lastPoint=null;canvas.setPointerCapture(event.pointerId);wipe(event)});
 canvas.addEventListener('pointermove',event=>{if(wiping&&dayActive())wipe(event)});
 const end=()=>{wiping=false;lastPoint=null};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
 canvas.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();maskCtx.clearRect(0,0,width,height);surface.classList.add('mist-touched');canvas.dataset.wiped='true';paintMist()}});
 new ResizeObserver(resizeMist).observe(surface);
 new MutationObserver(()=>{if(dayActive())requestAnimationFrame(paintMist)}).observe(stage,{attributes:true,attributeFilter:['class','data-scene']});
 setInterval(()=>{if(!dayActive()||document.hidden||motionPreference.matches)return;const box=canvas.getBoundingClientRect();if(box.bottom>0&&box.top<innerHeight)paintMist()},140);
 resizeMist();

 let dropBuffer=null,dropLoading=null;
 async function waveSound(drag){
  if(drag)return;
  const encoded='__RIPPLE_AUDIO_BASE64__';if(!encoded){profilePage.dataset.waterSound='pending-file';return}
  const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
  audioContext??=new Audio();if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
  try{
   if(!dropBuffer){dropLoading??=audioContext.decodeAudioData(Uint8Array.from(atob(encoded),c=>c.charCodeAt(0)).buffer);dropBuffer=await dropLoading}
   const source=audioContext.createBufferSource(),gain=audioContext.createGain();source.buffer=dropBuffer;gain.gain.value=.6;source.connect(gain).connect(audioContext.destination);source.start();source.onended=()=>{source.disconnect();gain.disconnect()};profilePage.dataset.waterSound='ready';
  }catch{profilePage.dataset.waterSound='unavailable'}
 }
 function propagateWave(ripple,drag){
  const size=drag?108:136,pixelRatio=Math.min(devicePixelRatio||1,2),drawing=document.createElement('canvas'),waveMask=document.createElement('canvas');
  drawing.width=waveMask.width=Math.round(size*pixelRatio);drawing.height=waveMask.height=drawing.width;ripple.style.setProperty('--wave-size',`${size}px`);ripple.append(drawing);
  const draw=drawing.getContext('2d'),maskDraw=waveMask.getContext('2d');let started;
  function frame(now){
   if(!ripple.isConnected)return;started??=now;const progress=(now-started)/1450;
   if(progress>=1){ripple.remove();return}
   const center=size/2,front=progress*size*.51;
   maskDraw.setTransform(pixelRatio,0,0,pixelRatio,0,0);maskDraw.clearRect(0,0,size,size);
   const rings=[];
   for(let i=0;i<5;i++){
    const radius=front-i*9;if(radius<2||radius>size*.49)continue;
    const strength=(1-progress)*Math.exp(-i*.25);rings.push({radius,strength});
    maskDraw.beginPath();maskDraw.ellipse(center,center,radius,radius*.79,0,0,Math.PI*2);maskDraw.strokeStyle=`rgba(255,255,255,${strength})`;maskDraw.lineWidth=3.5;maskDraw.stroke();
   }
   draw.setTransform(pixelRatio,0,0,pixelRatio,0,0);draw.globalCompositeOperation='source-over';draw.clearRect(0,0,size,size);
   if(waveTexture.complete&&waveTexture.naturalWidth)draw.drawImage(waveTexture,0,0,size,size);
   draw.globalCompositeOperation='destination-in';draw.setTransform(1,0,0,1,0,0);draw.drawImage(waveMask,0,0);draw.globalCompositeOperation='source-over';draw.setTransform(pixelRatio,0,0,pixelRatio,0,0);
   const day=stage.classList.contains('day');
   for(const ring of rings){
    draw.beginPath();draw.ellipse(center,center,ring.radius,ring.radius*.79,0,0,Math.PI*2);draw.strokeStyle=day?`rgba(85,112,129,${ring.strength*.25})`:`rgba(218,231,236,${ring.strength*.3})`;draw.lineWidth=.65;draw.stroke();
    draw.beginPath();draw.ellipse(center,center+1.2,ring.radius,ring.radius*.79,0,0,Math.PI*2);draw.strokeStyle=day?`rgba(255,255,255,${ring.strength*.6})`:`rgba(0,0,0,${ring.strength*.3})`;draw.lineWidth=.8;draw.stroke();
   }
   drawing.dataset.phase=String(Math.round(progress*100));requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
 }
 function rippleAt(event,drag=false){
  if(stage.dataset.scene!=='profile'||event.target.closest?.('.constellation-surface,dialog[open]'))return;
  const now=performance.now();if(drag&&now-lastRipple<170)return;lastRipple=now;
  const bounds=stage.getBoundingClientRect(),ripple=document.createElement('span');ripple.className='profile-interaction-ripple';ripple.style.left=`${event.clientX-bounds.left}px`;ripple.style.top=`${event.clientY-bounds.top}px`;
  const layer=document.getElementById('touchRipples');while(layer.children.length>=9)layer.firstElementChild.remove();layer.append(ripple);setTimeout(()=>ripple.remove(),1550);
  propagateWave(ripple,drag);
  if(now-lastSound>(drag?180:65)){lastSound=now;waveSound(drag)}
 }
 let pointerActive=false;
 stage.addEventListener('pointerdown',event=>{if(stage.dataset.scene!=='profile'||event.target.closest?.('.constellation-surface,dialog[open]')){pointerActive=false;return}pointerActive=true;rippleAt(event)},{passive:true});
 stage.addEventListener('pointermove',event=>{if(pointerActive)rippleAt(event,true)},{passive:true});
 window.addEventListener('pointerup',()=>pointerActive=false,{passive:true});window.addEventListener('pointercancel',()=>pointerActive=false,{passive:true});
})();
