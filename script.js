// Interactive scripts: confetti, fireworks, countdown, guestbook, sound, and hero slideshow
const canvas = document.getElementById('fxCanvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
window.addEventListener('resize', ()=>{W=canvas.width=innerWidth;H=canvas.height=innerHeight});

// Simple confetti particles
class Particle{constructor(x,y,dx,dy,color,size,ttl){Object.assign(this,{x,y,dx,dy,color,size,ttl,age:0})}
  update(dt){this.age+=dt;this.x+=this.dx*dt;this.y+=this.dy*dt;this.dy+=30*dt}
  draw(ctx){ctx.fillStyle=this.color;ctx.beginPath();ctx.rect(this.x,this.y,this.size, this.size*1.6);ctx.fill()}
}
let particles=[];let runningConfetti=false;
function spawnConfetti(x,y,count=40){for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2;const s=4+Math.random()*6;const speed=120+Math.random()*240;particles.push(new Particle(x,y,Math.cos(a)*speed,Math.sin(a)*speed,randomColor(),s,1+Math.random()*1.6))}}
function randomColor(){const palette=['#ff7ab6','#ffd166','#6de1ff','#9bffb2','#c7a6ff'];return palette[Math.floor(Math.random()*palette.length)]}

// Fireworks (burst of bright particles)
function spawnFirework(x,y){for(let i=0;i<180;i++){const a=Math.random()*Math.PI*2;const speed=80+Math.random()*420;particles.push(new Particle(x,y,Math.cos(a)*speed,Math.sin(a)*speed,randomColor(),2+Math.random()*3,1.2+Math.random()*1.2))}}

// Animation loop
let last=performance.now();
function loop(t){const dt=(t-last)/1000;last=t;ctx.clearRect(0,0,W,H);for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.update(dt);p.draw(ctx);if(p.age>p.ttl)particles.splice(i,1)}requestAnimationFrame(loop)}
requestAnimationFrame(loop);

// Hero slideshow removed: keep hero static for now (custom photos feature removed)

// UI bindings
const confettiBtn=document.getElementById('confettiBtn');
const fireworksBtn=document.getElementById('fireworksBtn');
const musicBtn=document.getElementById('musicBtn');
const dateInput=document.getElementById('dateInput');
const countdownDisplay=document.getElementById('countdownDisplay');

confettiBtn.addEventListener('click', ()=>{
  runningConfetti = !runningConfetti;
  confettiBtn.textContent = runningConfetti ? 'Stop Confetti' : 'Start Confetti';
  // confettiLoop starts or stops based on `runningConfetti` flag
  confettiLoop();
});
fireworksBtn.addEventListener('click', ()=>{spawnFirework(Math.random()*W, Math.random()*H*0.5)});

// Continuous confetti
let confettiInterval=null;
function confettiLoop(){if(!runningConfetti){clearInterval(confettiInterval);confettiInterval=null;return}
  confettiInterval=setInterval(()=>{spawnConfetti(Math.random()*W, -20, 20)}, 300);
}

// Removed legacy guestbook submit handler (replaced by per-month timeline)
// Timeline (12 months) messages - stored in localStorage under 'anni_timeline'
const timelineForm = document.getElementById('timelineForm');
const monthMessageDisplay = document.getElementById('monthMessageDisplay');
const monthRange = document.getElementById('monthRange');
const monthLabel = document.getElementById('monthLabel');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');
const clearMonthBtn = document.getElementById('clearMonth');
const sliderBubble = document.getElementById('sliderBubble');
const monthMarkers = document.getElementById('monthMarkers');
const editLabelsBtn = document.getElementById('editLabelsBtn');
const exportTimelineBtn = document.getElementById('exportTimelineBtn');
const undoBtn = document.getElementById('undoBtn');

// Undo buffer for clears
let undoBuffer = null;

// Month labels persisted separately
const LABEL_KEY = 'anni_month_labels';
function loadLabels(){try{const raw = localStorage.getItem(LABEL_KEY); if(!raw) return null; const parsed = JSON.parse(raw); if(Array.isArray(parsed) && parsed.length===12) return parsed; }catch(e){} return null}
function saveLabels(arr){try{localStorage.setItem(LABEL_KEY, JSON.stringify(arr))}catch(e){}}

function escapeHtml(s){return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}

function defaultTimeline(){
  return {
    1: `Whoa, what a crazy adventure this started out to be! It all started at 3 AM, of all times. After an epic day at Universal Studios, I mustered up the guts to confess my feelings to you. My body was shaking, and my heart felt like it was doing backflips! The whole vibe of the day—the rides, the laughs—just made everything right. And then, when we started exchanging those “wind” messages, it was like the little ways the universe signals us that we were meant to be. I was trying to figure out what it really meant to be together, and honestly, it felt both thrilling and terrifying.`,
    2: `This was really an eye-opener for me. I never knew just how attached I had gotten! I mean, I found myself staying up way too late, texting you, and reminiscing about our trip. Those late-night conversations always made me chuckle, especially when we talked about our Minecraft builds. I missed those late nights creating epic worlds together. It was more than just gaming, though—it was the connection we built that made it special. And that is when I started understanding how deep my feelings were, and it was both exciting and a little scary.`,
    3: `By the time March rolled around, our gaming sessions became the highlight of my days. Seriously, can you believe how much fun we had? There was something about teaming up in those games that pulled us closer together. We laughed until our sides hurt, and I loved every second of it. Whether we were battling foes or just goofing around, it felt like we found our rhythm. Those moments were more than just games—they were the foundation of something really special between us.`,
    4: `That month just basically hit me like a ton of bricks in the best possible way. I had some serious realizations about you—you were one of a kind. Your kindness, supporting vibes, and sense of humor really made it clear to me how lucky I was to have you in my life, so I honestly couldn't see myself finding anybody perfect for me as much as you are. Every conversation felt meaningful, and your belief in me made me feel unstoppable. I was falling for you hard.`,
    5: `I started peeling away the layers and learning about you, which made me fall harder. It was like we were exploring each other’s worlds, and I was so eager to learn about your hobbies, or what you loved. Each little detail made me appreciate you more. The more I discovered, the more I realized how compatible we were. It felt like we were building something awesome together—a connection that was unique and special between just us.`,
    6: `This month was a bit quieter, but that didn't stop my feelings from growing. Honestly, so much time went to daydreaming about you and replaying our moments in my head. My heart decided to hit the pause button and enjoy the view. Nothing huge happened, but just knowing you were there, always rooting for me, felt like an anchor. I was still crazy about you, and thinking about you made my days brighter.`,
    7: `By the time July rolled around, I was bursting with excitement for our meetups. There was this electric thrill every time we were hanging out alone. It felt like time stopped whenever we were together, and I didn't want those moments to end. Each meeting just confirmed how special you were to me. I longed for more time with you because every second felt like a dream that I never wanted to wake up from. Those hangouts made my heart go racing in the best possible manner, and I started imagining all the future adventures we could have.`,
    8: `Even when I traveled, it did not matter; we just kept growing. I was determined to keep in touch no matter the distance. Those late-night texts became my lifeline. I marveled at how we could bridge any gap with our conversations, and every call felt like a mini reunion, reminding me how much I adore you. I felt unstoppable, even with miles between us! The bond we were building made every challenge worth it, and I was loving every minute.`,
    9: `Oh, this month was something else! Remember that time we went to the theater together? That was just THE BEST! I still smile upon thinking about it. It had this magic in the air, from sitting next to you to sharing some snacks and giggling our eyes out at all the funny parts. It made me realize how much I cherish those moments with you. I found myself wishing we could have more outings like that—fun, adventurous, filled with laughter. It is one of my favorite snapshots in our journey so far.`,
    10: `As October set in, life decided to throw a few wrenches our way. Between schoolwork and extracurriculars, with some drama sprinkled here and there, there was definitely a time or two when things seemed pretty rocky. But you know what? We fought our way through it together! I loved how no matter how crazy things got, we still made so much time for gaming and hanging out. Your strength and positivity kept me centered, and we handled all the haters and ups and downs as a team. Honestly, going through all that madness was way easier with you around.`,
    11: `The more time we spent together, the more I realized how attached I'd become. All those late-night gaming sessions, art projects, and silly conversations only drew us closer. And truly, more than anything, I loved our time together—just us, laughing at inside jokes or into new activities. Every new day with you just felt like another piece of our puzzle coming together, and I couldn't help but smile at how far we'd come. It felt good to know we were building a solid friendship and a budding romance all at once.`,
    12: `And here we are—a whole year together! Time sure flies, doesn't it? When I think about how this year has passed, I just feel grateful for all the moments we spent together. I never want to let you go—it's been such an amazing journey, with laughter, excitement, and heartfelt conversations all combined. I feel so lucky to have you in my life. I keep dreaming of what's next for us, and I'm so beyond excited for all the new memories in the chapters ahead. To us—forever exploring this beautiful adventure together!`
  };
}

function loadTimeline(){
  const raw = localStorage.getItem('anni_timeline');
  if(!raw){ return defaultTimeline(); }
  try{ const parsed = JSON.parse(raw);
    // If parsed is the old format (arrays per month), migrate to single-string per month by taking last message
    const keys = Object.keys(parsed||{});
    const looksLikeArrays = keys.length && keys.some(k => Array.isArray(parsed[k]));
    if(looksLikeArrays){ const migrated = {}; for(let i=1;i<=12;i++){ const arr = parsed[i]||[]; if(Array.isArray(arr) && arr.length){ const last = arr[arr.length-1]; migrated[i] = last && (last.msg||last.message) ? String(last.msg||last.message) : ''; } else migrated[i]=''; } return migrated }
    // If parsed already maps months to strings, ensure defaults
    const out = {}; for(let i=1;i<=12;i++) out[i] = (parsed[i] && typeof parsed[i]==='string') ? parsed[i] : '';
    return out
  }catch(e){ const empty={}; for(let i=1;i<=12;i++) empty[i]=''; return empty }
}
function saveTimeline(t){localStorage.setItem('anni_timeline', JSON.stringify(t))}

function renderTimeline(month){ month = Number(month||monthRange.value); monthLabel.textContent = month; const t = loadTimeline(); const msg = t[month] || ''; if(!monthMessageDisplay) return; if(!msg) { monthMessageDisplay.textContent = 'No message yet for this month.'; monthMessageDisplay.classList.add('empty'); } else { monthMessageDisplay.textContent = msg; monthMessageDisplay.classList.remove('empty'); } }

// removed: timelineForm (no add/edit). Clear/save removed — timeline is read-only except via import/export
// Announcement modal elements
const announcement = document.getElementById('announcement');
const announceTitle = document.getElementById('announceTitle');
const announceText = document.getElementById('announceText');
const closeAnnounce = document.getElementById('closeAnnounce');

function showAnnouncement(month){
  month = Number(month);
  const labels = monthNames;
  const label = labels[month-1] || (`Month ${month}`);
  const t = loadTimeline();
  const msg = (t && t[month]) ? t[month] : '';
  if(announceTitle) announceTitle.textContent = `${label}`;
  if(announceText) announceText.textContent = msg || 'No message yet for this month.';
  if(announcement){ announcement.classList.remove('hidden'); announcement.setAttribute('aria-hidden','false'); }
  // spawn a few floating hearts inside the announcement for romantic effect
  try{
    const card = document.querySelector('.announce-card');
    if(card){
      for(let i=0;i<8;i++){
        const s = document.createElement('span'); s.className = 'floating-heart'; s.textContent = i%2? '💖':'❤️';
        // random horizontal position within the card
        const left = 12 + Math.random()*76; s.style.left = left + '%'; s.style.bottom = (12 + Math.random()*8) + 'px'; s.style.opacity = '1';
        card.appendChild(s);
        // remove after animation
        setTimeout(()=>{ s.remove(); }, 1600 + Math.random()*400);
      }
    }
  }catch(e){/* ignore */}
}
function hideAnnouncement(){ if(announcement){ announcement.classList.add('hidden'); announcement.setAttribute('aria-hidden','true'); } }

if(closeAnnounce){ closeAnnounce.addEventListener('click', hideAnnouncement); }
if(announcement){ announcement.addEventListener('click', (e)=>{ if(e.target===announcement) hideAnnouncement(); }) }

monthRange && monthRange.addEventListener('input', ()=>{ updateSliderUI(Number(monthRange.value))});
prevMonth && prevMonth.addEventListener('click', ()=>{let v = Number(monthRange.value); if(v>1) v--; updateSliderUI(v); showAnnouncement(v);});
nextMonth && nextMonth.addEventListener('click', ()=>{let v = Number(monthRange.value); if(v<12) v++; updateSliderUI(v); showAnnouncement(v);});

// On load render month 1
if(monthRange){monthLabel.textContent = monthRange.value; renderTimeline(Number(monthRange.value))}
// If the timeline was accidentally cleared, restore seeded default messages
function ensureTimelineRestored(){
  try{
    const raw = localStorage.getItem('anni_timeline');
    let need = false;
    if(!raw) need = true;
    else {
      const parsed = JSON.parse(raw);
      const hasAny = Object.values(parsed||{}).some(v => v && String(v).trim().length>0);
      if(!hasAny) need = true;
    }
    if(need){ const def = defaultTimeline(); saveTimeline(def); renderTimeline(1); console.log('Restored default timeline messages'); }
  }catch(e){ const def = defaultTimeline(); saveTimeline(def); renderTimeline(1); }
}
ensureTimelineRestored();
// Migrate legacy single guestbook (`anni_messages`) into month 1 if present and timeline empty
;(function migrateLegacy(){
  try{
    const legacy = localStorage.getItem('anni_messages'); if(!legacy) return;
    const timelines = loadTimeline();
    // now timelines map months->string, check if any month has a non-empty message
    const hasAny = Object.values(timelines).some(v => v && String(v).trim().length>0);
    if(hasAny) return;
    try{
      const list = JSON.parse(legacy);
      if(Array.isArray(list) && list.length){
        // take the last message's text and migrate to month 1
        const last = list[list.length-1];
        const text = (last && (last.msg || last.message)) ? String(last.msg || last.message) : '';
        const out = loadTimeline(); out[1] = text; saveTimeline(out); renderTimeline(1); localStorage.removeItem('anni_messages'); console.log('Migrated legacy guestbook into timeline month 1');
      }
    }catch(e){}
  }catch(e){}
})();

// Slider UI: bubble that follows thumb and clickable month markers
let monthNames = loadLabels() || [
  'Month 1','Month 2','Month 3','Month 4','Month 5','Month 6',
  'Month 7','Month 8','Month 9','Month 10','Month 11','Month 12'
];

function updateSliderUI(val){
  if(!monthRange) return; val = Number(val); monthRange.value = val;
  // show numeric + label in the monthLabel
  const label = monthNames[val-1] || (`Month ${val}`);
  monthLabel.textContent = `${val} — ${label}`;
  renderTimeline(val);
  // position bubble smoothly
  if(sliderBubble){
    const pct = (val-1)/11;
    sliderBubble.style.left = `${pct*100}%`;
    sliderBubble.textContent = label;
    // pop/bounce for tactile feedback
    sliderBubble.classList.remove('bounce');
    // force reflow to restart animation
    void sliderBubble.offsetWidth;
    sliderBubble.classList.add('bounce');
    // remove bounce after transition
    setTimeout(()=>{sliderBubble.classList.remove('bounce')}, 300);
  }
  // update markers active
  if(monthMarkers){Array.from(monthMarkers.querySelectorAll('.month-dot')).forEach(d=>{d.classList.toggle('active', Number(d.dataset.month)===val)})}
}

// initialize markers clickable and slider interactions
if(monthMarkers){Array.from(monthMarkers.querySelectorAll('.month-dot')).forEach(btn=>{btn.addEventListener('click', ()=>{const m = Number(btn.dataset.month); updateSliderUI(m); showAnnouncement(m); })})}

if(monthRange){
  // click on the slider track to jump
  const wrap = monthRange.parentElement;
  wrap && wrap.addEventListener('click', (e)=>{
    // ignore clicks on the buttons (prev/next)
    const rect = monthRange.getBoundingClientRect(); const px = e.clientX - rect.left; const pct = Math.max(0, Math.min(1, px / rect.width)); const val = Math.round(pct*11)+1; updateSliderUI(val); showAnnouncement(val);
  });

  monthRange.addEventListener('input', (e)=>{ updateSliderUI(e.target.value) });
  // show announcement when user releases the slider (change event)
  monthRange.addEventListener('change', ()=>{ showAnnouncement(Number(monthRange.value)); });
  // position initial bubble
  updateSliderUI(Number(monthRange.value));
}

// keyboard left/right to change month while focused
document.addEventListener('keydown', (e)=>{ if(document.activeElement===monthRange){ if(e.key==='ArrowLeft'){ let v=Number(monthRange.value); if(v>1) updateSliderUI(v-1); e.preventDefault()} if(e.key==='ArrowRight'){ let v=Number(monthRange.value); if(v<12) updateSliderUI(v+1); e.preventDefault() } } });

// Export timeline as JSON
if(exportTimelineBtn){ exportTimelineBtn.addEventListener('click', ()=>{
  const data = loadTimeline(); const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'timeline.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
 })}

// Edit labels: simple prompt to edit comma-separated labels
if(editLabelsBtn){ editLabelsBtn.addEventListener('click', ()=>{
  const current = monthNames.join(', ');
  const res = prompt('Edit month labels (comma-separated, 12 items):', current);
  if(!res) return; const parts = res.split(',').map(s=>s.trim()).filter(Boolean);
  if(parts.length!==12){ alert('Please enter exactly 12 comma-separated labels.'); return }
  monthNames = parts; saveLabels(monthNames); updateSliderUI(Number(monthRange.value));
 })}

// Undo for clear
if(undoBtn){ undoBtn.addEventListener('click', ()=>{
  if(!undoBuffer) return; const t = loadTimeline(); t[undoBuffer.month] = undoBuffer.prev; saveTimeline(t); renderTimeline(undoBuffer.month); undoBuffer = null; undoBtn.style.display='none';
 })}

// Wrap clear to support undo
if(clearMonthBtn){ const origClear = ()=>{}; clearMonthBtn.addEventListener('click', ()=>{ const month = Number(monthRange.value); const t = loadTimeline(); const prev = t[month] || ''; if(!confirm(`Clear message for month ${month}?`)) return; // store for undo
  undoBuffer = {month, prev}; t[month] = ''; saveTimeline(t); renderTimeline(month); // show undo button
  if(undoBtn){ undoBtn.style.display='inline-block'; setTimeout(()=>{ if(undoBuffer){ undoBuffer=null; if(undoBtn) undoBtn.style.display='none' } }, 8000) }
}) }

// Countdown
function setDefaultDateToToday(){const today=new Date();today.setHours(0,0,0,0);dateInput.valueAsDate=today}
function updateCountdown(){const val=dateInput.value; if(!val){countdownDisplay.textContent='—';return}const target=new Date(val+'T00:00:00');const now=new Date();const diff=(target-now)/1000;const abs=Math.abs(Math.floor(diff));const days=Math.floor(abs/86400);const hrs=Math.floor(abs%86400/3600);const mins=Math.floor(abs%3600/60);const secs=abs%60;countdownDisplay.textContent=(diff>=0? 'In ':'Since ')+`${days}d ${hrs}h ${mins}m ${secs}s`}
setDefaultDateToToday();setInterval(updateCountdown, 1000);updateCountdown();

// Music: play user's MP3 file if present, otherwise fall back to generated tones
let audioCtx = null; let currentOsc = null; let musicTimeout = null; let musicPlaying = false; let musicFadeInterval = null;
const bgAudio = document.getElementById('bgAudio');

function playBgAudio(){
  if(bgAudio){
    try{ bgAudio.volume = 0; bgAudio.play(); }catch(e){}
    musicPlaying = true; musicBtn.textContent = 'Stop Music';
    // fade volume in
    const target = 0.9; if(musicFadeInterval) clearInterval(musicFadeInterval);
    musicFadeInterval = setInterval(()=>{ bgAudio.volume = Math.min(target, +(bgAudio.volume + 0.06).toFixed(3)); if(bgAudio.volume>=target){ clearInterval(musicFadeInterval); musicFadeInterval=null } }, 80);
    return;
  }
  // fallback generated melody
  if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if(musicPlaying) return;
  const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.type='sine'; const notes=[440,554.37,659.25,830.61]; const start=audioCtx.currentTime;
  g.gain.setValueAtTime(0.0001, start); g.gain.exponentialRampToValueAtTime(0.12, start+0.02);
  for(let i=0;i<16;i++){ o.frequency.setValueAtTime(notes[i%notes.length], start + i*0.25); }
  o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(start+4);
  currentOsc = o; musicPlaying = true; musicBtn.textContent = 'Stop Music';
  musicTimeout = setTimeout(()=>{ musicPlaying=false; currentOsc=null; musicBtn.textContent='Play Music'; }, 4200);
}

function stopBgAudio(){
  if(bgAudio && musicPlaying){
    // fade out
    if(musicFadeInterval) clearInterval(musicFadeInterval);
    const down = setInterval(()=>{ bgAudio.volume = Math.max(0, +(bgAudio.volume - 0.06).toFixed(3)); if(bgAudio.volume<=0.02){ clearInterval(down); bgAudio.pause(); bgAudio.currentTime = 0; } }, 80);
    musicPlaying = false; musicBtn.textContent = 'Play Music';
    return;
  }
  // fallback stop
  if(!musicPlaying) return; try{ currentOsc && currentOsc.stop(); }catch(e){} currentOsc=null; musicPlaying=false; musicBtn.textContent='Play Music'; if(musicTimeout){ clearTimeout(musicTimeout); musicTimeout=null }
}

musicBtn.addEventListener('click', ()=>{ if(!musicPlaying) playBgAudio(); else stopBgAudio(); });

// Small interactive hint: click hero to burst confetti
document.querySelector('.hero').addEventListener('click', e=>{spawnConfetti(e.clientX, e.clientY, 60)})

// Minimal accessibility: allow keyboard toggles
document.addEventListener('keydown', e=>{if(e.key==='c') {confettiBtn.click()} if(e.key==='m'){musicBtn.click()} if(e.key==='f'){fireworksBtn.click()}})

// Mark initial todos complete in the managed todo list via console log (UI only)
console.log('Anniversary site loaded')
