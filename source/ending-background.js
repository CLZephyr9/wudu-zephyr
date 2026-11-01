(()=>{
 const ending=document.getElementById('endingBackground'),entry=document.getElementById('endingEntry'),choices=document.getElementById('endingChoices'),copy=document.getElementById('endingCopy');let savedScroll=0,branchTimer,exitTimer;
 const exit=document.getElementById('endingExit'),exitHelp=document.getElementById('endingExitHelp');
 const texts={shore:'她似乎还想说些什么……水声盖过了后半句',stay:'她眼里的雾气似乎化开了一些，那双模糊的眼你看得愈发清，那深处的瞳色分明如这潭水一般幽冷，你好像逃不开了呢……'};
 function syncTheme(){entry.textContent=stage.classList.contains('day')?'试图离开':'试图逃离'}
 syncTheme();new MutationObserver(syncTheme).observe(stage,{attributes:true,attributeFilter:['class']});
 function openEnding(){ending.dataset.step='choices';clearTimeout(exitTimer);exit.hidden=true;exitHelp.hidden=true;savedScroll=profilePage.scrollTop;clearTimeout(branchTimer);choices.hidden=false;choices.classList.remove('is-leaving');choices.querySelectorAll('button').forEach(button=>button.disabled=false);copy.hidden=true;copy.textContent='';document.getElementById('opening').hidden=true;scene.style.visibility='hidden';profilePage.hidden=true;ending.hidden=false;stage.dataset.scene='ending';busy=false}
 entry.addEventListener('click',openEnding);
 exit.addEventListener('click',()=>{exitHelp.hidden=true;try{window.close()}catch{}clearTimeout(exitTimer);exitTimer=setTimeout(()=>{if(!window.closed&&!ending.hidden)exitHelp.hidden=false},450)});
 function showSilence(){
  if(ending.hidden||copy.hidden||copy.dataset.branch==='silence'||copy.getAnimations().some(animation=>animation.playState==='running'))return;
  copy.hidden=true;copy.textContent=`……${visitorName}？`;copy.dataset.branch='silence';void copy.offsetWidth;copy.hidden=false;exit.hidden=false;ending.dataset.step='silence';
 }
 stage.addEventListener('click',event=>{if(stage.dataset.scene==='ending'&&!event.target.closest('button'))showSilence()});
 choices.addEventListener('click',event=>{const button=event.target.closest('[data-ending-choice]');if(!button||button.disabled)return;choices.querySelectorAll('button').forEach(item=>item.disabled=true);choices.classList.add('is-leaving');const branch=button.dataset.endingChoice;branchTimer=setTimeout(()=>{choices.hidden=true;copy.textContent=texts[branch];copy.dataset.branch=branch;copy.hidden=false},matchMedia('(prefers-reduced-motion: reduce)').matches?0:500)});
 document.getElementById('endingReturn').addEventListener('click',()=>{clearTimeout(branchTimer);clearTimeout(exitTimer);exitHelp.hidden=true;ending.hidden=true;if(!profileMotionReady)initializeProfileMotion();profilePage.hidden=false;profilePage.classList.add('visible');profilePage.style.transition='none';stage.dataset.scene='profile';profilePage.scrollTop=savedScroll;entry.focus({preventScroll:true});requestAnimationFrame(()=>profilePage.scrollTop=savedScroll)});
 if(location.hash==='#ending-backgrounds')openEnding();
})();
