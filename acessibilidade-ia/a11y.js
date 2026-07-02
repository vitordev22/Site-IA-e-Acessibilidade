// Barra de ferramentas de leitura — controla o tamanho do texto e o
// contraste, e mantém a preferência entre as páginas via sessionStorage.
(function () {
  const STORE_KEY = 'ia-acessibilidade:prefs';

  function readPrefs() {
    try {
      return JSON.parse(sessionStorage.getItem(STORE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function savePrefs(p) {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(p));
    } catch (e) {
      /* armazenamento indisponível: preferências valem só para a página atual */
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const toggle = document.getElementById('a11y-toggle');
    const panel = document.getElementById('a11y-panel');
    const contrastBtn = document.getElementById('btn-contraste');
    const sizeButtons = document.querySelectorAll('[data-fontstep]');
    const prefs = readPrefs();

    let step = prefs.step || 1;
    applyStep(step);
    if (prefs.contraste) {
      body.classList.add('contraste-alto');
      contrastBtn.setAttribute('aria-pressed', 'true');
    }

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        const open = panel.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }

    sizeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const delta = parseFloat(btn.getAttribute('data-fontstep'));
        if (delta === 0) {
          step = 1;
        } else {
          step = Math.min(1.4, Math.max(0.9, step + delta));
        }
        applyStep(step);
        prefs.step = step;
        savePrefs(prefs);
      });
    });

    if (contrastBtn) {
      contrastBtn.addEventListener('click', function () {
        const on = body.classList.toggle('contraste-alto');
        contrastBtn.setAttribute('aria-pressed', String(on));
        prefs.contraste = on;
        savePrefs(prefs);
      });
    }

    function applyStep(s) {
      document.documentElement.style.setProperty('--step', s.toFixed(2));
    }
  });
})();
