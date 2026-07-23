const NICKNAME = "Babi";

/* ======================= EDIT ME =======================
   This is the special message that shows up once she has
   pulled EVERY photo out of the jar. Make it your own.
   Use \n\n for a new paragraph.
========================================================= */
const FINAL_MESSAGE =
  `Babi,

thank you babi for always in my side 
and for always supporting me.

Sorry kasi matigas ulo ko pa minsan minsan
pero lagi mo parin ako sinasalo. Iloveyo

7th months na tayo babi and sana mas marami pang months na magkasama tayo
wala akong ibang hiling kundi ikaw ang makasama ko palagi

Iloveyou babi, wala na akong masabi kundi salamat kasi naiitis mo ang ugali ko na'to
hindi kona ging english baka hindi mo nanaman ma appreciate e HAHAHA

Mahal na mahal po kita babi higit pa sa akala mo
ILOVEYOU SO MUCH!

— Ken`;

// stars background
const starsEl = document.getElementById('stars');
for (let i = 0; i < 40; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  const size = Math.random() * 3 + 1;
  s.style.width = size + 'px'; s.style.height = size + 'px';
  s.style.left = Math.random() * 100 + 'vw'; s.style.top = Math.random() * 100 + 'vh';
  s.style.animationDelay = (Math.random() * 4) + 's';
  starsEl.appendChild(s);
}

let remaining = [...PHOTOS.keys()]; // indices not yet drawn
let drawnCount = 0;
const countLabel = document.getElementById('countLabel');
const jarWrap = document.getElementById('jarWrap');
const modalBackdrop = document.getElementById('modalBackdrop');
const noteCard = document.getElementById('noteCard');

function updateCount() {
  countLabel.textContent = `${drawnCount} of ${PHOTOS.length} memories pulled`;
}
updateCount();

// candy progress dots — one per photo, dims as each is drawn
const candyDotsEl = document.getElementById('candyDots');
PHOTOS.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'candy-dot';
  dot.id = `dot-${i}`;
  candyDotsEl.appendChild(dot);
});

function markDotUsed(index) {
  const dot = document.getElementById(`dot-${index}`);
  if (dot) dot.classList.add('used');
}

function resetDots() {
  PHOTOS.forEach((_, i) => {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) dot.classList.remove('used');
  });
}

// candy shapes used for the flying animation (randomly picked each pull)
const CANDY_SHAPES = [
  `<svg viewBox="0 0 60 40"><g><ellipse cx="30" cy="20" rx="15" ry="11" fill="#e8b85c"/><path d="M15 20 L2 10 L2 30 Z" fill="#e8b85c"/><path d="M45 20 L58 10 L58 30 Z" fill="#e8b85c"/></g></svg>`,
  `<svg viewBox="0 0 60 40"><g><ellipse cx="30" cy="20" rx="15" ry="11" fill="#c4425b"/><path d="M15 20 L2 10 L2 30 Z" fill="#c4425b"/><path d="M45 20 L58 10 L58 30 Z" fill="#c4425b"/></g></svg>`,
  `<svg viewBox="0 0 60 40"><circle cx="30" cy="20" r="16" fill="#7a4a2b"/><ellipse cx="24" cy="14" rx="5" ry="3" fill="#c98a5e" opacity="0.7"/></svg>`,
  `<svg viewBox="0 0 60 40"><g><ellipse cx="30" cy="20" rx="15" ry="11" fill="#f4c6d4"/><path d="M15 20 L2 10 L2 30 Z" fill="#f4c6d4"/><path d="M45 20 L58 10 L58 30 Z" fill="#f4c6d4"/></g></svg>`
];

function spawnFlyingCandy(onDone) {
  const rect = jarWrap.getBoundingClientRect();
  const startX = rect.left + rect.width / 2 - 30; // center a 60px-wide candy
  const startY = rect.top + rect.height * 0.35 - 20;

  const targetX = window.innerWidth / 2 - 30;
  const targetY = window.innerHeight / 2 - 20;

  const candy = document.createElement('div');
  candy.className = 'flying-candy';
  candy.style.left = startX + 'px';
  candy.style.top = startY + 'px';
  candy.style.width = '60px';
  candy.style.height = '40px';
  candy.innerHTML = CANDY_SHAPES[Math.floor(Math.random() * CANDY_SHAPES.length)];
  document.body.appendChild(candy);

  const duration = 750; // ms
  const startTime = performance.now();
  let lastTrailTime = 0;

  function easeOutQuad(t) { return 1 - (1 - t) * (1 - t); }

  function frame(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = easeOutQuad(t);

    const dx = (targetX - startX) * eased;
    const dy = (targetY - startY) * eased;

    // scale up through the flight, then shrink fast right at the end
    const scale = t < 0.82
      ? 1 + (t / 0.82) * 0.9
      : 1.9 - ((t - 0.82) / 0.18) * 1.7;

    const rotate = 420 * t;
    const opacity = t < 0.85 ? 1 : 1 - ((t - 0.85) / 0.15);

    candy.style.transform = `translate(${dx}px, ${dy}px) scale(${Math.max(scale, 0)}) rotate(${rotate}deg)`;
    candy.style.opacity = Math.max(opacity, 0);

    // drop a trailing sparkle every ~40ms while it's still flying
    if (now - lastTrailTime > 40 && t < 0.9) {
      spawnTrailDot(startX + 30 + dx, startY + 20 + dy);
      lastTrailTime = now;
    }

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      candy.remove();
      spawnSparkleBurst(targetX + 30, targetY + 20);
      if (onDone) onDone();
    }
  }
  requestAnimationFrame(frame);
}

function spawnTrailDot(x, y) {
  const dot = document.createElement('div');
  dot.className = 'candy-trail';
  dot.style.left = x + 'px';
  dot.style.top = y + 'px';
  document.body.appendChild(dot);
  setTimeout(() => dot.remove(), 550);
}

function spawnSparkleBurst(x, y) {
  const sparkles = ['✨', '💫', '⭐', '💖'];
  const count = 10;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const dist = 60 + Math.random() * 40;
    const sx = Math.cos(angle) * dist;
    const sy = Math.sin(angle) * dist;

    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    spark.style.setProperty('--sx', sx + 'px');
    spark.style.setProperty('--sy', sy + 'px');
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 650);
  }
}

function drawNote() {
  jarWrap.classList.remove('shake', 'lid-open');
  void jarWrap.offsetWidth; // restart animations
  jarWrap.classList.add('shake', 'lid-open');

  if (remaining.length === 0) {
    setTimeout(showEmptyCard, 200);
    return;
  }

  const pickAt = Math.floor(Math.random() * remaining.length);
  const photoIndex = remaining.splice(pickAt, 1)[0];
  drawnCount++;
  updateCount();
  markDotUsed(photoIndex);

  spawnFlyingCandy(() => showNoteCard(photoIndex));
}

function showNoteCard(index) {
  const p = PHOTOS[index];
  const rot = (Math.random() * 8 - 4).toFixed(1) + 'deg'; // -4deg to 4deg
  noteCard.style.setProperty('--rot', rot);
  noteCard.classList.remove('pop', 'wide');
  void noteCard.offsetWidth; // restart animation

  noteCard.innerHTML = `
    <div class="tag">Memory ${drawnCount}</div>
    <div class="note-photo"><img src="${p.src}" alt="${p.caption}"></div>
    <div class="note-text">"${p.caption}"</div>
    <div class="num">${remaining.length} memories left in the jar</div>
    <div class="note-actions">
      <button class="btn ghost" onclick="closeModal()">Close</button>
      <button class="btn" onclick="closeModal(); setTimeout(drawNote, 250);">Pull another</button>
    </div>
  `;
  noteCard.classList.add('pop');
  modalBackdrop.classList.add('open');
}

function showEmptyCard() {
  noteCard.style.setProperty('--rot', '0deg');
  noteCard.classList.remove('pop');
  noteCard.classList.add('wide');
  void noteCard.offsetWidth;

  const letterHTML = FINAL_MESSAGE
    .trim()
    .split(/\n\s*\n/)                 // split into paragraphs on blank lines
    .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
    .join('');

  noteCard.innerHTML = `
    <div class="tag">You Found Them All 💕</div>
    <div class="final-letter">${letterHTML}</div>
    <div class="note-actions" style="margin-top:24px;">
      <button class="btn ghost" onclick="closeModal()">Close</button>
      <button class="btn" onclick="resetJar()">Fill it up again</button>
    </div>
  `;
  noteCard.classList.add('pop');
  modalBackdrop.classList.add('open');
  launchHeartShower();
}

function launchHeartShower() {
  const hearts = ['💗', '💕', '✨', '🤍', '💛', '⭐'];
  const count = 30;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'falling-heart';
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      h.style.left = Math.random() * 100 + 'vw';
      h.style.fontSize = (14 + Math.random() * 16) + 'px';
      h.style.animationDuration = (2.5 + Math.random() * 2) + 's';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 5000);
    }, i * 70);
  }
}

function resetJar() {
  remaining = [...PHOTOS.keys()];
  drawnCount = 0;
  updateCount();
  resetDots();
  closeModal();
}

function closeModal() {
  modalBackdrop.classList.remove('open');
}

modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
