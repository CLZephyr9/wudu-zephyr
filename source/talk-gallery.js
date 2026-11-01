(()=>{
 const images=__TALK_IMAGES_JSON__,dialog=document.getElementById('talkDialog'),entry=document.querySelector('[data-panel="话术"]'),thumbnails=document.getElementById('talkThumbnails'),previous=document.getElementById('talkPrevious'),next=document.getElementById('talkNext'),counter=document.getElementById('talkPageNumber'),theme=document.getElementById('talkTheme'),tabs=[document.getElementById('talkLoveTab'),document.getElementById('talkPainTab')];
 let category='病恋',page=0,savedScroll=0,oldOverflow='';
 entry.removeAttribute('aria-disabled');entry.setAttribute('aria-haspopup','dialog');entry.setAttribute('aria-controls','talkDialog');
 function syncTheme(){theme.textContent=stage.classList.contains('day')?'☼':'☾'}
 function render(){
  const indices=images.map((image,index)=>image.category===category?index:-1).filter(index=>index>=0),pageCount=Math.ceil(indices.length/3),visible=indices.slice(page*3,page*3+3);
  thumbnails.replaceChildren();thumbnails.dataset.layout=category==='病恋'&&page===0?'paired':'strips';thumbnails.setAttribute('aria-labelledby',category==='病恋'?'talkLoveTab':'talkPainTab');
  for(const index of visible){
   const button=document.createElement('button'),image=new Image(),number=document.createElement('small'),icon=document.createElement('span');button.type='button';button.className='talk-thumbnail';button.dataset.talk=String(index);button.setAttribute('aria-label',`放大${category}话术 ${indices.indexOf(index)+1}`);image.src=images[index].src;image.alt=`${category}话术 ${indices.indexOf(index)+1}`;image.draggable=false;number.textContent=String(indices.indexOf(index)+1).padStart(2,'0');icon.className='talk-magnify';icon.setAttribute('aria-hidden','true');button.append(image,number,icon);
   const tape=document.createElement('span'),clip=document.createElement('span');tape.className='talk-washi';clip.className='talk-paperclip';tape.setAttribute('aria-hidden','true');clip.setAttribute('aria-hidden','true');button.append(tape,clip);
   button.addEventListener('click',()=>stage.dispatchEvent(new CustomEvent('gallery-image-request',{detail:{images:indices.map(i=>images[i]),index:indices.indexOf(index),invoker:button,label:'话术'}})));thumbnails.append(button);
  }
  previous.disabled=page===0;next.disabled=page===pageCount-1;counter.textContent=`${page+1} / ${pageCount}`;dialog.dataset.category=category;dialog.dataset.page=String(page+1);
  tabs.forEach((tab,index)=>{const selected=(index===0?'病恋':'虐恋')===category;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1});
 }
 function selectCategory(index,focus=false){category=index===0?'病恋':'虐恋';page=0;render();if(focus)tabs[index].focus()}
 tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectCategory(index));tab.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();selectCategory(event.key==='Home'?0:event.key==='End'?1:1-index,true)}})});
 entry.addEventListener('click',()=>{savedScroll=profilePage.scrollTop;oldOverflow=profilePage.style.overflowY;profilePage.style.overflowY='hidden';category='病恋';page=0;dialog.showModal();render();syncTheme();document.getElementById('talkReturn').focus({preventScroll:true})});
 previous.addEventListener('click',()=>{if(page>0){page--;render()}});next.addEventListener('click',()=>{const count=images.filter(image=>image.category===category).length;if((page+1)*3<count){page++;render()}});
 theme.addEventListener('click',()=>{manualTheme=true;setTheme(!stage.classList.contains('day'));syncTheme()});
 document.getElementById('talkReturn').addEventListener('click',()=>dialog.close());dialog.addEventListener('cancel',event=>{event.preventDefault();dialog.close()});dialog.addEventListener('close',()=>{profilePage.style.overflowY=oldOverflow;profilePage.scrollTop=savedScroll;entry.focus({preventScroll:true});requestAnimationFrame(()=>profilePage.scrollTop=savedScroll)});
})();
