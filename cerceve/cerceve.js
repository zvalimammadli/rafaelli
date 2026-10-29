/* Rafaelli — "Çərçivə ilə bax": rəsmi real ölçüsündə seçilmiş çərçivənin içində göstərir.
   Düymə: <button class="frame-open" data-w="40" data-h="60" data-src="..." data-title="...">
   (data-w / data-h — rəsmin eni və hündürlüyü, sm). Çərçivələr: cerceveler.js */
(function () {
  var btn = document.querySelector('.frame-open');
  if (!btn || !window.RAFAELLI_FRAMES) return;
  var EN = (document.documentElement.lang || 'az').slice(0, 2) === 'en';
  var T = EN ? {
    title: 'See it framed', none: 'No frame', noneSub: 'Canvas only', all: 'All', thin: 'Slim', mid: 'Medium', wide: 'Wide',
    frame: 'Frame', options: 'Options', mat: 'Add a 5 cm white mount', wall: 'Wall', art: 'Painting', framed: 'Framed size',
    profile: 'Profile', code: 'Code', close: 'Close', cta: 'Enquire with this frame', unit: 'cm',
    note: 'Frame codes and profile sizes are from the Xətai Art Centre catalogue. Colours shown are indicative; the final finish is confirmed with your order.',
    ctaNote: 'We will confirm the frame price by email.',
    msg: function (t, f, mat, size) { return 'Hello! I am interested in “' + t + '” ' + (f ? 'with frame code ' + f.code + ' (profile ' + f.w + '×' + f.d + ' mm' + (mat ? ', 5 cm white mount' : '') + '), framed size ' + size + ' cm.' : 'without a frame.') + ' Could you tell me the price?'; }
  } : {
    title: 'Çərçivə ilə bax', none: 'Çərçivəsiz', noneSub: 'Yalnız kətan', all: 'Hamısı', thin: 'Nazik', mid: 'Orta', wide: 'Geniş',
    frame: 'Çərçivə', options: 'Əlavələr', mat: '5 sm ağ paspartu əlavə et', wall: 'Divar', art: 'Rəsm', framed: 'Çərçivəli ölçü',
    profile: 'Profil', code: 'Kod', close: 'Bağla', cta: 'Bu çərçivə ilə sorğu göndər', unit: 'sm',
    note: 'Çərçivə kodları və profil ölçüləri Xətai Sənət Mərkəzinin kataloqundandır. Rənglər təxminidir, son görünüş sifarişdə təsdiqlənir.',
    ctaNote: 'Çərçivənin qiymətini e-poçtla bildirəcəyik.',
    msg: function (t, f, mat, size) { return 'Salam! «' + t + '» əsəri ilə ' + (f ? 'kod ' + f.code + ' çərçivə ilə (profil ' + f.w + '×' + f.d + ' mm' + (mat ? ', 5 sm ağ paspartu' : '') + ', çərçivəli ölçü ' + size + ' sm) maraqlanıram.' : 'çərçivəsiz maraqlanıram.') + ' Qiyməti bildirə bilərsiniz?'; }
  };

  var FRAMES = window.RAFAELLI_FRAMES.filter(function (f) { return !f.hidden; });
  var FILTERS = [['all', T.all, function () { return true; }], ['thin', T.thin, function (f) { return f.w <= 60; }],
    ['mid', T.mid, function (f) { return f.w > 60 && f.w <= 90; }], ['wide', T.wide, function (f) { return f.w > 90; }]];
  var WALLS = ['#ECE7DE', '#8C948E', '#2E2B28'];
  var MAT = 50; // mm
  var art = { W: +btn.dataset.w * 10, H: +btn.dataset.h * 10, title: btn.dataset.title || '' };
  var st = { frame: FRAMES[Math.min(11, FRAMES.length - 1)], filter: 'all', mat: false, wall: WALLS[0] };
  var img = new Image(); img.src = btn.dataset.src;

  /* ---------- drawing ---------- */
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shade(hex, k) { var n = parseInt(hex.slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    function m(c) { return Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k); } return 'rgb(' + m(r) + ',' + m(g) + ',' + m(b) + ')'; }
  var PROFILES = {
    flat: [[0, -.3], [.06, .18], [.13, 0], [.86, 0], [.93, .14], [1, -.4]],
    rounded: [[0, -.4], [.14, .04], [.38, .24], [.6, .04], [.84, -.18], [.92, .16], [1, -.45]],
    stepped: [[0, -.45], [.07, .22], [.14, -.12], [.28, .28], [.4, -.04], [.52, -.22], [.6, .24], [.7, 0], [.8, -.26], [.87, .28], [.94, .04], [1, -.5]]
  };
  function profileOf(f) { var r = f.d / f.w; return r < .4 ? 'flat' : r < .72 ? 'rounded' : 'stepped'; }
  function drawFrame(ctx, ox, oy, oW, oH, w, f) {
    var base = f.color || '#8B6B4A', grain = shade(base, -.55), prof = PROFILES[profileOf(f)];
    var sides = [[ox, oy, 0, oW, .12], [ox + oW, oy, Math.PI / 2, oH, -.05], [ox + oW, oy + oH, Math.PI, oW, -.16], [ox, oy + oH, -Math.PI / 2, oH, .05]];
    sides.forEach(function (s, si) {
      var L = s[3]; ctx.save(); ctx.translate(s[0], s[1]); ctx.rotate(s[2]);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L, 0); ctx.lineTo(L - w, w); ctx.lineTo(w, w); ctx.closePath(); ctx.clip();
      ctx.fillStyle = base; ctx.fillRect(0, 0, L, w);
      var r = rng(parseInt(f.code, 10) + si * 31), n = Math.max(8, Math.round(w / 1.4));
      ctx.strokeStyle = grain;
      for (var i = 0; i < n; i++) {
        var y0 = r() * w, amp = r() * w * .06, fr = 1 + r() * 4, ph = r() * 6;
        ctx.globalAlpha = .12 + r() * .25; ctx.lineWidth = Math.max(.5, w / 90) * (.5 + r() * 1.6); ctx.beginPath();
        for (var k = 0; k <= 40; k++) { var x = L * k / 40, y = y0 + Math.sin(k / 40 * fr * Math.PI * 2 + ph) * amp; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      var gr = ctx.createLinearGradient(0, 0, 0, w);
      prof.forEach(function (p) { gr.addColorStop(p[0], p[1] > 0 ? 'rgba(255,255,255,' + p[1] + ')' : 'rgba(0,0,0,' + (-p[1]) + ')'); });
      ctx.fillStyle = gr; ctx.fillRect(0, 0, L, w);
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
    if (m) { var M = m * s, lw = Math.max(1, s * 2.5); ctx.fillStyle = '#F4F1EB'; ctx.fillRect(ix, iy, IW, IH);
      drawArt(ctx, ix + M, iy + M, art.W * s, art.H * s);
      ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = lw; ctx.strokeRect(ix + M - lw / 2, iy + M - lw / 2, art.W * s + lw, art.H * s + lw);
      innerShadow(ctx, ix + M, iy + M, art.W * s, art.H * s, Math.max(2, s * 4));
    } else drawArt(ctx, ix, iy, IW, IH);
    if (f) { innerShadow(ctx, ix, iy, IW, IH, Math.max(2, F * .18)); drawFrame(ctx, ox, oy, OW, OH, F, f); }
    if (showScale) {
      var bar = 100 * s, bx = 16, by = ch - 18, dark = wall !== WALLS[0];
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
          '<label class="fr-toggle"><input type="checkbox" class="fr-mat"> ' + T.mat + '</label>' +
          '<div class="fr-walls" role="group" aria-label="' + T.wall + '"></div></div></div>' +
        '<p class="fr-note">' + T.note + '</p>' +
      '</div><div class="fr-foot"><button type="button" class="btn btn-primary fr-cta">' + T.cta + '</button><p class="fr-note">' + T.ctaNote + '</p></div></div>' +
    '</div>';
  document.body.appendChild(modal);
  modal.querySelector('.fr-head h2 span').textContent = art.title + ' · ' + cm(art.W) + ' × ' + cm(art.H) + ' ' + T.unit;
  var canvas = modal.querySelector('canvas'), wrap = modal.querySelector('.fr-canvas-wrap'), facts = modal.querySelector('.fr-facts');
  var chips = modal.querySelector('.fr-chips'), grid = modal.querySelector('.fr-grid'), walls = modal.querySelector('.fr-walls');

  function render() {
    if (modal.hidden) return;
    var cw = wrap.clientWidth, ch = wrap.clientHeight; if (!cw || !ch) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1); canvas.width = cw * dpr; canvas.height = ch * dpr;
    var ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var r = compose(ctx, cw, ch, st.frame, st.mat, st.wall, true), f = st.frame;
    facts.innerHTML = '<span>' + T.art + ': <b>' + cm(art.W) + ' × ' + cm(art.H) + ' ' + T.unit + '</b></span>' +
      '<span>' + T.framed + ': <b>' + cm(r.oW) + ' × ' + cm(r.oH) + ' ' + T.unit + '</b></span>' +
      (f ? '<span>' + T.code + ' <b>' + f.code + '</b> · ' + T.profile + ' <b>' + f.w + ' × ' + f.d + ' mm</b></span>' : '<span><b>' + T.none + '</b></span>');
  }
  function thumb(cv, f) {
    var c = cv.getContext('2d'); compose(c, cv.width, cv.height, f, false, '#E6DFD2', false);
  }
  function card(f) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'fr-card'; b.setAttribute('aria-pressed', String(f === st.frame));
    if (f) { b.innerHTML = '<canvas width="200" height="200"></canvas><b>' + T.code + ' ' + f.code + '</b><small>' + f.w + ' × ' + f.d + ' mm</small>'; }
    else { b.innerHTML = '<div class="fr-none">' + T.noneSub + '</div><b>' + T.none + '</b><small>—</small>'; }
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
  modal.querySelector('.fr-mat').addEventListener('change', function (e) { st.mat = e.target.checked; render(); });

  var lastFocus = null;
  function open() { lastFocus = document.activeElement; modal.hidden = false; document.body.style.overflow = 'hidden'; buildGrid(); render(); modal.querySelector('.fr-x').focus(); }
  function close() { modal.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  btn.addEventListener('click', open);
  modal.querySelector('.fr-x').addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) { if (!modal.hidden && e.key === 'Escape') close(); });
  window.addEventListener('resize', render);
  img.addEventListener('load', function () { render(); if (!modal.hidden) paintThumbs(); });

  modal.querySelector('.fr-cta').addEventListener('click', function () {
    var f = st.frame, m = st.mat ? MAT : 0, fw = f ? f.w : 0;
    var size = cm(art.W + 2 * m + 2 * fw) + ' × ' + cm(art.H + 2 * m + 2 * fw);
    var text = T.msg(art.title, f, st.mat, size);
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
