/* ==========================================================
   app.js — Izgara, arama, FLIP sahnesi, daktilo, konfeti
   ========================================================== */
(function () {
  'use strict';

  const { createAvatar, branchCategory, hashStr } = window.Avatar;
  const MESSAGES = window.MESSAGES || {};
  const reduceMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceMotionMQ.matches;

  // ---------- Veri hazırlığı ----------
  const teachers = (window.TEACHERS || [])
    .filter((t) => t && t.name)
    .map((t) => Object.assign({}, t))
    .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, 'tr'));
  function rank(t) { return Number.isFinite(t.order) ? t.order : 100; }

  // Mesaj ataması: aynı kategoridekiler hash sırasına göre dizilir,
  // kategoriye özgü bir başlangıç ofsetiyle cümleler sırayla dağıtılır.
  (function assignMessages() {
    const groups = new Map();
    teachers.forEach((t) => {
      const cat = branchCategory(t.branch);
      const key = cat && MESSAGES[cat] ? cat : 'genel';
      t._category = key;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(t);
    });
    groups.forEach((list, key) => {
      const pool = MESSAGES[key] || MESSAGES.genel || [''];
      const offset = hashStr('kategori|' + key) % pool.length;
      list
        .slice()
        .sort((a, b) => hashStr(a.name) - hashStr(b.name) || a.name.localeCompare(b.name, 'tr'))
        .forEach((t, i) => { t._message = pool[(offset + i) % pool.length]; });
    });
  })();

  // ---------- Izgara ----------
  const grid = document.getElementById('grid');
  const emptyEl = document.getElementById('empty');
  const frag = document.createDocumentFragment();

  teachers.forEach((t, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'teacher';
    btn.setAttribute('aria-label', t.name);
    btn.dataset.index = String(i);

    const av = document.createElement('span');
    av.className = 'avatar';
    t._svg = createAvatar(t);
    av.innerHTML = t._svg;

    const nm = document.createElement('span');
    nm.className = 'name';
    nm.textContent = t.name;
    nm.setAttribute('aria-hidden', 'true');

    btn.append(av, nm);
    li.appendChild(btn);
    frag.appendChild(li);
    t._li = li;
    t._btn = btn;
  });
  grid.appendChild(frag);

  // ---------- Arama (Türkçe duyarlı) ----------
  const FOLD = { 'ı': 'i', 'ş': 's', 'ç': 'c', 'ğ': 'g', 'ö': 'o', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u' };
  function normalize(s) {
    return String(s || '')
      .toLocaleLowerCase('tr')
      .replace(/[ışçğöüâîû]/g, (c) => FOLD[c])
      .replace(/\s+/g, ' ')
      .trim();
  }
  teachers.forEach((t) => { t._search = normalize(t.name); });

  const search = document.getElementById('search');
  search.addEventListener('input', () => {
    const q = normalize(search.value);
    let visible = 0;
    teachers.forEach((t) => {
      const show = !q || t._search.includes(q);
      t._li.hidden = !show;
      if (show) visible++;
    });
    emptyEl.hidden = visible !== 0;
  });


  // ---------- Ses (Web Audio ile üretilir, dosya indirilmez) ----------
  const soundBtn = document.getElementById('sound-btn');
  let soundOn = true;
  try { soundOn = localStorage.getItem('ogretmenler-ses') !== 'kapali'; } catch (e) { /* yok say */ }
  function renderSoundBtn() {
    soundBtn.setAttribute('aria-pressed', String(soundOn));
    soundBtn.setAttribute('aria-label', soundOn ? 'Sesi kapat' : 'Sesi aç');
  }
  renderSoundBtn();
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    try { localStorage.setItem('ogretmenler-ses', soundOn ? 'acik' : 'kapali'); } catch (e) { /* yok say */ }
    renderSoundBtn();
    if (soundOn) Sound.tick();
  });

  const Sound = (function () {
    let ac = null, master = null, noiseBuf = null;
    function ctx() {
      if (!soundOn) return null;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!ac) {
        ac = new AC();
        master = ac.createGain();
        master.gain.value = 0.55;
        master.connect(ac.destination);
      }
      if (ac.state === 'suspended') ac.resume();
      return ac;
    }
    function tone(freq, start, dur, type, vol, endFreq) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, start);
      if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, start + dur);
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(vol, start + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      o.connect(g).connect(master);
      o.start(start);
      o.stop(start + dur + 0.05);
    }
    function noise() {
      if (noiseBuf) return noiseBuf;
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return noiseBuf;
    }
    return {
      // tıklama: yumuşak bir "pop" ve kısa bir çan arpeji
      open() {
        if (!ctx()) return;
        const t = ac.currentTime;
        tone(520, t, 0.12, 'sine', 0.35, 180);
        [1046.5, 1318.5, 1568, 2093].forEach((f, i) => tone(f, t + 0.08 + i * 0.075, 0.5, 'triangle', 0.12));
      },
      // konfeti: patlayan kâğıt sesi + serpilen pırıltılar
      confetti() {
        if (!ctx()) return;
        const t = ac.currentTime;
        const src = ac.createBufferSource();
        src.buffer = noise();
        const bp = ac.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(1800, t);
        bp.frequency.exponentialRampToValueAtTime(5000, t + 0.25);
        bp.Q.value = 0.8;
        const g = ac.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.7, t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        src.connect(bp).connect(g).connect(master);
        src.start(t);
        src.stop(t + 0.4);
        tone(140, t, 0.12, 'sine', 0.4, 60);
        for (let i = 0; i < 9; i++) {
          tone(1800 + Math.random() * 2600, t + 0.12 + Math.random() * 0.7, 0.18, 'sine', 0.05 + Math.random() * 0.04);
        }
      },
      close() {
        if (!ctx()) return;
        const t = ac.currentTime;
        tone(880, t, 0.14, 'sine', 0.12, 520);
      },
      tick() {
        if (!ctx()) return;
        tone(1320, ac.currentTime, 0.08, 'triangle', 0.1);
      }
    };
  })();

  // ---------- Sahne ----------
  const overlay = document.getElementById('overlay');
  const backdrop = document.getElementById('backdrop');
  const stage = document.getElementById('stage');
  const stageAvatar = document.getElementById('stage-avatar');
  const nameEl = document.getElementById('stage-name');
  const branchEl = document.getElementById('stage-branch');
  const msgEl = document.getElementById('stage-message');
  const noteEl = document.getElementById('stage-note');
  const closeBtn = document.getElementById('close-btn');
  const srMsg = document.getElementById('stage-message-sr');

  let current = null;
  let typingTimer = null;
  let busy = false;

  function flipTransform(fromRect, toRect) {
    const s = fromRect.width / toRect.width;
    const dx = fromRect.left - toRect.left;
    const dy = fromRect.top - toRect.top;
    return `translate(${dx}px, ${dy}px) scale(${s})`;
  }

  function openScene(t) {
    if (busy || current) return;
    busy = true;
    current = t;
    Sound.open();

    const srcAvatar = t._btn.querySelector('.avatar');
    const from = srcAvatar.getBoundingClientRect();

    stageAvatar.innerHTML = createAvatar(t); // benzersiz clipPath id'leri için yeniden üret
    nameEl.textContent = t.name;
    branchEl.textContent = t.title || t.branch || 'Öğretmenimiz';
    msgEl.textContent = '';
    srMsg.textContent = t._message;
    if (t.note && String(t.note).trim()) {
      noteEl.textContent = '— Emirhan\'dan özel not: ' + String(t.note).trim();
      noteEl.hidden = false;
    } else {
      noteEl.hidden = true;
      noteEl.textContent = '';
    }

    overlay.hidden = false;
    overlay.classList.remove('closing');
    document.body.classList.add('locked', 'scene-open');
    stage.scrollTop = 0;
    t._btn.classList.add('is-open');

    const to = stageAvatar.getBoundingClientRect();

    // tarayıcının ilk durumu işlemesi için bir kare bekle
    requestAnimationFrame(() => {
      overlay.classList.add('open');
      const done = () => {
        busy = false;
        closeBtn.focus({ preventScroll: true });
        typeMessage(t._message);
        stageAvatar.classList.add('cheer');
        Sound.confetti();
        burstConfetti(to.left + to.width / 2, to.top + to.height / 2);
      };
      if (reduced() || !stageAvatar.animate) {
        done();
        return;
      }
      const anim = stageAvatar.animate(
        [
          { transform: flipTransform(from, to), boxShadow: '0 1px 2px rgba(38,40,29,.06)' },
          { transform: 'none', boxShadow: '0 20px 60px rgba(38,40,29,.22)' }
        ],
        { duration: 560, easing: 'cubic-bezier(.2,.85,.25,1.05)' }
      );
      anim.onfinish = done;
      anim.oncancel = done;
    });
  }

  function closeScene() {
    if (!current || busy) return;
    busy = true;
    const t = current;
    clearTimeout(typingTimer);
    Sound.close();
    stageAvatar.classList.remove('cheer');
    overlay.classList.add('closing');
    overlay.classList.remove('open');

    const finish = () => {
      overlay.hidden = true;
      overlay.classList.remove('closing');
      stageAvatar.innerHTML = '';
      t._btn.classList.remove('is-open');
      document.body.classList.remove('locked', 'scene-open');
      current = null;
      busy = false;
      t._btn.focus({ preventScroll: true });
    };

    if (reduced() || !stageAvatar.animate) {
      finish();
      return;
    }
    const from = stageAvatar.getBoundingClientRect();
    const target = t._btn.querySelector('.avatar').getBoundingClientRect();
    const anim = stageAvatar.animate(
      [{ transform: 'none' }, { transform: flipTransform(target, from) }],
      { duration: 420, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }
    );
    anim.onfinish = () => { finish(); anim.cancel(); };
    anim.oncancel = finish;
  }

  // ---------- Daktilo ----------
  function typeMessage(text) {
    clearTimeout(typingTimer);
    msgEl.textContent = '';
    if (reduced()) {
      msgEl.textContent = text;
      return;
    }
    const textNode = document.createTextNode('');
    const caret = document.createElement('span');
    caret.className = 'caret';
    caret.setAttribute('aria-hidden', 'true');
    msgEl.append(textNode, caret);
    const chars = Array.from(text);
    let i = 0;
    const step = () => {
      if (!current) return;
      textNode.data += chars[i++];
      if (i < chars.length) {
        const ch = chars[i - 1];
        const delay = /[.,;:!?…]/.test(ch) ? 180 : 26 + Math.random() * 22;
        typingTimer = setTimeout(step, delay);
      } else {
        typingTimer = setTimeout(() => caret.remove(), 1400);
      }
    };
    typingTimer = setTimeout(step, 120);
  }

  // ---------- Etkileşimler ----------
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.teacher');
    if (!btn) return;
    openScene(teachers[Number(btn.dataset.index)]);
  });
  closeBtn.addEventListener('click', closeScene);
  backdrop.addEventListener('click', closeScene);
  stage.addEventListener('click', (e) => {
    // kartın ve avatarın dışındaki boşluk
    if (e.target === stage) closeScene();
  });
  document.addEventListener('keydown', (e) => {
    if (!current) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeScene();
    } else if (e.key === 'Tab') {
      // diyalog içinde odak tuzağı (tek odaklanabilir öğe: Kapat)
      e.preventDefault();
      closeBtn.focus();
    }
  });

  // ---------- Konfeti ----------
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  const COLORS = ['#cfc9ac', '#26281d', '#f8f8f8', '#ff5a5f', '#ffb400', '#00a699', '#3f7fff', '#ff7ab6', '#8bd450'];
  let particles = [];
  let rafId = null;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function burstConfetti(x, y) {
    if (reduced()) return;
    resizeCanvas();
    const count = window.innerWidth < 600 ? 70 : 110;
    const now = performance.now();
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5;
      const speed = 5 + Math.random() * 8;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        w: 5 + Math.random() * 6,
        h: 3 + Math.random() * 4,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.35,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        round: Math.random() < 0.3,
        born: now,
        life: 1100 + Math.random() * 400
      });
    }
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  let last = 0;
  function tick(now) {
    const dt = last ? Math.min((now - last) / 16.67, 3) : 1;
    last = now;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles = particles.filter((p) => now - p.born < p.life);
    for (const p of particles) {
      p.vy += 0.32 * dt;
      p.vx *= Math.pow(0.985, dt);
      p.vy *= Math.pow(0.985, dt);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      const age = (now - p.born) / p.life;
      ctx.globalAlpha = age > 0.7 ? Math.max(0, 1 - (age - 0.7) / 0.3) : 1;
      ctx.fillStyle = p.color;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.h * 0.8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 2)) + 1);
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (particles.length) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
      last = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }
  window.addEventListener('resize', () => { if (rafId) resizeCanvas(); });
})();
