(()=>{
 const ice=document.createElement('div');ice.className='profile-day-ice';ice.id='profileDayIce';ice.setAttribute('aria-hidden','true');
 for(let i=0;i<9;i++){
  const crystal=new Image();crystal.src='__DAY_ICE__';crystal.alt='';crystal.style.cssText=`--ice-x:${(i*31.7+6)%100}%;--ice-size:${10+(i%4)*3}px;--ice-time:${26+i%6*3}s;--ice-delay:-${i*3.4}s;--ice-opacity:${.14+i%3*.05};--ice-sway:${(i%2?1:-1)*(18+i%4*5)}px`;ice.append(crystal);
 }
 stage.append(ice);
})();
