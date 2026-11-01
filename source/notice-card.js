(()=>{
 const content=__NOTICE_CONTENT_JSON__,dialog=document.getElementById('noticeDialog'),body=document.getElementById('noticeBody'),pageContent=document.getElementById('noticePageContent'),pageNumber=document.getElementById('noticePageNumber'),previous=document.getElementById('noticePrevious'),next=document.getElementById('noticeNext'),back=document.getElementById('noticeReturn'),theme=document.getElementById('noticeTheme');
 const entry=document.querySelector('[data-panel="须知"]');entry.removeAttribute('aria-disabled');entry.setAttribute('aria-haspopup','dialog');entry.setAttribute('aria-controls','noticeDialog');
 let currentPage=0,savedScroll=0,formerOverflow='';
 function syncTheme(){theme.textContent=stage.classList.contains('day')?'☼':'☾'}
 function fitPage(){
  if(!dialog.open)return;
  const small=innerWidth<=350||innerHeight<=670;let size=small?14:15;
  dialog.classList.remove('compact');
  body.style.setProperty('--sheet-font',`${size}px`);dialog.style.setProperty('--sheet-gap',small?'10px':'14px');dialog.style.setProperty('--sheet-leading',small?'1.7':'1.8');
  if(small&&body.scrollHeight>body.clientHeight+1){dialog.classList.add('compact');dialog.style.setProperty('--sheet-gap','8px');dialog.style.setProperty('--sheet-leading','1.65')}
  for(;size>12&&pageContent.getBoundingClientRect().height>body.clientHeight-parseFloat(getComputedStyle(body).paddingTop)-parseFloat(getComputedStyle(body).paddingBottom)+.5;size-=.25){body.style.setProperty('--sheet-font',`${size-.25}px`)}
  dialog.dataset.pageFits=String(body.scrollHeight<=body.clientHeight+1);
 }
 function renderPage(){
  const stamp=document.getElementById('noticeNameStamp');stamp.textContent=visitorName;stamp.hidden=!visitorName;
  pageContent.replaceChildren();
  if(currentPage===0){const intro=document.createElement('div');intro.className='notice-intro';for(const text of content.intro){const p=document.createElement('p');p.textContent=text;intro.append(p)}pageContent.append(intro)}
  for(const number of content.pages[currentPage]){const item=content.items.find(item=>item.number===number),section=document.createElement('section'),heading=document.createElement('h3'),paragraph=document.createElement('p');section.className='notice-item';heading.textContent=`${item.number}．${item.title}`;paragraph.textContent=item.text;section.append(heading,paragraph);pageContent.append(section)}
  pageNumber.textContent=`${currentPage+1} / ${content.pages.length}`;previous.disabled=currentPage===0;next.disabled=currentPage===content.pages.length-1;dialog.dataset.page=String(currentPage+1);fitPage();pageContent.classList.remove('page-enter');void pageContent.offsetWidth;pageContent.classList.add('page-enter');
 }
 entry.addEventListener('click',()=>{savedScroll=profilePage.scrollTop;formerOverflow=profilePage.style.overflowY;profilePage.style.overflowY='hidden';currentPage=0;dialog.showModal();renderPage();syncTheme();back.focus({preventScroll:true})});
 previous.addEventListener('click',()=>{if(currentPage>0){currentPage--;renderPage()}});next.addEventListener('click',()=>{if(currentPage<content.pages.length-1){currentPage++;renderPage()}});
 back.addEventListener('click',()=>dialog.close());dialog.addEventListener('cancel',event=>{event.preventDefault();dialog.close()});
 dialog.addEventListener('close',()=>{profilePage.style.overflowY=formerOverflow;profilePage.scrollTop=savedScroll;entry.focus({preventScroll:true});requestAnimationFrame(()=>{profilePage.scrollTop=savedScroll})});
 theme.addEventListener('click',()=>{manualTheme=true;setTheme(!stage.classList.contains('day'));syncTheme()});new MutationObserver(syncTheme).observe(stage,{attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',()=>requestAnimationFrame(fitPage));document.fonts.ready.then(fitPage);
})();
