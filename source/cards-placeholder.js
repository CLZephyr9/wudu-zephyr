(()=>{
 const dialog=document.getElementById('cardsDialog'),theme=document.getElementById('cardsTheme'),back=document.getElementById('cardsReturn'),entry=document.querySelector('[data-panel="卡类"]');let savedScroll=0,oldOverflow='';
 entry.removeAttribute('aria-disabled');entry.setAttribute('aria-haspopup','dialog');entry.setAttribute('aria-controls','cardsDialog');
 function syncTheme(){theme.textContent=stage.classList.contains('day')?'☼':'☾'}
 entry.addEventListener('click',()=>{savedScroll=profilePage.scrollTop;oldOverflow=profilePage.style.overflowY;profilePage.style.overflowY='hidden';dialog.showModal();syncTheme();back.focus({preventScroll:true})});
 back.addEventListener('click',()=>dialog.close());dialog.addEventListener('cancel',event=>{event.preventDefault();dialog.close()});dialog.addEventListener('close',()=>{profilePage.style.overflowY=oldOverflow;profilePage.scrollTop=savedScroll;entry.focus({preventScroll:true});requestAnimationFrame(()=>profilePage.scrollTop=savedScroll)});
 theme.addEventListener('click',()=>{manualTheme=true;setTheme(!stage.classList.contains('day'));syncTheme()});
 dialog.querySelectorAll('.cards-clock-touch').forEach(clock=>{let angle=0;clock.addEventListener('click',()=>{const hand=clock.querySelector('.cards-clock-hand'),from=angle;angle+=360;hand.getAnimations().forEach(animation=>animation.cancel());hand.animate([{transform:`rotate(${from}deg)`},{transform:`rotate(${angle}deg)`}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:1600,easing:'cubic-bezier(.2,.6,.25,1)',fill:'forwards'});clock.dataset.turns=String(angle/360)})});
})();
