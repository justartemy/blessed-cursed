const play = document.getElementById('play');
const fill = document.querySelector('.track-fill');
const time = document.getElementById('time');
const line = document.querySelector('.track-line');
const tracks = document.querySelectorAll('.track');

let playing = false;
let elapsed = 0;
let duration = 222;
let timer = null;

function fmt(seconds){
  const m = Math.floor(seconds / 60).toString().padStart(2,'0');
  const s = Math.floor(seconds % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function update(){
  time.textContent = fmt(elapsed);
  fill.style.width = `${Math.min(100, elapsed / duration * 100)}%`;
}

play.addEventListener('click', ()=>{
  playing = !playing;
  play.textContent = playing ? 'pause' : 'play';

  if(playing){
    timer = setInterval(()=>{
      elapsed++;
      if(elapsed >= duration){
        elapsed = 0;
        playing = false;
        play.textContent = 'play';
        clearInterval(timer);
      }
      update();
    },1000);
  } else {
    clearInterval(timer);
  }
});

line.addEventListener('click',(e)=>{
  const rect = line.getBoundingClientRect();
  elapsed = Math.round(((e.clientX - rect.left) / rect.width) * duration);
  update();
});

tracks.forEach(track=>{
  track.addEventListener('click',()=>{
    tracks.forEach(t=>t.classList.remove('active'));
    track.classList.add('active');

    const title = track.dataset.title;
    const parts = track.dataset.duration.split(':');
    duration = Number(parts[0])*60 + Number(parts[1]);
    elapsed = 0;
    time.textContent = '00:00';
    fill.style.width = '0%';

    if(playing){
      clearInterval(timer);
      playing = false;
      play.textContent = 'play';
    }

    // здесь можно подключить реальный audio-файл:
    // new Audio('audio/track.mp3').play();
    console.log('selected:', title);
  });
});

document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',()=>{
    const target = document.querySelector(link.getAttribute('href'));
    if(target) target.scrollIntoView({behavior:'smooth'});
  });
});

// небольшая glitch-вспышка при наведении на крупные элементы
document.querySelectorAll('.hero-title, .broken-type').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    const flash = document.querySelector('.flash');
    flash.animate(
      [{opacity:0},{opacity:.08},{opacity:0}],
      {duration:180,easing:'steps(2)'}
    );
  });
});
