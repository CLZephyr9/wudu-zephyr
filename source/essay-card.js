(()=>{
 const essays=__ESSAY_CONTENT_JSON__,dialog=document.getElementById('essayDialog'),body=document.getElementById('essayBody'),text=document.getElementById('essayText'),previous=document.getElementById('essayPrevious'),next=document.getElementById('essayNext'),theme=document.getElementById('essayTheme'),entry=document.querySelector('[data-panel="随笔"]');let page=0,savedScroll=0,oldOverflow='';
 entry.removeAttribute('aria-disabled');entry.setAttribute('aria-haspopup','dialog');entry.setAttribute('aria-controls','essayDialog');
 function syncTheme(){theme.textContent=stage.classList.contains('day')?'☼':'☾'}
 function fit(){if(!dialog.open)return;dialog.style.setProperty('--essay-size',innerWidth<=350?'16px':'17px')}
 function render(){text.textContent=essays[page];document.getElementById('essayNumber').textContent=`${page+1} / ${essays.length}`;previous.disabled=page===0;next.disabled=page===essays.length-1;dialog.dataset.page=String(page+1);fit();body.scrollTop=0;text.classList.remove('essay-enter');void text.offsetWidth;text.classList.add('essay-enter')}
 entry.addEventListener('click',()=>{savedScroll=profilePage.scrollTop;oldOverflow=profilePage.style.overflowY;profilePage.style.overflowY='hidden';page=0;dialog.showModal();render();syncTheme();document.getElementById('essayReturn').focus({preventScroll:true})});
 previous.addEventListener('click',()=>{if(page>0){page--;render()}});next.addEventListener('click',()=>{if(page<essays.length-1){page++;render()}});
 document.getElementById('essayReturn').addEventListener('click',()=>dialog.close());dialog.addEventListener('cancel',event=>{event.preventDefault();dialog.close()});dialog.addEventListener('close',()=>{profilePage.style.overflowY=oldOverflow;profilePage.scrollTop=savedScroll;entry.focus({preventScroll:true});requestAnimationFrame(()=>profilePage.scrollTop=savedScroll)});
 theme.addEventListener('click',()=>{manualTheme=true;setTheme(!stage.classList.contains('day'));syncTheme()});window.addEventListener('resize',()=>requestAnimationFrame(fit));document.fonts.ready.then(fit);
})();

