/* Rafaelli — "Instagram-da yazın": @rafaelliartcom ilə yazışmanı açır.
   Instagram mesaj mətnini əvvəlcədən doldurmağa icazə vermir, ona görə düymə basılanda
   mesaj mətni (əsərin adı, çərçivə seçimi) kopyalanır və müştəriyə yapışdırmaq xatırladılır.
   Düymə: <a class="ig-open" href="https://ig.me/m/rafaelliartcom" data-msg="..."> */
(function () {
  var EN = (document.documentElement.lang || 'az').slice(0, 2) === 'en';
  var T = EN
    ? { ok: 'Message copied. Paste it into the Instagram chat.', no: 'Instagram is opening. Please mention the painting’s name in your message.' }
    : { ok: 'Mesaj kopyalandı. Instagram yazışmasına yapışdırın.', no: 'Instagram açılır. Mesajda əsərin adını yazın.' };
  var box;
  function toast(text) {
    if (!box) { box = document.createElement('div'); box.className = 'ig-toast'; box.setAttribute('role', 'status'); document.body.appendChild(box); }
    box.textContent = text; box.classList.add('on');
    clearTimeout(box._t); box._t = setTimeout(function () { box.classList.remove('on'); }, 5000);
  }
  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
      var ok = document.execCommand('copy'); document.body.removeChild(ta); return ok;
    } catch (e) { return false; }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.ig-open'); if (!a) return;
    var msg = (a.classList.contains('ig-frame') && window.RAFAELLI_FRAME_MSG) ? window.RAFAELLI_FRAME_MSG() : a.dataset.msg;
    if (msg) msg += '\n' + location.href.split('#')[0];
    if (!msg) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(msg).then(function () { toast(T.ok); }, function () { toast(fallbackCopy(msg) ? T.ok : T.no); });
    } else toast(fallbackCopy(msg) ? T.ok : T.no);
  });
})();
