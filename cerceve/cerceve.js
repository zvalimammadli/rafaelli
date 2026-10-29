/* Rafaelli — "Çərçivə ilə bax": rəsmi real ölçüsündə seçilmiş çərçivənin içində göstərir.
   Düymə: <button class="frame-open" data-w="40" data-h="60" data-src="..." data-title="...">
   (data-w / data-h — rəsmin eni və hündürlüyü, sm). Çərçivələr: cerceveler.js */
(function () {
  var btn = document.querySelector('.frame-open');
  if (!btn || !window.RAFAELLI_FRAMES) return;
  var EN = (document.documentElement.lang || 'az').slice(0, 2) === 'en';
  var T = EN ? {
    title: 'See it framed', none: 'No frame', noneSub: 'Canvas only', all: 'All', qizili: 'Gold', gumusu: 'Silver', qara: 'Black', krem: 'Cream', qehveyi: 'Brown', rengli: 'Colour',
    frame: 'Frame', options: 'Options', mat: 'Add a 5 cm mount', matColor: 'Mount colour', wall: 'Wall colour', art: 'Painting', framed: 'Framed size',
    profile: 'Profile', code: 'Code', close: 'Close', cta: 'Send by email', ctaIg: 'Send on Instagram', unit: 'cm',
    note: 'Frame codes and profile sizes are from the Xətai Art Centre catalogue. Colours and patterns are drawn from the catalogue photos; the exact finish is confirmed with your order.',
    ctaNote: 'Estimated price; we will confirm the final price by email.',
    priceT: 'Frame price (painting not included)', frameL: 'Frame', matL: 'Mount', labor: 'workshop fee', none0: 'No frame selected', est: 'estimate',
    msg: function (t, f, mat, size, pr) { return 'Hello! I am interested in “' + t + '” ' + (f ? 'with frame code ' + f.code + ' – ' + f.en + ' (profile ' + f.w + '×' + f.d + ' mm' + (mat ? ', 5 cm ' + mat + ' mount' : '') + '), framed size ' + size + ' cm' + (pr ? ', estimated frame price ' + pr : '') + '.' : 'without a frame.') + ' Could you tell me the total price?'; }
  } : {
    title: 'Çərçivə ilə bax', none: 'Çərçivəsiz', noneSub: 'Yalnız kətan', all: 'Hamısı', qizili: 'Qızılı', gumusu: 'Gümüşü', qara: 'Qara', krem: 'Krem', qehveyi: 'Qəhvəyi', rengli: 'Rəngli',
    frame: 'Çərçivə', options: 'Əlavələr', mat: '5 sm paspartu əlavə et', matColor: 'Paspartu rəngi', wall: 'Divar rəngi', art: 'Rəsm', framed: 'Çərçivəli ölçü',
    profile: 'Profil', code: 'Kod', close: 'Bağla', cta: 'E-poçtla göndər', ctaIg: 'Instagram-da göndər', unit: 'sm',
    note: 'Çərçivə kodları və profil ölçüləri Xətai Sənət Mərkəzinin kataloqundandır. Rəng və naxışlar kataloq şəkillərinə əsasən çəkilib, dəqiq görünüş sifarişdə təsdiqlənir.',
    ctaNote: 'Qiymət təxminidir, dəqiq qiyməti e-poçtla təsdiqləyəcəyik.',
    priceT: 'Çərçivənin qiyməti (rəsm daxil deyil)', frameL: 'Çərçivə', matL: 'Paspartu', labor: 'iş haqqı', none0: 'Çərçivə seçilməyib', est: 'təxmini',
    msg: function (t, f, mat, size, pr) { return 'Salam! «' + t + '» əsəri ilə ' + (f ? 'kod ' + f.code + ' («' + f.az + '») çərçivə ilə (profil ' + f.w + '×' + f.d + ' mm' + (mat ? ', 5 sm ' + mat + ' paspartu' : '') + ', çərçivəli ölçü ' + size + ' sm' + (pr ? ', təxmini çərçivə qiyməti ' + pr : '') + ') maraqlanıram.' : 'çərçivəsiz maraqlanıram.') + ' Ümumi qiyməti bildirə bilərsiniz?'; }
  };

  var FRAMES = window.RAFAELLI_FRAMES.filter(function (f) { return !f.hidden; });
  var FILTERS = [['all', T.all, function () { return true; }]].concat(['qizili', 'gumusu', 'qara', 'krem', 'qehveyi', 'rengli']
    .filter(function (k) { return FRAMES.some(function (f) { return f.fam === k; }); })
    .map(function (k) { return [k, T[k], function (f) { return f.fam === k; }]; }));
  var nameOf = function (f) { return (EN ? f.en : f.az) || (T.code + ' ' + f.code); };
  var WALLS = ['#ECE7DE', '#CFDDC3', '#8C948E', '#9C3D33', '#2E2B28'];
  var MAT = 50; // mm
  var MATS = [['#F6F3EC', 'ağ', 'white'], ['#EFE6D2', 'fil sümüyü', 'ivory'], ['#E2D8C3', 'bej', 'beige'], ['#C9CACB', 'açıq boz', 'light grey'],
    ['#4A4B4D', 'antrasit', 'charcoal'], ['#1E1E1F', 'qara', 'black'], ['#1F2E4A', 'tünd göy', 'navy'], ['#2F4A3A', 'tünd yaşıl', 'forest green'], ['#6E2430', 'bordo', 'burgundy']];
  var PR = window.RAFAELLI_FRAME_PRICING || { labor: 8, matPerM2: 45, matCut: 5 };
  function priceOf(f, mat) {
    var m = mat ? MAT : 0, iW = art.W + 2 * m, iH = art.H + 2 * m, out = { frame: 0, len: 0, mat: 0 };
    if (f && f.price) { out.len = (2 * (iW + iH) + 8 * f.w) / 1000; out.frame = Math.round(out.len * f.price + PR.labor); }
    if (mat) out.mat = Math.round((iW * iH - art.W * art.H) / 1e6 * PR.matPerM2 + PR.matCut);
    out.total = out.frame + out.mat; return out;
  }
  var azn = function (v) { return v.toLocaleString(EN ? 'en-GB' : 'az-AZ') + '\u00a0₼'; };
  var art = { W: +btn.dataset.w * 10, H: +btn.dataset.h * 10, title: btn.dataset.title || '' };
  var st = { frame: FRAMES.filter(function (f) { return f.code === '5514'; })[0] || FRAMES[0], filter: 'all', mat: false, matColor: MATS[0], wall: WALLS[0] };
  var img = new Image(); img.src = btn.dataset.src;

  /* ---------- drawing ---------- */
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shade(hex, k) { var n = parseInt(hex.slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    function m(c) { return Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k); } return 'rgb(' + m(r) + ',' + m(g) + ',' + m(b) + ')'; }
  var PROFILES = {
    flat: [[0, -.3], [.06, .18], [.13, 0], [.86, 0], [.93, .14], [1, -.4]],
    rounded: [[0, -.4], [.14, .04], [.38, .24], [.6, .04], [.84, -.18], [.92, .16], [1, -.45]],
    cove: [[0, -.25], [.08, .22], [.18, -.3], [.42, -.18], [.66, .06], [.82, .26], [.9, -.08], [1, -.45]],
    stepped: [[0, -.45], [.07, .22], [.14, -.12], [.28, .2], [.4, -.02], [.52, -.12], [.6, .16], [.7, 0], [.8, -.2], [.87, .26], [.94, .04], [1, -.5]]
  };
  function rgba(hex, a) { var n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function paintSide(ctx, L, w, f, r) {
    var base = f.color || '#8B6B4A', acc = f.accent || shade(base, -.4), i, x, y;
    ctx.fillStyle = base; ctx.fillRect(0, 0, L, w);
    /* surface */
    if (f.finish === 'metal') {
      for (i = 0; i < Math.max(14, w * 1.2); i++) { ctx.fillStyle = r() < .5 ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.07)'; ctx.fillRect(0, r() * w, L, Math.max(.4, w / 120)); }
    } else if (f.finish === 'mermer') {
      for (i = 0; i < L / (w * .18); i++) {
        ctx.save(); ctx.translate(r() * L, r() * w); ctx.rotate((r() - .5) * .5);
        ctx.fillStyle = r() < .55 ? rgba(acc, .22 + r() * .25) : 'rgba(255,248,225,' + (.2 + r() * .3) + ')';
        ctx.beginPath(); ctx.ellipse(0, 0, w * (.18 + r() * .6), w * (.025 + r() * .08), 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    } else if (f.finish === 'patina') {
      for (i = 0; i < Math.min(900, L / (w * .04)); i++) {
        ctx.fillStyle = rgba(acc, .2 + r() * .45); ctx.beginPath();
        ctx.ellipse(r() * L, r() * w, w * (.02 + r() * .08), w * (.015 + r() * .04), r() * 3, 0, Math.PI * 2); ctx.fill();
      }
    } else {
      var grain = shade(base, -.5); ctx.strokeStyle = grain;
      for (i = 0; i < Math.max(8, w / 1.4); i++) {
        var y0 = r() * w, amp = r() * w * .05, fr = 1 + r() * 4, ph = r() * 6;
        ctx.globalAlpha = (f.finish === 'lak' ? .05 : .1) + r() * .15; ctx.lineWidth = Math.max(.5, w / 90) * (.5 + r() * 1.6); ctx.beginPath();
        for (var k = 0; k <= 40; k++) { x = L * k / 40; y = y0 + Math.sin(k / 40 * fr * Math.PI * 2 + ph) * amp; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    /* pattern */
    if (f.pattern === 'burma') {
      var y1 = w * .14, y2 = w * .86, h = y2 - y1, p = h * 1.05;
      for (x = -h; x < L + h; x += p) {
        ctx.fillStyle = rgba(acc, .8); ctx.beginPath();
        ctx.moveTo(x, y1); ctx.lineTo(x + p * .42, y1); ctx.lineTo(x + p * .42 + h * .55, y2); ctx.lineTo(x + h * .55, y2); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(255,245,215,.45)'; ctx.lineWidth = Math.max(.5, w / 60);
        ctx.beginPath(); ctx.moveTo(x + p * .42, y1); ctx.lineTo(x + p * .42 + h * .55, y2); ctx.stroke();
      }
    } else if (f.pattern === 'ornament') {
      var b1 = w * .3, b2 = w * .76, bh = b2 - b1, per = bh * 1.35, cy = (b1 + b2) / 2;
      ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(0, b1, L, bh);
      for (x = 0; x < L + per; x += per) {
        [['rgba(0,0,0,.4)', bh * .06], [rgba(acc, .85), 0]].forEach(function (pass) {
          ctx.save(); ctx.translate(x + pass[1], cy + pass[1]); ctx.fillStyle = pass[0]; ctx.strokeStyle = pass[0];
          ctx.lineWidth = Math.max(.6, bh * .11); ctx.beginPath(); ctx.arc(0, 0, bh * .3, Math.PI * .15, Math.PI * 1.75); ctx.stroke();
          ctx.beginPath(); ctx.arc(per * .5, 0, bh * .3, Math.PI * 1.15, Math.PI * 2.75); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(per * .25, -bh * .22, bh * .2, bh * .09, -.5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.ellipse(per * .25, bh * .22, bh * .2, bh * .09, .5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(0, 0, bh * .09, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        });
      }
    } else if (f.pattern === 'muncuq') {
      var br = Math.max(.8, w * .04), by = f.lip === 'outer' ? w * .14 : w * .8;
      for (x = br; x < L; x += br * 2.5) {
        ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.arc(x + br * .25, by + br * .25, br, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = rgba(acc, .95); ctx.beginPath(); ctx.arc(x, by, br, 0, Math.PI * 2); ctx.fill();
      }
    }
    /* edge band */
    if (f.lip) {
      var lc = f.lipColor || acc, l0 = f.lip === 'inner' ? w * .86 : 0, lh = w * (f.lip === 'inner' ? .14 : .08);
      ctx.fillStyle = lc; ctx.fillRect(0, l0, L, lh);
      var lg = ctx.createLinearGradient(0, l0, 0, l0 + lh);
      lg.addColorStop(0, 'rgba(0,0,0,.3)'); lg.addColorStop(.35, 'rgba(255,245,215,.4)'); lg.addColorStop(1, 'rgba(0,0,0,.35)');
      ctx.fillStyle = lg; ctx.fillRect(0, l0, L, lh);
    }
    /* relief and light */
    var gr = ctx.createLinearGradient(0, 0, 0, w);
    (PROFILES[f.profile] || PROFILES.flat).forEach(function (p) { gr.addColorStop(p[0], p[1] > 0 ? 'rgba(255,255,255,' + p[1] * (f.finish === 'metal' ? 1.2 : 1) + ')' : 'rgba(0,0,0,' + (-p[1]) + ')'); });
    ctx.fillStyle = gr; ctx.fillRect(0, 0, L, w);
    if (f.finish === 'metal' || f.finish === 'lak') {
      var sh = ctx.createLinearGradient(0, 0, L, 0), k2 = f.finish === 'metal' ? .2 : .1;
      sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(.3, 'rgba(255,250,230,' + k2 + ')'); sh.addColorStop(.5, 'rgba(255,255,255,0)');
      sh.addColorStop(.78, 'rgba(255,250,230,' + k2 * .8 + ')'); sh.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sh; ctx.fillRect(0, 0, L, w);
    }
  }
  function drawFrame(ctx, ox, oy, oW, oH, w, f) {
    var sides = [[ox, oy, 0, oW, .1], [ox + oW, oy, Math.PI / 2, oH, -.05], [ox + oW, oy + oH, Math.PI, oW, -.15], [ox, oy + oH, -Math.PI / 2, oH, .04]];
    sides.forEach(function (s, si) {
      var L = s[3]; ctx.save(); ctx.translate(s[0], s[1]); ctx.rotate(s[2]);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L, 0); ctx.lineTo(L - w, w); ctx.lineTo(w, w); ctx.closePath(); ctx.clip();
      paintSide(ctx, L, w, f, rng(parseInt(f.code, 10) + si * 31));
      ctx.fillStyle = s[4] > 0 ? 'rgba(255,255,255,' + s[4] + ')' : 'rgba(0,0,0,' + (-s[4]) + ')'; ctx.fillRect(0, 0, L, w);
      ctx.restore();
    });
    ctx.save(); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = Math.max(.6, w / 70); ctx.beginPath();
    [[ox, oy, ox + w, oy + w], [ox + oW, oy, ox + oW - w, oy + w], [ox + oW, oy + oH, ox + oW - w, oy + oH - w], [ox, oy + oH, ox + w, oy + oH - w]]
      .forEach(function (l) { ctx.moveTo(l[0], l[1]); ctx.lineTo(l[2], l[3]); }); ctx.stroke(); ctx.restore();
  }
  function drawArt(ctx, x, y, w, h) {
    if (!img.complete || !img.naturalWidth) { ctx.fillStyle = '#d9d1c3'; ctx.fillRect(x, y, w, h); return; }
    var ia = img.naturalWidth / img.naturalHeight, ta = w / h, sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0;
    if (ia > ta) { sw = sh * ta; sx = (img.naturalWidth - sw) / 2; } else { sh = sw / ta; sy = (img.naturalHeight - sh) / 2; }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }
  function innerShadow(ctx, x, y, w, h, d) {
    var g = ctx.createLinearGradient(0, y, 0, y + d); g.addColorStop(0, 'rgba(0,0,0,.42)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x, y, w, d);
    g = ctx.createLinearGradient(x, 0, x + d * .7, 0); g.addColorStop(0, 'rgba(0,0,0,.28)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x, y, d * .7, h);
  }
  function compose(ctx, cw, ch, f, mat, wall, showScale) {
    var fw = f ? f.w : 0, m = mat ? MAT : 0, iW = art.W + 2 * m, iH = art.H + 2 * m, oW = iW + 2 * fw, oH = iH + 2 * fw;
    ctx.fillStyle = wall; ctx.fillRect(0, 0, cw, ch);
    var vg = ctx.createRadialGradient(cw * .5, ch * .35, cw * .1, cw * .5, ch * .5, Math.max(cw, ch) * .8);
    vg.addColorStop(0, 'rgba(255,255,255,.08)'); vg.addColorStop(1, 'rgba(0,0,0,.22)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, cw, ch);
    var s = Math.min(cw * .78 / oW, ch * .78 / oH), OW = oW * s, OH = oH * s, ox = (cw - OW) / 2, oy = (ch - OH) / 2 - (showScale ? ch * .02 : 0);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = Math.max(6, OW * .04); ctx.shadowOffsetY = Math.max(3, OW * .018);
    ctx.fillStyle = '#000'; ctx.fillRect(ox, oy, OW, OH); ctx.restore();
    var F = fw * s, ix = ox + F, iy = oy + F, IW = iW * s, IH = iH * s;
    if (m) { var M = m * s, lw = Math.max(1, s * 2.5); ctx.fillStyle = st.matColor[0]; ctx.fillRect(ix, iy, IW, IH);
      drawArt(ctx, ix + M, iy + M, art.W * s, art.H * s);
      ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = lw; ctx.strokeRect(ix + M - lw / 2, iy + M - lw / 2, art.W * s + lw, art.H * s + lw);
      innerShadow(ctx, ix + M, iy + M, art.W * s, art.H * s, Math.max(2, s * 4));
    } else drawArt(ctx, ix, iy, IW, IH);
    if (f) { innerShadow(ctx, ix, iy, IW, IH, Math.max(2, F * .18)); drawFrame(ctx, ox, oy, OW, OH, F, f); }
    if (showScale) {
      var bar = 100 * s, bx = 16, by = ch - 18, dark = (function (h) { var n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) < 150; })(wall);
      ctx.strokeStyle = ctx.fillStyle = dark ? 'rgba(255,255,255,.85)' : 'rgba(38,34,32,.75)'; ctx.lineWidth = 1.5; ctx.beginPath();
      ctx.moveTo(bx, by); ctx.lineTo(bx + bar, by); ctx.moveTo(bx, by - 5); ctx.lineTo(bx, by + 5); ctx.moveTo(bx + bar, by - 5); ctx.lineTo(bx + bar, by + 5); ctx.stroke();
      ctx.font = "13px 'Jost', Arial, sans-serif"; ctx.fillText('10 ' + T.unit, bx + bar + 8, by + 4);
    }
    return { oW: oW, oH: oH };
  }

  /* ---------- modal ---------- */
  var cm = function (mm) { return (Math.round(mm) / 10).toLocaleString(EN ? 'en-GB' : 'az-AZ', { maximumFractionDigits: 1 }); };
  var modal = document.createElement('div');
  modal.className = 'fr-modal'; modal.hidden = true; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-label', T.title);
  modal.innerHTML =
    '<div class="fr-box">' +
      '<div class="fr-head"><h2>' + T.title + '<span></span></h2><button type="button" class="fr-x" aria-label="' + T.close + '">✕</button></div>' +
      '<div class="fr-stage"><div class="fr-canvas-wrap"><canvas aria-hidden="true"></canvas></div><div class="fr-facts"></div></div>' +
      '<div class="fr-side"><div class="fr-scroll">' +
        '<div><p class="fr-label">' + T.frame + '</p><div class="fr-chips"></div></div>' +
        '<div class="fr-grid"></div>' +
        '<div><p class="fr-label">' + T.options + '</p><div class="fr-row">' +
          '<label class="fr-toggle"><input type="checkbox" class="fr-mat"> ' + T.mat + '</label></div>' +
          '<div class="fr-sub fr-matbox" hidden><p class="fr-label">' + T.matColor + ' <span class="fr-matname"></span></p><div class="fr-walls fr-mats" role="group" aria-label="' + T.matColor + '"></div></div>' +
          '<div class="fr-sub"><p class="fr-label">' + T.wall + '</p><div class="fr-walls fr-wallset" role="group" aria-label="' + T.wall + '"></div></div></div>' +
        '<p class="fr-note">' + T.note + '</p>' +
      '</div><div class="fr-foot"><div class="fr-price" aria-live="polite"></div><div class="fr-ctas"><a class="btn btn-primary ig-open ig-frame fr-ig" href="https://ig.me/m/rafaelliartcom" target="_blank" rel="noopener">' +
        '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>' +
        T.ctaIg + '</a><button type="button" class="btn btn-secondary fr-cta">' + T.cta + '</button></div><p class="fr-note">' + T.ctaNote + '</p></div></div>' +
    '</div>';
  document.body.appendChild(modal);
  modal.querySelector('.fr-head h2 span').textContent = art.title + ' · ' + cm(art.W) + ' × ' + cm(art.H) + ' ' + T.unit;
  var canvas = modal.querySelector('canvas'), wrap = modal.querySelector('.fr-canvas-wrap'), facts = modal.querySelector('.fr-facts');
  var chips = modal.querySelector('.fr-chips'), grid = modal.querySelector('.fr-grid'), walls = modal.querySelector('.fr-wallset'), mats = modal.querySelector('.fr-mats'), matbox = modal.querySelector('.fr-matbox');

  function render() {
    if (modal.hidden) return;
    var cw = wrap.clientWidth, ch = wrap.clientHeight; if (!cw || !ch) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1); canvas.width = cw * dpr; canvas.height = ch * dpr;
    var ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var r = compose(ctx, cw, ch, st.frame, st.mat, st.wall, true), f = st.frame;
    facts.innerHTML = '<span>' + T.art + ': <b>' + cm(art.W) + ' × ' + cm(art.H) + ' ' + T.unit + '</b></span>' +
      '<span>' + T.framed + ': <b>' + cm(r.oW) + ' × ' + cm(r.oH) + ' ' + T.unit + '</b></span>' +
      '';
    var pc = priceOf(f, st.mat), pb = modal.querySelector('.fr-price'), len = pc.len.toLocaleString(EN ? 'en-GB' : 'az-AZ', { maximumFractionDigits: 2 });
    pb.innerHTML = '<div class="fr-price-row"><span>' + T.priceT + '</span><b>' + (pc.total ? azn(pc.total) : '0 ₼') + '</b></div>' +
      '<small>' + (f ? T.frameL + ': ' + len + ' m × ' + f.price + ' ₼ + ' + PR.labor + ' ₼ ' + T.labor + ' = ' + azn(pc.frame) : T.none0) +
      (st.mat ? ' · ' + T.matL + ': ' + azn(pc.mat) : '') + '</small>';
    facts.innerHTML += (f ? '<span><b>' + nameOf(f) + '</b> · ' + T.code + ' <b>' + f.code + '</b> · ' + T.profile + ' <b>' + f.w + ' × ' + f.d + ' mm</b></span>' : '<span><b>' + T.none + '</b></span>');
  }
  function thumb(cv, f) {
    var c = cv.getContext('2d'), W = cv.width, H = cv.height, fw = 22 + f.w / 138 * 46, o = 18;
    c.fillStyle = '#E6DFD2'; c.fillRect(0, 0, W, H);
    c.save(); c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 10; c.shadowOffsetY = 4; c.fillStyle = '#000'; c.fillRect(o, o, W * 2, H * 2); c.restore();
    drawArt(c, o + fw, o + fw, W * 2, H * 2 * art.H / art.W); innerShadow(c, o + fw, o + fw, W, H, fw * .18);
    drawFrame(c, o, o, W * 2.4, H * 2.4, fw, f);
  }
  function card(f) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'fr-card'; b.setAttribute('aria-pressed', String(f === st.frame));
    if (f) { b.innerHTML = '<canvas width="200" height="160"></canvas><b>' + nameOf(f) + '</b><small>' + T.code + ' ' + f.code + ' · ' + f.w + '×' + f.d + ' mm</small>' + (f.price ? '<span class="fr-cp">' + azn(priceOf(f, st.mat).frame) + '</span>' : ''); }
    else { b.innerHTML = '<div class="fr-none">' + T.noneSub + '</div><b>' + T.none + '</b><small>—</small><span class="fr-cp">0 ₼</span>'; }
    b.addEventListener('click', function () { st.frame = f; grid.querySelectorAll('.fr-card').forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); }); render(); });
    b._f = f; return b;
  }
  function buildGrid() {
    chips.querySelectorAll('.fr-chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.k === st.filter)); });
    var test = FILTERS.filter(function (x) { return x[0] === st.filter; })[0][2];
    grid.innerHTML = ''; grid.appendChild(card(null));
    FRAMES.filter(test).forEach(function (f) { grid.appendChild(card(f)); });
    paintThumbs();
  }
  function paintThumbs() { grid.querySelectorAll('.fr-card').forEach(function (b) { if (b._f) thumb(b.querySelector('canvas'), b._f); }); }
  FILTERS.forEach(function (x) {
    var c = document.createElement('button'); c.type = 'button'; c.className = 'fr-chip'; c.dataset.k = x[0]; c.textContent = x[1];
    c.addEventListener('click', function () { st.filter = x[0]; buildGrid(); }); chips.appendChild(c);
  });
  WALLS.forEach(function (w) {
    var c = document.createElement('button'); c.type = 'button'; c.className = 'fr-wall'; c.style.background = w; c.setAttribute('aria-label', T.wall);
    c.setAttribute('aria-pressed', String(w === st.wall));
    c.addEventListener('click', function () { st.wall = w; walls.querySelectorAll('.fr-wall').forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); }); render(); });
    walls.appendChild(c);
  });
  var matName = function () { return st.matColor[EN ? 2 : 1]; };
  MATS.forEach(function (m) {
    var c = document.createElement('button'); c.type = 'button'; c.className = 'fr-wall'; c.style.background = m[0]; c.title = m[EN ? 2 : 1];
    c.setAttribute('aria-label', m[EN ? 2 : 1]); c.setAttribute('aria-pressed', String(m === st.matColor));
    c.addEventListener('click', function () { st.matColor = m; mats.querySelectorAll('.fr-wall').forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      modal.querySelector('.fr-matname').textContent = '· ' + matName(); render(); });
    mats.appendChild(c);
  });
  modal.querySelector('.fr-matname').textContent = '· ' + matName();
  modal.querySelector('.fr-mat').addEventListener('change', function (e) { st.mat = e.target.checked; matbox.hidden = !st.mat; buildGrid(); render(); });

  var lastFocus = null;
  function open() { lastFocus = document.activeElement; modal.hidden = false; document.body.style.overflow = 'hidden'; buildGrid(); render(); modal.querySelector('.fr-x').focus(); }
  function close() { modal.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  btn.addEventListener('click', open);
  btn.classList.add('is-ready');
  modal.querySelector('.fr-x').addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) { if (!modal.hidden && e.key === 'Escape') close(); });
  window.addEventListener('resize', render);
  img.addEventListener('load', function () { render(); if (!modal.hidden) paintThumbs(); });

  function frameText() {
    var f = st.frame, m = st.mat ? MAT : 0, fw = f ? f.w : 0;
    var size = cm(art.W + 2 * m + 2 * fw) + ' × ' + cm(art.H + 2 * m + 2 * fw);
    var pc = priceOf(f, st.mat);
    return T.msg(art.title, f, st.mat ? matName() : false, size, pc.total ? azn(pc.total) : '');
  }
  window.RAFAELLI_FRAME_MSG = frameText;
  modal.querySelector('.fr-ig').addEventListener('click', function () {
    var form = document.getElementById('contact-form'); if (form && form.message) form.message.value = frameText();
  });
  modal.querySelector('.fr-cta').addEventListener('click', function () {
    var text = frameText();
    close();
    var form = document.getElementById('contact-form');
    if (form && form.message) {
      form.message.value = text;
      var target = document.getElementById('sorgu') || form;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function () { form.message.focus({ preventScroll: true }); }, 400);
    }
  });
})();
