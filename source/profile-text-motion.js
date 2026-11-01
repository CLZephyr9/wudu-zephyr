(()=>{
 const walker=document.createTreeWalker(profilePage,NodeFilter.SHOW_TEXT),nodes=[];
 while(walker.nextNode()){
  const node=walker.currentNode;
  if(node.textContent.trim()&&!node.parentElement.closest('[aria-hidden="true"],svg,canvas,script,style'))nodes.push(node);
 }
 for(const node of nodes){const ink=document.createElement('span');ink.className='text-ink';node.replaceWith(ink);ink.append(node)}
 const inks=Array.from(profilePage.querySelectorAll('.text-ink')),animations=new WeakMap();let held=false,lastMove=0;
 function swayNear(event){
  if(stage.dataset.scene!=='profile'||motionPreference.matches)return;
  const candidates=[];
  for(const ink of inks){
   const box=ink.getBoundingClientRect();if(!box.width||!box.height||box.bottom<0||box.top>innerHeight)continue;
   const dx=Math.max(box.left-event.clientX,0,event.clientX-box.right),dy=Math.max(box.top-event.clientY,0,event.clientY-box.bottom),distance=Math.hypot(dx,dy);
   if(distance<=42)candidates.push({ink,box,distance});
  }
  candidates.sort((a,b)=>a.distance-b.distance);
  for(const {ink,box} of candidates.slice(0,3)){
   animations.get(ink)?.cancel();
   const dx=event.clientX-(box.left+box.width/2),dy=event.clientY-(box.top+box.height/2),length=Math.max(1,Math.hypot(dx,dy));
   const x=dx/length*2.5,y=length===1?-1.4:dy/length*1.7,angle=dx/Math.max(18,box.width/2)*1.2,rotation=Math.max(-1.4,Math.min(1.4,angle));
   const animation=ink.animate([
    {transform:'translate(0,0) rotate(0deg)',offset:0},
    {transform:`translate(${x}px,${y}px) rotate(${rotation}deg)`,offset:.22},
    {transform:`translate(${-x*.4}px,${-y*.35}px) rotate(${-rotation*.4}deg)`,offset:.5},
    {transform:`translate(${x*.14}px,${y*.12}px) rotate(${rotation*.15}deg)`,offset:.74},
    {transform:'translate(0,0) rotate(0deg)',offset:1}
   ],{duration:680,easing:'ease-in-out'});
   animations.set(ink,animation);
  }
 }
 stage.addEventListener('pointerdown',event=>{held=true;swayNear(event)},{passive:true});
 stage.addEventListener('pointermove',event=>{if(held&&performance.now()-lastMove>150){lastMove=performance.now();swayNear(event)}},{passive:true});
 window.addEventListener('pointerup',()=>held=false,{passive:true});window.addEventListener('pointercancel',()=>held=false,{passive:true});
})();
