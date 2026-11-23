/* ==========================================================
   music.js — Kodla üretilen, döngüye giren duygusal fon müziği
   Hiçbir ses dosyası yok; her şey Web Audio ile sentezlenir.

   Yapı: C majör, 66 BPM, 8 ölçülük akor yürüyüşü
   C – G/B – Am – Em/G – F – C/E – Dm7 – Gsus4→G
   24 ölçülük döngü: A melodisi → B melodisi → yalnızca arpej (nefes)
   ========================================================== */
(function (global) {
  'use strict';

  const BPM = 66;
  const BEAT = 60 / BPM;
  const BAR = BEAT * 4;

  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  // Sol el arpejleri (8'lik notalar)
  const ARP = [
    [48, 55, 60, 64, 67, 64, 60, 55], // C
    [47, 55, 59, 62, 67, 62, 59, 55], // G/B
    [45, 52, 57, 60, 64, 60, 57, 52], // Am
    [43, 50, 55, 59, 64, 59, 55, 50], // Em/G
    [41, 48, 53, 57, 60, 57, 53, 48], // F
    [40, 48, 52, 55, 60, 55, 52, 48], // C/E
    [38, 45, 50, 53, 57, 53, 50, 45], // Dm7
    [43, 50, 55, 60, 62, 59, 55, 50]  // Gsus4 → G
  ];
  // Yumuşak pad akorları
  const PAD = [
    [60, 64, 67], [59, 62, 67], [57, 60, 64], [55, 59, 64],
    [57, 60, 65], [55, 60, 64], [57, 60, 62, 65], [55, 59, 62]
  ];
  // Melodiler: [nota, başlangıç vuruşu, süre (vuruş)]
  const MEL_A = [
    [[76, 0, 1.5], [74, 1.5, 0.5], [72, 2, 1], [67, 3, 1]],
    [[74, 0, 1.5], [72, 1.5, 0.5], [71, 2, 2]],
    [[72, 0, 1], [76, 1, 1], [81, 2, 1.5], [79, 3.5, 0.5]],
    [[79, 0, 2], [76, 2, 2]],
    [[77, 0, 1.5], [76, 1.5, 0.5], [74, 2, 1], [72, 3, 1]],
    [[76, 0, 1.5], [74, 1.5, 0.5], [72, 2, 1], [67, 3, 1]],
    [[69, 0, 1], [72, 1, 1], [77, 2, 1], [76, 3, 0.5], [74, 3.5, 0.5]],
    [[74, 0, 3.5]]
  ];
  const MEL_B = [
    [[79, 0, 1], [76, 1, 0.5], [77, 1.5, 0.5], [79, 2, 2]],
    [[79, 0, 1], [74, 1, 1], [71, 2, 1], [74, 3, 1]],
    [[72, 0, 1.5], [71, 1.5, 0.5], [69, 2, 1], [76, 3, 1]],
    [[71, 0, 1], [67, 1, 1], [71, 2, 1], [76, 3, 1]],
    [[81, 0, 1.5], [79, 1.5, 0.5], [77, 2, 1], [81, 3, 1]],
    [[79, 0, 1.5], [76, 1.5, 0.5], [72, 2, 2]],
    [[74, 0, 1], [77, 1, 1], [81, 2, 1], [79, 3, 1]],
    [[77, 0, 1], [76, 1, 1], [74, 2, 2]]
  ];
  // Nefes bölümünde arada bir çan sesi
  const BELLS = [[84, 2], null, [81, 2], null, [84, 1], null, [86, 2], [83, 0]];

  function createMusic(ac, out) {
    const bus = ac.createGain();
    bus.gain.value = 0;
    const tone = ac.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 3200;
    bus.connect(tone);

    // Yapay oda yankısı (üretilmiş dürtü yanıtı)
    const verb = ac.createConvolver();
    const len = Math.floor(ac.sampleRate * 3.2);
    const ir = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    verb.buffer = ir;
    const wet = ac.createGain(); wet.gain.value = 0.42;
    const dry = ac.createGain(); dry.gain.value = 0.78;
    tone.connect(dry).connect(out);
    tone.connect(verb).connect(wet).connect(out);

    // --- Enstrümanlar ---
    function piano(m, t, dur, vel) {
      const f = mtof(m);
      const g = ac.createGain();
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(Math.min(6000, f * 6), t);
      lp.frequency.exponentialRampToValueAtTime(Math.max(400, f * 1.5), t + Math.min(2.5, dur + 1));
      const o1 = ac.createOscillator(); o1.type = 'triangle'; o1.frequency.value = f;
      const o2 = ac.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2; o2.detune.value = 3;
      const g2 = ac.createGain(); g2.gain.value = 0.25;
      o1.connect(lp); o2.connect(g2).connect(lp); lp.connect(g); g.connect(bus);
      const release = Math.max(dur, 0.4) + 1.6;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vel, t + 0.008);
      g.gain.exponentialRampToValueAtTime(vel * 0.35, t + 0.35);
      g.gain.exponentialRampToValueAtTime(0.0001, t + release);
      o1.start(t); o2.start(t);
      o1.stop(t + release + 0.05); o2.stop(t + release + 0.05);
    }
    function pad(notes, t, dur) {
      notes.forEach((m) => {
        [-6, 6].forEach((det) => {
          const o = ac.createOscillator(); o.type = 'sine';
          o.frequency.value = mtof(m - 12); o.detune.value = det;
          const g = ac.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(0.018, t + 1.4);
          g.gain.setValueAtTime(0.018, t + dur - 0.6);
          g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.8);
          o.connect(g).connect(bus);
          o.start(t); o.stop(t + dur + 0.9);
        });
      });
    }
    function bell(m, t) {
      const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = mtof(m);
      const o2 = ac.createOscillator(); o2.type = 'sine'; o2.frequency.value = mtof(m) * 2.76;
      const g = ac.createGain(), g2 = ac.createGain();
      g2.gain.value = 0.18;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.05, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3);
      o.connect(g); o2.connect(g2).connect(g); g.connect(bus);
      o.start(t); o2.start(t); o.stop(t + 3.1); o2.stop(t + 3.1);
    }

    // --- Zamanlayıcı ---
    let timer = null, nextBar = 0, barIndex = 0, playing = false;

    function scheduleBar(t, idx) {
      const chord = idx % 8;
      const section = Math.floor(idx / 8) % 3; // 0: A, 1: B, 2: nefes
      // sol el
      ARP[chord].forEach((m, i) => {
        const swing = (Math.random() - 0.5) * 0.012; // insansı küçük kaymalar
        const vel = (i === 0 ? 0.11 : 0.06) * (0.85 + Math.random() * 0.25);
        piano(m, t + i * (BEAT / 2) + swing, BEAT / 2, vel);
      });
      pad(PAD[chord], t, BAR);
      // sağ el
      if (section === 2) {
        const b = BELLS[chord];
        if (b) bell(b[0], t + b[1] * BEAT);
      } else {
        const mel = (section === 0 ? MEL_A : MEL_B)[chord];
        mel.forEach(([m, st, du]) => {
          piano(m, t + st * BEAT + (Math.random() - 0.5) * 0.01, du * BEAT, 0.16 * (0.9 + Math.random() * 0.15));
        });
      }
    }

    function tick() {
      while (nextBar < ac.currentTime + 0.6) {
        scheduleBar(nextBar, barIndex);
        nextBar += BAR;
        barIndex = (barIndex + 1) % 24;
      }
    }

    return {
      get playing() { return playing; },
      start() {
        if (playing) return;
        playing = true;
        const now = ac.currentTime;
        bus.gain.cancelScheduledValues(now);
        bus.gain.setValueAtTime(bus.gain.value, now);
        bus.gain.linearRampToValueAtTime(1, now + 3);
        if (!timer) {
          nextBar = Math.max(nextBar, now + 0.1);
          tick();
          timer = setInterval(tick, 120);
        }
      },
      stop() {
        if (!playing) return;
        playing = false;
        const now = ac.currentTime;
        bus.gain.cancelScheduledValues(now);
        bus.gain.setValueAtTime(bus.gain.value, now);
        bus.gain.linearRampToValueAtTime(0, now + 0.8);
        setTimeout(() => {
          if (!playing && timer) { clearInterval(timer); timer = null; }
        }, 900);
      },
      // sahne açıkken müziği biraz kıs
      duck(on) {
        if (!playing) return;
        const now = ac.currentTime;
        bus.gain.cancelScheduledValues(now);
        bus.gain.setValueAtTime(bus.gain.value, now);
        bus.gain.linearRampToValueAtTime(on ? 0.6 : 1, now + 0.6);
      }
    };
  }

  global.createMusic = createMusic;
})(window);
