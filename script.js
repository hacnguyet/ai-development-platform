'use strict';
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const ui = Object.fromEntries(['best', 'score', 'overlay', 'label', 'title', 'message', 'start', 'pause', 'announcement'].map(id => [id, document.getElementById(id)]));
const W = 360, H = 600, floor = 548, birdX = 92, radius = 13, gap = 160, pipeWidth = 58;
let best = 0;
try { best = Math.max(0, Number(localStorage.getItem('flappy-best')) || 0); } catch { /* Storage is optional. */ }
ui.best.textContent = best;
let state = 'ready', birdY = 255, velocity = 0, pipes = [], score = 0, spawn = 0, last = null;
function start() {
  birdY = 255; velocity = -305; pipes = []; score = 0; spawn = 0.65;
  ui.score.textContent = '0'; state = 'playing'; last = null;
  ui.overlay.hidden = true; ui.pause.hidden = false;
  ui.pause.textContent = 'Ⅱ'; ui.pause.setAttribute('aria-label', 'Tạm dừng');
  canvas.focus({ preventScroll: true });
}
function end() {
  state = 'over'; ui.pause.hidden = true;
  if (score > best) {
    best = score; ui.best.textContent = best;
    try { localStorage.setItem('flappy-best', String(best)); } catch { /* Keep playing without storage. */ }
  }
  ui.label.textContent = 'THÊM MỘT LẦN NỮA?'; ui.title.textContent = 'Chuyến bay kết thúc';
  ui.message.textContent = `Bạn đạt ${score} điểm · Kỷ lục ${best}`;
  ui.start.textContent = 'Chơi lại ↗'; ui.overlay.hidden = false;
  ui.announcement.textContent = `Kết thúc. Bạn đạt ${score} điểm.`;
}
function pause() {
  if (state !== 'playing' && state !== 'paused') return;
  state = state === 'playing' ? 'paused' : 'playing'; last = null;
  ui.pause.textContent = state === 'paused' ? '▶' : 'Ⅱ';
  ui.pause.setAttribute('aria-label', state === 'paused' ? 'Tiếp tục' : 'Tạm dừng');
  ui.label.textContent = 'NGHỈ MỘT NHỊP'; ui.title.textContent = 'Đã tạm dừng';
  ui.message.textContent = 'Chuyến bay sẽ tiếp tục khi bạn sẵn sàng.';
  ui.start.textContent = 'Tiếp tục ↗'; ui.overlay.hidden = state !== 'paused';
}
function flap() { if (state === 'playing') velocity = -305; }
ui.start.addEventListener('click', () => state === 'paused' ? pause() : start());
ui.pause.addEventListener('click', pause);
canvas.addEventListener('pointerdown', event => { event.preventDefault(); flap(); });
document.addEventListener('keydown', event => {
  if (event.target.tagName === 'BUTTON') return;
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    event.preventDefault(); if (event.repeat) return;
    if (state === 'ready' || state === 'over') start(); else if (state === 'paused') pause(); else flap();
  } else if (event.code === 'Escape') pause();
});
document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'playing') pause(); });
function update(dt) {
  if (state !== 'playing') return;
  velocity += 900 * dt; birdY += velocity * dt; spawn += dt;
  if (spawn >= 1.65) {
    spawn = 0;
    pipes.push({ x: W + 10, top: 100 + Math.random() * 225, passed: false });
  }
  for (const pipe of pipes) {
    pipe.x -= 135 * dt;
    const nearX = Math.max(pipe.x, Math.min(birdX, pipe.x + pipeWidth));
    const dx = birdX - nearX;
    const topDy = Math.max(0, birdY - pipe.top);
    const bottomDy = Math.max(0, pipe.top + gap - birdY);
    if (dx * dx + topDy * topDy < radius * radius || dx * dx + bottomDy * bottomDy < radius * radius) { end(); return; }
    if (!pipe.passed && pipe.x + pipeWidth < birdX - radius) {
      pipe.passed = true; score++; ui.score.textContent = score;
    }
  }
  pipes = pipes.filter(pipe => pipe.x > -pipeWidth);
  if (birdY + radius >= floor || birdY - radius <= 0) end();
}
function roundRect(x, y, width, height, r, color) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y, width, height, r); ctx.fill();
}
function draw() {
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#8ed0cb'); sky.addColorStop(1, '#e0f0d3');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff70';
  for (const [x, y] of [[35, 95], [245, 165], [160, 55]]) {
    ctx.beginPath(); ctx.ellipse(x, y, 40, 12, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#7fbaa04d';
  for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(i * 70, floor, 65, Math.PI, 0); ctx.fill(); }
  for (const pipe of pipes) {
    roundRect(pipe.x, -10, pipeWidth, pipe.top + 10, 5, '#427e5b');
    roundRect(pipe.x + 6, -10, 10, pipe.top + 8, 3, '#7cad70');
    roundRect(pipe.x - 4, pipe.top - 23, pipeWidth + 8, 23, 5, '#326249');
    roundRect(pipe.x, pipe.top + gap, pipeWidth, floor - pipe.top - gap, 5, '#427e5b');
    roundRect(pipe.x + 6, pipe.top + gap, 10, floor - pipe.top - gap, 3, '#7cad70');
    roundRect(pipe.x - 4, pipe.top + gap, pipeWidth + 8, 23, 5, '#326249');
  }
  ctx.fillStyle = '#b7cb7c'; ctx.fillRect(0, floor, W, H - floor);
  ctx.fillStyle = '#e8e6ae'; ctx.fillRect(0, floor + 9, W, H - floor);
  ctx.fillStyle = '#96b46d'; ctx.fillRect(0, floor, W, 4);
  ctx.save(); ctx.translate(birdX, birdY); ctx.rotate(Math.max(-0.4, Math.min(1.1, velocity / 600)));
  ctx.fillStyle = '#f7cf5c'; ctx.strokeStyle = '#8c683c'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, 0, 17, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  roundRect(-13, 0, 16, 9, 5, '#e5a646');
  ctx.fillStyle = '#fff9e9'; ctx.beginPath(); ctx.arc(7, -5, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#233b3a'; ctx.beginPath(); ctx.arc(10, -5, 2.5, 0, Math.PI * 2); ctx.fill();
  roundRect(12, 2, 13, 6, 3, '#ee8050'); ctx.restore();
}
function frame(time) {
  const dt = last === null ? 0 : Math.min((time - last) / 1000, 0.033);
  last = time; update(dt); draw(); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
