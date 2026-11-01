(()=>{
 const images=__REVIEW_IMAGES_JSON__,groups=[[0,2,1],[3,4,5]],dialog=document.getElementById('reviewDialog'),viewer=document.getElementById('reviewViewer'),thumbnails=document.getElementById('reviewThumbnails'),previous=document.getElementById('reviewPrevious'),next=document.getElementById('reviewNext'),counter=document.getElementById('reviewPageNumber'),theme=document.getElementById('reviewTheme'),entry=document.querySelector('[data-panel="板评"]'),imageStage=document.getElementById('reviewImageStage'),fullImage=document.getElementById('reviewFullImage');
 let page=0,savedScroll=0,oldOverflow='',activeThumbnail=null,scale=1,panX=0,panY=0,dragPoint=null,lastTap=0,pinch=null;const pointers=new Map();
 entry.removeAttribute('aria-disabled');entry.setAttribute('aria-haspopup','dialog');entry.setAttribute('aria-controls','reviewDialog');
 function syncTheme(){theme.textContent=stage.classList.contains('day')?'☼':'☾'}
 function render(){
  thumbnails.replaceChildren();for(const index of groups[page]){const button=document.createElement('button'),image=new Image(),number=document.createElement('small'),icon=document.createElement('span');button.type='button';button.className='review-thumbnail';button.setAttribute('aria-label',`放大板评 ${index+1}`);button.dataset.review=String(index);image.src=images[index].src;image.alt=`板评 ${index+1}`;image.draggable=false;number.textContent=String(index+1).padStart(2,'0');icon.className='review-magnify';icon.setAttribute('aria-hidden','true');button.append(image,number,icon);button.addEventListener('click',()=>openImage(index,button));thumbnails.append(button)}
  previous.disabled=page===0;next.disabled=page===groups.length-1;counter.textContent=`${page+1} / ${groups.length}`;dialog.dataset.page=String(page+1);
 }
 function updateImage(){
  if(!fullImage.naturalWidth)return;
  const viewport=imageStage.getBoundingClientRect(),base=Math.min(viewport.width/fullImage.naturalWidth,viewport.height/fullImage.naturalHeight,1),width=fullImage.naturalWidth*base,height=fullImage.naturalHeight*base;
  fullImage.style.width=`${width}px`;fullImage.style.height=`${height}px`;fullImage.style.maxWidth='none';fullImage.style.maxHeight='none';
  const maxX=Math.max(0,(width*scale-viewport.width)/2),maxY=Math.max(0,(height*scale-viewport.height)/2);panX=Math.max(-maxX,Math.min(maxX,panX));panY=Math.max(-maxY,Math.min(maxY,panY));
  fullImage.style.transform=`translate(calc(-50% + ${panX}px),calc(-50% + ${panY}px)) scale(${scale})`;viewer.dataset.scale=String(scale);
 }
 function reset(){scale=1;panX=0;panY=0;updateImage()}
 function zoom(amount){scale=Math.max(1,Math.min(5,scale*amount));updateImage()}
 function openImage(index,button,sourceImages=images,label='板评'){activeThumbnail=button;scale=1;panX=0;panY=0;lastTap=0;pointers.clear();dragPoint=null;pinch=null;fullImage.alt=`${label} ${index+1}`;fullImage.src=sourceImages[index].src;document.getElementById('reviewImageNumber').textContent=`${index+1} / ${sourceImages.length}`;document.getElementById('reviewImageBack').textContent=`返回${label}`;viewer.setAttribute('aria-label',`${label}大图`);viewer.showModal();document.getElementById('reviewImageBack').focus({preventScroll:true});requestAnimationFrame(()=>{updateImage();if(label==='板评'&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&fullImage.naturalWidth){const from=button.getBoundingClientRect(),to=fullImage.getBoundingClientRect(),dx=from.x+from.width/2-to.x-to.width/2,dy=from.y+from.height/2-to.y-to.height/2,sx=from.width/to.width,sy=from.height/to.height;fullImage.animate([{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(${sx},${sy})`,opacity:.6},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy-18}px)) scale(${sx*1.06},${sy*1.06}) rotate(-2deg)`,opacity:1,offset:.23},{transform:fullImage.style.transform,opacity:1}],{duration:520,easing:'cubic-bezier(.2,.65,.25,1)'});}})}
 stage.addEventListener('gallery-image-request',event=>{const detail=event.detail;if(detail?.images?.length&&detail.index>=0&&detail.index<detail.images.length)openImage(detail.index,detail.invoker,detail.images,detail.label)});
 fullImage.addEventListener('load',updateImage);
 entry.addEventListener('click',()=>{savedScroll=profilePage.scrollTop;oldOverflow=profilePage.style.overflowY;profilePage.style.overflowY='hidden';page=0;dialog.showModal();render();syncTheme();document.getElementById('reviewReturn').focus({preventScroll:true})});
 previous.addEventListener('click',()=>{if(page>0){page--;render()}});next.addEventListener('click',()=>{if(page<groups.length-1){page++;render()}});
 theme.addEventListener('click',()=>{manualTheme=true;setTheme(!stage.classList.contains('day'));syncTheme()});
 document.getElementById('reviewReturn').addEventListener('click',()=>dialog.close());dialog.addEventListener('cancel',event=>{event.preventDefault();dialog.close()});
 dialog.addEventListener('close',()=>{profilePage.style.overflowY=oldOverflow;profilePage.scrollTop=savedScroll;entry.focus({preventScroll:true});requestAnimationFrame(()=>profilePage.scrollTop=savedScroll)});
 document.getElementById('reviewImageBack').addEventListener('click',()=>viewer.close());viewer.addEventListener('cancel',event=>{event.preventDefault();viewer.close()});viewer.addEventListener('close',()=>{pointers.clear();dragPoint=null;pinch=null;activeThumbnail?.focus({preventScroll:true})});
 document.getElementById('reviewZoomIn').addEventListener('click',()=>zoom(1.5));document.getElementById('reviewZoomOut').addEventListener('click',()=>zoom(1/1.5));document.getElementById('reviewZoomReset').addEventListener('click',reset);
 imageStage.addEventListener('pointerdown',event=>{imageStage.setPointerCapture(event.pointerId);pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});dragPoint={x:event.clientX,y:event.clientY,panX,panY};if(pointers.size===2){const [a,b]=Array.from(pointers.values());pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),scale}}});
 imageStage.addEventListener('pointermove',event=>{if(!pointers.has(event.pointerId))return;pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(pointers.size===2&&pinch){const [a,b]=Array.from(pointers.values());scale=Math.max(1,Math.min(5,pinch.scale*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,pinch.distance)));updateImage()}else if(dragPoint&&scale>1){panX=dragPoint.panX+event.clientX-dragPoint.x;panY=dragPoint.panY+event.clientY-dragPoint.y;updateImage()}});
 function finishPointer(event){
  const moved=dragPoint?Math.hypot(event.clientX-dragPoint.x,event.clientY-dragPoint.y):100;
  if(moved<6&&pointers.size===1&&!pinch){const now=performance.now();if(now-lastTap<320){if(scale>1)reset();else zoom(2.5);lastTap=0}else lastTap=now}
  pointers.delete(event.pointerId);pinch=null;dragPoint=null;
 }
 imageStage.addEventListener('pointerup',finishPointer);imageStage.addEventListener('pointercancel',()=>{pointers.clear();pinch=null;dragPoint=null});
 imageStage.addEventListener('wheel',event=>{event.preventDefault();zoom(event.deltaY<0?1.15:1/1.15)},{passive:false});window.addEventListener('resize',()=>{if(viewer.open)updateImage()});
})();
