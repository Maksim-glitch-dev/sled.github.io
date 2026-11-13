// Адаптация под размер окна и устройство: настольный режим (dk), телефон в портрете (pp), телефон в ландшафте (pl).
// Сцена всегда целиком помещается в окно; поля вокруг дорисованы стеной и полом (см. index.html), а не чёрными полосами.
(function () {
  var root = document.documentElement, stage = document.getElementById('stage');
  var quest = document.getElementById('quest'), hud = document.getElementById('hud'), dock = document.getElementById('dock');
  var panel = document.createElement('div'); panel.id = 'side'; stage.appendChild(panel);
  var mode = '';
  function clamp(a, v, b) { return Math.max(a, Math.min(b, v)) }
  function layout() {
    var W = root.clientWidth || innerWidth, H = innerHeight;
    root.style.setProperty('--vh', (H * 0.01) + 'px');
    var m = 'dk';
    if (H <= 520 && W > H) m = 'pl'; else if (H > W * 1.1 && W <= 1100) m = 'pp';
    var sw, sh, sx, sy, em, dw = 0;
    if (m === 'pp') { sw = W; sh = W * 9 / 16; sx = 0; sy = 0; em = clamp(10, W / 39, 13); }
    else if (m === 'pl') { dw = 64; var aw = W - dw; sw = Math.min(aw, H * 16 / 9); sh = sw * 9 / 16; sx = (aw - sw) / 2; sy = (H - sh) / 2; em = clamp(8, H / 42, 11); }
    else { sw = Math.min(W, H * 16 / 9); sh = sw * 9 / 16; sx = (W - sw) / 2; sy = (H - sh) / 2; em = Math.max(7, sw / 100); }
    var st = stage.style;
    st.setProperty('--em', em.toFixed(2) + 'px'); st.setProperty('--sx', sx.toFixed(1) + 'px'); st.setProperty('--sy', sy.toFixed(1) + 'px');
    st.setProperty('--sw', sw.toFixed(1) + 'px'); st.setProperty('--sh', sh.toFixed(1) + 'px'); st.setProperty('--dw', dw + 'px');
    if (m !== mode) {
      mode = m; root.setAttribute('data-mode', m);
      if (m === 'pp') { panel.appendChild(quest); panel.appendChild(hud); panel.appendChild(dock); }
      else { stage.appendChild(quest); stage.appendChild(hud); if (m === 'pl') panel.appendChild(dock); else stage.appendChild(dock); }
    }
  }
  layout();
  addEventListener('resize', layout); addEventListener('orientationchange', function () { setTimeout(layout, 250) });
  if (window.visualViewport) visualViewport.addEventListener('resize', layout);
  // кнопки нижней панели вызывают те же объекты сцены
  [].forEach.call(dock.querySelectorAll('button'), function (b) {
    b.addEventListener('click', function () {
      var t = document.getElementById(b.getAttribute('data-go'));
      if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  });
})();
