// One music player stays alive while opening and closing profile cards.
const profileMusic=new Audio('__PROFILE_MUSIC__');
profileMusic.loop=true;profileMusic.preload='metadata';
let profileMusicSource,profileMusicGain,profileMusicStarting=false;
async function startProfileMusic(){
 if(profileMusicStarting||!profileMusic.paused)return;
 profileMusicStarting=true;
 try{
  const Context=window.AudioContext||window.webkitAudioContext;
  if(Context){
   audioContext??=new Context();audioContext.resume().catch(()=>{});
   if(!profileMusicSource){profileMusicSource=audioContext.createMediaElementSource(profileMusic);profileMusicGain=audioContext.createGain();profileMusicGain.gain.value=0;profileMusicSource.connect(profileMusicGain).connect(audioContext.destination)}
   const now=audioContext.currentTime;profileMusicGain.gain.cancelScheduledValues(now);profileMusicGain.gain.setValueAtTime(0,now);profileMusicGain.gain.linearRampToValueAtTime(.35,now+2.2);
  }else profileMusic.volume=.35;
  await profileMusic.play();stage.dataset.profileAudio='playing';
 }catch{stage.dataset.profileAudio='waiting-for-interaction'}finally{profileMusicStarting=false}
}
document.addEventListener('pointerdown',()=>{if(stage.dataset.scene==='profile')startProfileMusic()},{passive:true});
document.addEventListener('keydown',()=>{if(stage.dataset.scene==='profile')startProfileMusic()});
