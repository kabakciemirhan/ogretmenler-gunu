/* ==========================================================
   avatar.js — Prosedürel SVG avatar üretici (Memoji tarzı)
   Harici kütüphane yok. createAvatar(teacher) → SVG string
   ========================================================== */
(function (global) {
  'use strict';

  // ---------- Yardımcılar ----------
  function hashStr(str) {
    // FNV-1a 32-bit
    let h = 0x811c9dc5;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }
  // Aynı isimden farklı "zar atışları" üretmek için
  function pick(arr, name, salt) {
    return arr[hashStr(name + '|' + salt) % arr.length];
  }
  function trLower(s) {
    return String(s || '').trim().toLocaleLowerCase('tr');
  }
  function hexToRgb(hex) {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  }
  function mix(hex, target, amt) {
    const a = hexToRgb(hex), b = hexToRgb(target);
    return rgbToHex(a[0] + (b[0] - a[0]) * amt, a[1] + (b[1] - a[1]) * amt, a[2] + (b[2] - a[2]) * amt);
  }
  const shade = (hex, amt) => mix(hex, '#000000', amt);
  const tint = (hex, amt) => mix(hex, '#ffffff', amt);
  function luminance(hex) {
    const [r, g, b] = hexToRgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  // ---------- Paletler ----------
  const SKIN = { 'açık': '#f5d3bb', 'buğday': '#e6b38f', 'esmer': '#b97f58' };
  const HAIR = {
    'siyah': '#2b2321', 'kahverengi': '#5b3a28', 'kumral': '#8c6547', 'sarı': '#d8b46e',
    'kızıl': '#b0532d', 'gri': '#9c9a96', 'beyaz': '#e9e6df'
  };
  const OUTFIT = {
    'lacivert': '#2d3f66', 'siyah': '#2b2b2e', 'beyaz': '#f3f1ea', 'gri': '#8f9196', 'bej': '#cfc9ac',
    'krem': '#efe6d2', 'kırmızı': '#c4473f', 'bordo': '#7a2734', 'mavi': '#4b7dc1', 'açık mavi': '#9cc0e6',
    'yeşil': '#5d8b5b', 'haki': '#8a8a5c', 'sarı': '#e4bb4e', 'turuncu': '#e08a3c', 'pembe': '#e8a5b6',
    'mor': '#7d5aa7', 'lila': '#b9a4d6', 'kahverengi': '#7a5136', 'gülkurusu': '#c4907f', 'turkuaz': '#3aa6a0',
    'antrasit': '#3d3f45', 'zeytin': '#6b6b3a', 'somon': '#ef9a7f'
  };
  const OUTFIT_FALLBACK = ['#2d3f66', '#5d8b5b', '#c4473f', '#7d5aa7', '#4b7dc1', '#e08a3c', '#3aa6a0', '#7a2734', '#cfc9ac', '#8a8a5c'];
  const BG = ['#e9e4cf', '#dfe8e1', '#e3e1ef', '#f1e1d8', '#dde7ef', '#efe7cf', '#e6dfe8', '#e0ebe6', '#f0dfe2', '#e4e9d6', '#ebe2d3', '#d9e3ea', '#ece6dc', '#e2e6df'];

  const HAIR_STYLES_K = ['uzun düz', 'uzun dalgalı', 'omuz hizası', 'topuz', 'at kuyruğu', 'kâkül', 'kıvırcık'];
  const HAIR_STYLES_E = ['kısa', 'kısa', 'çok kısa', 'kel'];
  const ALL_HAIR_STYLES = ['kısa', 'çok kısa', 'kel', 'uzun düz', 'uzun dalgalı', 'omuz hizası', 'kıvırcık', 'topuz', 'at kuyruğu', 'kâkül'];

  // ---------- Branş → kategori ----------
  const BRANCH_ALIASES = [
    ['türkçe', 'Türkçe'], ['edebiyat', 'Türkçe'],
    ['matematik', 'Matematik'],
    ['fen', 'Fen Bilimleri'], ['fizik', 'Fen Bilimleri'], ['kimya', 'Fen Bilimleri'], ['biyoloji', 'Fen Bilimleri'],
    ['sosyal', 'Sosyal Bilgiler'], ['tarih', 'Sosyal Bilgiler'], ['coğrafya', 'Sosyal Bilgiler'],
    ['ingilizce', 'İngilizce'], ['almanca', 'Almanca'],
    ['din', 'Din Kültürü'],
    ['beden', 'Beden Eğitimi'], ['basketbol', 'Beden Eğitimi'], ['voleybol', 'Beden Eğitimi'], ['futbol', 'Beden Eğitimi'], ['spor', 'Beden Eğitimi'],
    ['yoga', 'Yoga'],
    ['drama', 'Drama'], ['tiyatro', 'Drama'],
    ['müzik', 'Müzik'],
    ['görsel', 'Görsel Sanatlar'], ['resim', 'Görsel Sanatlar'], ['sanat', 'Görsel Sanatlar'],
    ['bilişim', 'Bilişim Teknolojileri'], ['yazılım', 'Bilişim Teknolojileri'],
    ['teknoloji ve tasarım', 'Teknoloji ve Tasarım'], ['tasarım', 'Teknoloji ve Tasarım'],
    ['rehber', 'Rehberlik'], ['psikolojik', 'Rehberlik'],
    ['sınıf', 'Sınıf Öğretmeni'],
    ['okul öncesi', 'Okul Öncesi'], ['anaokul', 'Okul Öncesi'],
    ['müdür', 'İdare'], ['koordinatör', 'İdare'], ['kurucu', 'İdare'], ['idare', 'İdare']
  ];
  function branchCategory(branch) {
    const b = trLower(branch);
    if (!b) return null;
    for (const [key, cat] of BRANCH_ALIASES) if (b.includes(key)) return cat;
    return null;
  }

  // ---------- Rozet ikonları (24x24 yerel koordinat) ----------
  const INK = '#26281d';
  const ICONS = {
    'Türkçe': `<path d="M3 6c3-1.2 6-1.2 9 .6 3-1.8 6-1.8 9-.6v12c-3-1.2-6-1.2-9 .6-3-1.8-6-1.8-9-.6z" fill="#f3ecd8" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 6.6v12" stroke="${INK}" stroke-width="1.6"/><path d="M5.5 9.5c1.6-.5 3-.4 4.3.2M5.5 12.5c1.6-.5 3-.4 4.3.2M14.2 9.7c1.3-.6 2.7-.7 4.3-.2" stroke="${INK}" stroke-width="1" stroke-linecap="round" opacity=".55"/>`,
    'Matematik': `<path d="M4.5 7.5Q5 5.8 7.5 6h12" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M9.5 6.2c0 5-1 9.5-3 12.3" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M15.5 6.2c-.4 4.5-.3 8.5.6 11 .5 1.3 1.6 1.5 2.7.6" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/>`,
    'Fen Bilimleri': `<path d="M9.5 3.5h5M10.5 3.5v5.2L5 18.2A1.6 1.6 0 0 0 6.4 20.5h11.2a1.6 1.6 0 0 0 1.4-2.3l-5.5-9.5V3.5" fill="#fff" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/><path d="M7.3 14.2h9.4l2.3 4a1.6 1.6 0 0 1-1.4 2.3H6.4A1.6 1.6 0 0 1 5 18.2z" fill="#5fc4a0"/><circle cx="10.5" cy="17" r="1" fill="#fff"/><circle cx="13.5" cy="15.8" r=".7" fill="#fff"/><path d="M10.5 3.5v5.2L5 18.2A1.6 1.6 0 0 0 6.4 20.5h11.2a1.6 1.6 0 0 0 1.4-2.3l-5.5-9.5V3.5" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`,
    'Sosyal Bilgiler': `<circle cx="12" cy="12" r="8.5" fill="#8ec5e8" stroke="${INK}" stroke-width="1.5"/><path d="M8 7.5c2 .5 2.2 2.2 1 3.4-1.2 1-.2 2.6 1.4 2.6 1.4.1 1.2 2.3.2 3.5M15.5 5.5c-.6 1.5.6 2.4 2 2.2M17.5 13.5c-1.4-.3-2.6.5-2.3 2" stroke="#4f9a5a" stroke-width="2.2" stroke-linecap="round" fill="none"/><ellipse cx="12" cy="12" rx="8.5" ry="3.2" fill="none" stroke="${INK}" stroke-width=".8" opacity=".4"/>`,
    'İngilizce': `<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3.8V16A2.5 2.5 0 0 1 4 13.5z" fill="#fff" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><circle cx="8.5" cy="10" r="1.1" fill="${INK}"/><circle cx="12" cy="10" r="1.1" fill="${INK}"/><circle cx="15.5" cy="10" r="1.1" fill="${INK}"/>`,
    'Din Kültürü': `<path d="M14.5 4.2A8 8 0 1 0 14.5 19.8 6.4 6.4 0 1 1 14.5 4.2z" fill="#d9b25a" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/><path d="M17.5 8.6l.9 2 2.2.2-1.7 1.4.5 2.1-1.9-1.1-1.9 1.1.5-2.1-1.7-1.4 2.2-.2z" fill="#d9b25a" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/>`,
    'Beden Eğitimi': `<circle cx="12" cy="12" r="8.5" fill="#e8873a" stroke="${INK}" stroke-width="1.5"/><path d="M3.5 12h17M12 3.5v17M6 6c2.6 2.6 2.6 9.4 0 12M18 6c-2.6 2.6-2.6 9.4 0 12" stroke="${INK}" stroke-width="1.2" fill="none"/>`,
    'Müzik': `<path d="M9.5 17V5.5l9-2v11" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linejoin="round"/><path d="M9.5 9l9-2" stroke="${INK}" stroke-width="2.4"/><ellipse cx="7.3" cy="17.3" rx="2.6" ry="2" fill="${INK}" transform="rotate(-20 7.3 17.3)"/><ellipse cx="16.3" cy="14.8" rx="2.6" ry="2" fill="${INK}" transform="rotate(-20 16.3 14.8)"/>`,
    'Görsel Sanatlar': `<path d="M12 3.5c-5 0-8.5 3.6-8.5 8 0 4.6 3.8 8.5 8.4 8.5 1.4 0 2-.9 2-1.8 0-1.4-1.3-1.7-1.3-3 0-1 .8-1.7 1.9-1.7h2.3c2.2 0 3.7-1.7 3.7-3.6 0-3.5-3.8-6.4-8.5-6.4z" fill="#efe3c6" stroke="${INK}" stroke-width="1.5"/><circle cx="8" cy="10" r="1.5" fill="#d6463e"/><circle cx="11.2" cy="7.2" r="1.5" fill="#e4b43c"/><circle cx="15.3" cy="7.8" r="1.5" fill="#4b7dc1"/><circle cx="8" cy="14.2" r="1.5" fill="#5d8b5b"/>`,
    'Bilişim Teknolojileri': `<rect x="5" y="5.5" width="14" height="9.5" rx="1.4" fill="#cfe3f3" stroke="${INK}" stroke-width="1.6"/><path d="M2.5 17.5h19l-1.2 1.6H3.7z" fill="${INK}"/><path d="M9.5 9l-1.8 1.4 1.8 1.4M14.5 9l1.8 1.4-1.8 1.4" stroke="${INK}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`,
    'Teknoloji ve Tasarım': `<rect x="2.5" y="14" width="19" height="5" rx="1" fill="#e4bb4e" stroke="${INK}" stroke-width="1.3"/><path d="M5.5 14v2M8.5 14v2.8M11.5 14v2M14.5 14v2.8M17.5 14v2" stroke="${INK}" stroke-width="1"/><g transform="rotate(45 13 7)"><rect x="5" y="5.6" width="13" height="2.8" rx=".6" fill="#4b7dc1" stroke="${INK}" stroke-width="1.1"/><path d="M18 5.6l2.6 1.4L18 8.4z" fill="#f3ddb8" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/></g>`,
    'Rehberlik': `<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" fill="#e0586a" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 9.5a2 2 0 0 1 2-1.4" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".7"/>`,
    'Sınıf Öğretmeni': `<path d="M12 7.5c-1.8-1.2-6.5-1.2-6.8 4 0 4.2 3 8 5 8 .7 0 1.1-.4 1.8-.4s1.1.4 1.8.4c2 0 5-3.8 5-8-.3-5.2-5-5.2-6.8-4z" fill="#d8453d" stroke="${INK}" stroke-width="1.4"/><path d="M12 7.5c0-1.6.4-3 1.5-4" stroke="${INK}" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M13 5.5c1.4-1.6 3.6-1.6 4.4-1-.8 1.4-2.8 2-4.4 1z" fill="#5d8b5b"/>`,
    'Okul Öncesi': `<rect x="3" y="12" width="8" height="8" rx="1" fill="#e4bb4e" stroke="${INK}" stroke-width="1.3"/><rect x="13" y="12" width="8" height="8" rx="1" fill="#4b7dc1" stroke="${INK}" stroke-width="1.3"/><rect x="8" y="4" width="8" height="8" rx="1" fill="#d8453d" stroke="${INK}" stroke-width="1.3"/><path d="M5.5 16h3M17 14.2v3.6M15.2 16h3.6M10.5 10l1.5-3.5 1.5 3.5" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round"/>`,
    'Drama': `<path d="M4 5.5c3 1 7 1 10 0v6c0 3.4-2.2 6-5 6s-5-2.6-5-6z" fill="#f3ecd8" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/><path d="M6.3 9.2l1.4-.4M10.3 8.8l1.4.4M6.8 12.6c1.3 1.3 3.1 1.3 4.4 0" stroke="${INK}" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M15.3 8.4c1.6.3 3.2.2 4.7-.4v5.6c0 3-1.8 5.4-4.4 5.6" fill="#e0586a" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/><path d="M16.3 16.3c.9-.8 2-.8 2.8 0" stroke="${INK}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`,
    'Yoga': `<path d="M12 4.5c2 2.2 2.6 5.5 0 9.5-2.6-4-2-7.3 0-9.5z" fill="#e8a5b6" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/><path d="M12 14c-1.5-3.5-4.5-5-7.5-4.6.2 3.6 3.6 5.8 7.5 4.6zM12 14c1.5-3.5 4.5-5 7.5-4.6-.2 3.6-3.6 5.8-7.5 4.6z" fill="#f1c3cf" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/><path d="M5 17.5c4.5 1.6 9.5 1.6 14 0" stroke="#5d8b5b" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
    'İdare': null // yıldız
  };
  ICONS['Almanca'] = ICONS['İngilizce'];
  const STAR = `<path d="M12 3.2l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L12 16.5l-5.4 2.9 1.2-5.9-4.4-4.1 6-.7z" fill="#e4bb4e" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`;

  // ---------- Özelliklerin çözümlenmesi ----------
  const usedSignatures = new Map(); // imza → isim (birebir aynı avatar olmasın)

  function resolveTraits(t) {
    const name = t.name || 'Öğretmen';
    const gender = (t.gender === 'E' || t.gender === 'K') ? t.gender : pick(['K', 'E'], name, 'g');

    const skinKey = SKIN[trLower(t.skin)] ? trLower(t.skin) : pick(['açık', 'açık', 'buğday', 'buğday', 'esmer'], name, 'skin');
    const hairKey = HAIR[trLower(t.hairColor)] ? trLower(t.hairColor) : pick(['siyah', 'kahverengi', 'kahverengi', 'kumral', 'siyah', 'sarı'], name, 'hc');
    let style = trLower(t.hairStyle);
    if (style === 'kakül') style = 'kâkül';
    if (!ALL_HAIR_STYLES.includes(style)) style = pick(gender === 'K' ? HAIR_STYLES_K : HAIR_STYLES_E, name, 'hs');

    const glassesOpts = ['yok', 'var', 'yuvarlak', 'kalın çerçeve'];
    let glasses = trLower(t.glasses);
    if (!glassesOpts.includes(glasses)) glasses = pick(['yok', 'yok', 'yok', 'var'], name, 'gl');

    const fhOpts = ['yok', 'kirli sakal', 'sakal', 'bıyık', 'keçi sakalı'];
    let facial = trLower(t.facialHair);
    if (!fhOpts.includes(facial)) facial = gender === 'E' ? pick(['yok', 'kirli sakal', 'yok', 'sakal'], name, 'fh') : 'yok';

    let outfit = trLower(t.outfitColor);
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(outfit)) outfit = outfit;
    else if (OUTFIT[outfit]) outfit = OUTFIT[outfit];
    else outfit = pick(OUTFIT_FALLBACK, name, 'oc');

    const ex = trLower(t.extra);
    const has = (w) => ex.includes(w);
    const extras = {
      ruj: has('ruj'), kupe: has('küpe'), sapka: has('şapka'), atki: has('atkı'), kravat: has('kravat'),
      papyon: has('papyon'), tesettur: has('tesettür') || has('eşarp') || has('başörtü'), kolye: has('kolye')
    };

    const category = branchCategory(t.branch);
    let bgIndex = hashStr(name + '|bg') % BG.length;

    // Birebir aynı avatar çıkmasın: imza çakışırsa arka planı kaydır
    const baseSig = [gender, skinKey, hairKey, style, glasses, facial, outfit, JSON.stringify(extras), category].join('/');
    for (let tries = 0; tries < BG.length; tries++) {
      const sig = baseSig + '/' + bgIndex;
      const owner = usedSignatures.get(sig);
      if (!owner || owner === name) { usedSignatures.set(sig, name); break; }
      bgIndex = (bgIndex + 1) % BG.length;
    }

    return {
      name, gender, category,
      skin: SKIN[skinKey], hair: HAIR[hairKey], hairKey, style, glasses, facial, outfit, extras,
      bg: BG[bgIndex]
    };
  }

  // ---------- Çizim parçaları ----------
  // Kafa: merkez (100,95) rx 44 ry 48
  const HEAD = { cx: 100, cy: 95, rx: 44, ry: 48 };

  function hairBack(tr) {
    const c = tr.hair, d = shade(tr.hair, 0.18);
    switch (tr.style) {
      case 'uzun düz':
        return `<path d="M48 96C44 50 74 36 100 36s56 14 52 60l6 84q-58 12-116 0z" fill="${c}"/>
                <path d="M140 100l8 78q-6 1-12 2z" fill="${d}" opacity=".35"/>`;
      case 'uzun dalgalı':
        return `<path d="M46 96C42 48 74 34 100 34s58 14 54 62q12 20 0 40q14 22-2 44q-52 12-104 0q-16-22-2-44q-12-20 0-40z" fill="${c}"/>
                <path d="M152 136q14 22-2 44q-6 1-10 2q10-24 0-46z" fill="${d}" opacity=".35"/>`;
      case 'omuz hizası':
        return `<path d="M48 96C44 50 74 37 100 37s56 13 52 59l4 56q-12 8-26 2H70q-14 6-26-2z" fill="${c}"/>`;
      case 'kâkül':
        return `<path d="M48 96C44 50 74 37 100 37s56 13 52 59l2 46q-10 7-22 3H70q-12 4-22-3z" fill="${c}"/>`;
      case 'kıvırcık': {
        let s = '';
        const n = 15;
        for (let i = 0; i < n; i++) {
          const a = Math.PI * (0.92 + (1.16 * i) / (n - 1)); // sol alt → üst → sağ alt
          const x = 100 + 56 * Math.cos(a), y = 92 + 54 * Math.sin(a);
          s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="17" fill="${c}"/>`;
        }
        // omuza inen bukleler
        [[48, 128], [152, 128], [50, 148], [150, 148], [58, 160], [142, 160]].forEach(([x, y]) => {
          s += `<circle cx="${x}" cy="${y}" r="15" fill="${c}"/>`;
        });
        s += `<circle cx="100" cy="86" r="52" fill="${c}"/>`;
        return s;
      }
      case 'topuz':
        return `<circle cx="100" cy="40" r="21" fill="${c}"/><path d="M84 38q16-10 32 0" stroke="${d}" stroke-width="2.5" fill="none" opacity=".5"/>`;
      case 'at kuyruğu':
        return `<path d="M128 56C172 62 176 116 160 166C150 134 146 104 124 80z" fill="${c}"/>
                <path d="M152 92C160 112 160 136 160 166" stroke="${d}" stroke-width="3" fill="none" opacity=".4"/>`;
      default:
        return '';
    }
  }

  function hairFront(tr) {
    const c = tr.hair, hl = tint(tr.hair, 0.18), d = shade(tr.hair, 0.2);
    switch (tr.style) {
      case 'kel':
        // yanlarda ve ensede ince saç
        return `<path d="M55 106c-1-10 0-18 3-24 3 6 4 14 4 22z" fill="${c}" opacity=".9"/>
                <path d="M145 106c1-10 0-18-3-24-3 6-4 14-4 22z" fill="${c}" opacity=".9"/>
                <ellipse cx="84" cy="58" rx="12" ry="6" fill="#fff" opacity=".22" transform="rotate(-20 84 58)"/>`;
      case 'çok kısa':
        return `<path d="M56 98C53 58 76 44 100 44s47 14 44 54c-3-16-8-26-18-32-16-5-36-5-52 0-10 6-15 16-18 32z" fill="${c}"/>
                <path d="M70 54q30-12 60 0" stroke="${hl}" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>`;
      case 'kısa':
        return `<path d="M52 102C45 52 74 34 102 35c29 1 52 19 46 67-3-16-8-26-16-32-14 3-30 0-44-6-10 4-17 10-22 18-6 6-10 13-14 20z" fill="${c}"/>
                <path d="M66 58q22-16 50-12" stroke="${hl}" stroke-width="3.5" fill="none" opacity=".35" stroke-linecap="round"/>`;
      case 'uzun düz':
      case 'omuz hizası':
        return `<path d="M54 124C47 60 74 40 100 41c26-1 53 19 46 83-3-24-10-44-30-58-8-4-14-7-16-11-2 4-8 7-16 11-20 14-27 34-30 58z" fill="${c}"/>
                <path d="M96 46q-26 4-34 34" stroke="${hl}" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>`;
      case 'uzun dalgalı':
        return `<path d="M53 126C45 60 74 38 100 39c26-1 55 21 47 87-2-12-4-22-9-30q4-12-6-22c-6-8-18-14-28-20-4 5-12 10-22 14-12 6-18 16-16 26-6 9-9 20-12 32z" fill="${c}"/>
                <path d="M94 44q-24 6-32 30" stroke="${hl}" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>`;
      case 'kâkül':
        return `<path d="M51 118C44 56 74 37 100 37s56 19 49 81c-2-16-4-28-8-38q-2-3-5-3-36 3-72 0-3 0-5 3c-4 10-6 22-8 38z" fill="${c}"/>
                <path d="M66 77v-8M78 78v-9M90 78v-9M102 78v-9M114 78v-9M126 78v-9" stroke="${d}" stroke-width="1.6" opacity=".35" stroke-linecap="round"/>`;
      case 'kıvırcık': {
        let s = '';
        [[66, 62, 14], [82, 54, 15], [100, 51, 15], [118, 54, 15], [134, 62, 14], [58, 78, 12], [142, 78, 12], [74, 66, 10], [126, 66, 10], [100, 62, 11]].forEach(([x, y, r]) => {
          s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
        });
        [[82, 50], [104, 47], [124, 52]].forEach(([x, y]) => {
          s += `<path d="M${x - 5} ${y}q5-5 10 0" stroke="${hl}" stroke-width="2" fill="none" opacity=".45" stroke-linecap="round"/>`;
        });
        return s;
      }
      case 'topuz':
      case 'at kuyruğu':
        return `<path d="M55 106C49 58 75 41 100 41s51 17 45 65c-3-20-12-36-26-42-12-4-26-4-38 0-14 6-23 22-26 42z" fill="${c}"/>
                <path d="M100 43q-2 12 0 20" stroke="${d}" stroke-width="1.6" opacity=".4" fill="none"/>
                <path d="M84 48q-16 6-22 24" stroke="${hl}" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>`;
      default:
        return '';
    }
  }

  function facialHair(tr, clipId) {
    const c = tr.hair === HAIR['sarı'] ? shade(tr.hair, 0.15) : tr.hair;
    const mustache = `<path d="M84 121.5c4-5.5 10-6 16-3 6-3 12-2.5 16 3-5-1.5-10-1.5-16 .5-6-2-11-2-16-.5z" fill="${c}"/>`;
    let s = '';
    switch (tr.facial) {
      case 'kirli sakal':
        s = `<path d="M54 96c2 26 16 46 46 48 30-2 44-22 46-48h4v60H50z" fill="${c}" opacity=".28"/>
             <path d="M84 121c5-4 11-4 16-2 5-2 11-2 16 2-5 0-11 0-16 1-5-1-11-1-16-1z" fill="${c}" opacity=".35"/>`;
        break;
      case 'sakal':
        s = `<path d="M55 92h5c1 18 8 30 22 33 6-2 12-2 18 0 6-2 12-2 18 0 14-3 21-15 22-33h5v62H55z" fill="${c}"/>
             <path d="M88 131q12 6 24 0" stroke="${shade(c, 0.25)}" stroke-width="1.2" fill="none" opacity=".4"/>` + mustache;
        break;
      case 'bıyık':
        s = mustache;
        break;
      case 'keçi sakalı':
        s = `<path d="M54 96c2 26 16 46 46 48 30-2 44-22 46-48h4v60H50z" fill="${c}" opacity=".18"/>
             <path d="M90 133q10-4 20 0q0 10-10 11q-10-1-10-11z" fill="${c}"/>` + mustache;
        break;
    }
    return s ? `<g clip-path="url(#${clipId})">${s}</g>` : '';
  }

  function glasses(tr) {
    const frame = tr.glasses === 'kalın çerçeve' ? '#26281d' : '#4a4a4a';
    const lens = `fill="#ffffff" fill-opacity=".18"`;
    const armL = tr.extras.tesettur ? 61 : 57, armR = tr.extras.tesettur ? 139 : 143;
    switch (tr.glasses) {
      case 'var':
        return `<g stroke="${frame}" stroke-width="2.2" fill="none">
          <rect x="69" y="91" width="26" height="18" rx="6" ${lens}/><rect x="105" y="91" width="26" height="18" rx="6" ${lens}/>
          <path d="M95 98q5-3 10 0M69 96L${armL} 93M131 96L${armR} 93"/></g>`;
      case 'yuvarlak':
        return `<g stroke="#8a6a3a" stroke-width="2.2" fill="none">
          <circle cx="82" cy="100" r="12" ${lens}/><circle cx="118" cy="100" r="12" ${lens}/>
          <path d="M94 98q6-4 12 0M70 98L${armL} 94M130 98L${armR} 94"/></g>`;
      case 'kalın çerçeve':
        return `<g stroke="${frame}" stroke-width="4.2" fill="none" stroke-linejoin="round">
          <rect x="67" y="89" width="29" height="21" rx="5" ${lens}/><rect x="104" y="89" width="29" height="21" rx="5" ${lens}/>
          <path d="M96 97q4-3 8 0M67 95L${armL} 92M133 95L${armR} 92"/></g>`;
      default:
        return '';
    }
  }

  function outfit(tr) {
    const o = tr.outfit, od = shade(o, 0.14), ol = tint(o, 0.12);
    let s = `<path d="M26 206C26 168 58 152 100 152s74 16 74 54z" fill="${o}"/>
             <path d="M26 206C26 180 40 164 62 157c-8 14-10 30-10 49z" fill="${od}" opacity=".5"/>
             <path d="M174 206c0-26-14-42-36-49 8 14 10 30 10 49z" fill="${ol}" opacity=".35"/>`;
    if (tr.gender === 'E') {
      const shirt = luminance(o) > 0.75 ? '#dfe8f3' : '#f6f4ef';
      s += `<path d="M84 151L100 182 116 151z" fill="${shirt}"/>
            <path d="M84 151l9 14 7-11zM116 151l-9 14-7-11z" fill="${tint(shirt, 0.3)}" stroke="${shade(shirt, 0.12)}" stroke-width=".8"/>`;
    } else {
      s += `<path d="M80 151q20 26 40 0z" fill="${tr.skin}"/>
            <path d="M80 151q20 26 40 0" stroke="${od}" stroke-width="2" fill="none" opacity=".5"/>`;
    }
    return s;
  }

  function accessoriesBody(tr) {
    const e = tr.extras;
    let s = '';
    if (e.kolye) {
      s += `<path d="M86 152q14 18 28 0" stroke="#d4af5a" stroke-width="1.6" fill="none"/><circle cx="100" cy="162" r="3" fill="#d4af5a" stroke="#a8843a" stroke-width=".8"/>`;
    }
    if (e.kravat) {
      s += `<path d="M96 160h8l-1.5 5 4.5 28-7 8-7-8 4.5-28z" fill="#3a3f63"/><path d="M96 154h8l1 6h-10z" fill="#2c3050"/>`;
    }
    if (e.papyon) {
      s += `<path d="M100 158l-13-7v14zM100 158l13-7v14z" fill="#b8323f"/><rect x="96" y="154.5" width="8" height="7" rx="2" fill="#93222f"/>`;
    }
    if (e.atki) {
      const sc = tr.outfit && luminance(tr.outfit) < 0.4 ? '#cfc9ac' : '#b8323f';
      s += `<path d="M70 146q30 18 60 0l4 12q-34 20-68 0z" fill="${sc}"/><path d="M110 156l6 34 12-2-6-36z" fill="${shade(sc, 0.12)}"/>`;
    }
    return s;
  }

  // Türban: yalnızca saçı örter; yüz, boyun ve omuzlar açıkta kalır.
  function hijabBack(tr) {
    const base = tr.outfit && luminance(tr.outfit) > 0.85 ? '#cfc9ac' : tint(tr.outfit, 0.1);
    tr._hijab = base;
    const d = shade(base, 0.14);
    return `<path d="M47 102C43 48 74 31 100 31s57 17 53 71c0 10-3 18-8 24q-6 6-12 6H67q-6 0-12-6c-5-6-8-14-8-24z" fill="${base}"/>
            <path d="M136 120c14 6 22 22 22 40-8-6-14-16-26-26z" fill="${d}"/>
            <path d="M132 128c6 10 8 22 6 34-6-8-10-18-12-30z" fill="${base}"/>`;
  }
  function hijabFront(tr) {
    const c = tr._hijab, d = shade(c, 0.14), l = tint(c, 0.25);
    return `<path d="M51 122C44 58 74 37 100 37s56 21 49 85c-2 4-7 5-10 2 0-26-7-48-22-58-10-5-24-5-34 0-15 10-22 32-22 58-3 3-8 2-10-2z" fill="${c}"/>
            <path d="M61 122c0-26 7-46 22-56 10-5 24-5 34 0 15 10 22 30 22 56" stroke="${d}" stroke-width="2" fill="none" opacity=".55"/>
            <path d="M70 52q30-16 62 2" stroke="${l}" stroke-width="3.5" fill="none" opacity=".45" stroke-linecap="round"/>
            <path d="M58 92q-2 14 0 26M142 92q2 14 0 26" stroke="${d}" stroke-width="1.6" fill="none" opacity=".4"/>`;
  }

  function hat(tr) {
    const c = '#6b4f3a';
    return `<path d="M52 76C52 34 148 34 148 76z" fill="${c}"/><path d="M42 78q58-12 116 0l-2 8q-56-10-112 0z" fill="${shade(c, 0.2)}"/>
            <path d="M54 70q46-8 92 0" stroke="#cfc9ac" stroke-width="5" fill="none"/>`;
  }

  function face(tr) {
    const brow = luminance(tr.hair) > 0.6 ? shade(tr.hair, 0.45) : shade(tr.hair, 0.05);
    const lip = tr.extras.ruj ? '#b8324a' : shade(tr.skin, 0.42);
    let s = '';
    // kaşlar
    s += `<path d="M72 86q9-6 18-1" stroke="${brow}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
          <path d="M110 85q9-5 18 1" stroke="${brow}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
    // gözler
    s += `<g class="av-eyes"><ellipse cx="82" cy="100" rx="5.4" ry="6.8" fill="#2b2420"/><ellipse cx="118" cy="100" rx="5.4" ry="6.8" fill="#2b2420"/>
          <circle cx="84" cy="97.5" r="1.9" fill="#fff"/><circle cx="120" cy="97.5" r="1.9" fill="#fff"/>`;
    if (tr.gender !== 'K') s += `</g>`;
    if (tr.gender === 'K') {
      s += `<path d="M75.5 96.5l-3-2M124.5 96.5l3-2" stroke="#2b2420" stroke-width="1.6" stroke-linecap="round"/></g>`;
    }
    // burun
    s += `<path d="M98 105q-4 7 1 9 3 1 5-1" stroke="${shade(tr.skin, 0.25)}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    // yanaklar
    s += `<ellipse cx="70" cy="115" rx="8" ry="5" fill="#f08a8a" opacity=".22"/><ellipse cx="130" cy="115" rx="8" ry="5" fill="#f08a8a" opacity=".22"/>`;
    // gülümseme
    s += `<path d="M86 123.5q14 15 28 0q-14 4-28 0z" fill="${tr.extras.ruj ? lip : '#7a3434'}"/>
          <path d="M89 124.6q11 3 22 0l-1.5 2.2q-9.5 2.2-19 0z" fill="#fff" opacity=".9"/>`;
    if (tr.extras.ruj) {
      s += `<path d="M86 123.5q14 15 28 0" stroke="${lip}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    }
    return s;
  }

  let uidCounter = 0;

  function createAvatar(teacher, opts) {
    opts = opts || {};
    const tr = resolveTraits(teacher || {});
    const uid = 'av' + (++uidCounter) + '_' + hashStr(tr.name).toString(36);
    const skin = tr.skin, skinD = shade(skin, 0.1), skinL = tint(skin, 0.12);
    const hijab = tr.extras.tesettur;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-hidden="true" focusable="false" class="avatar-svg" style="--d:-${(hashStr(tr.name + '|anim') % 4000) / 1000}s;--bd:-${(hashStr(tr.name + '|blink') % 5000) / 1000}s">`;
    svg += `<defs>
      <clipPath id="c${uid}"><circle cx="100" cy="100" r="100"/></clipPath>
      <clipPath id="h${uid}"><ellipse cx="${HEAD.cx}" cy="${HEAD.cy}" rx="${HEAD.rx}" ry="${HEAD.ry}"/></clipPath>
      <radialGradient id="g${uid}" cx="42%" cy="34%" r="70%"><stop offset="0" stop-color="${skinL}"/><stop offset=".65" stop-color="${skin}"/><stop offset="1" stop-color="${skinD}"/></radialGradient>
      <radialGradient id="b${uid}" cx="35%" cy="25%" r="85%"><stop offset="0" stop-color="${tint(tr.bg, 0.35)}"/><stop offset="1" stop-color="${tr.bg}"/></radialGradient>
    </defs>`;
    svg += `<g clip-path="url(#c${uid})">`;
    svg += `<rect width="200" height="200" fill="url(#b${uid})"/>`;

    // Baş grubu (saç arkası + kafa) aynı gecikmeyle hafifçe sallanır
    svg += `<g class="av-bob av-back">` + (hijab ? hijabBack(tr) : hairBack(tr)) + `</g>`;
    svg += `<g class="av-body">` + outfit(tr);
    // boyun
    svg += `<path d="M85 126h30v26q-15 10-30 0z" fill="${skinD}"/><path d="M85 130q15 12 30 0v-4H85z" fill="${shade(skin, 0.2)}" opacity=".35"/>`;
    svg += accessoriesBody(tr) + `</g>`;
    svg += `<g class="av-bob av-head">`;
    // kulaklar
    if (!hijab) {
      svg += `<ellipse cx="56" cy="101" rx="8" ry="10" fill="${skinD}"/><ellipse cx="144" cy="101" rx="8" ry="10" fill="${skinD}"/>
              <ellipse cx="57" cy="101" rx="4" ry="6" fill="${shade(skin, 0.18)}" opacity=".5"/><ellipse cx="143" cy="101" rx="4" ry="6" fill="${shade(skin, 0.18)}" opacity=".5"/>`;
    }
    // kafa
    svg += `<ellipse cx="${HEAD.cx}" cy="${HEAD.cy}" rx="${HEAD.rx}" ry="${HEAD.ry}" fill="url(#g${uid})"/>`;
    svg += facialHair(tr, 'h' + uid);
    if (hijab) svg += hijabFront(tr);
    else svg += hairFront(tr);
    if (tr.extras.kupe && !hijab) {
      svg += `<circle cx="55" cy="115" r="3.6" fill="none" stroke="#d4af5a" stroke-width="2"/><circle cx="145" cy="115" r="3.6" fill="none" stroke="#d4af5a" stroke-width="2"/>`;
    }
    svg += face(tr);
    svg += glasses(tr);
    if (tr.extras.sapka && !hijab) svg += hat(tr);
    svg += `</g>`;
    svg += `</g>`;

    // rozet
    if (opts.badge !== false) {
      const icon = (tr.category && ICONS[tr.category]) || STAR;
      svg += `<g transform="translate(150 150)"><g class="avatar-badge">
        <circle cx="21" cy="22" r="22" fill="#000" opacity=".12"/>
        <circle cx="21" cy="21" r="22" fill="#ffffff"/>
        <circle cx="21" cy="21" r="22" fill="none" stroke="#cfc9ac" stroke-width="2"/>
        <g transform="translate(6.6 6.6) scale(1.2)">${icon}</g>
      </g></g>`;
    }
    svg += `</svg>`;
    return svg;
  }

  global.Avatar = { createAvatar, branchCategory, hashStr, trLower };
  global.createAvatar = createAvatar;
})(window);
