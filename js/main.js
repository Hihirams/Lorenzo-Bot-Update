const logEl  = document.getElementById('log');
const quick  = document.getElementById('quickbar');

const THEME_KEY = 'lorenzo-theme';

function getPreferredTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return 'light';
}

function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.setAttribute('aria-pressed', theme === 'light');

  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon){
    themeIcon.src = theme === 'light' ? 'img/sun.png' : 'img/moon.png';
    themeIcon.alt = theme === 'light' ? 'Tema claro' : 'Tema oscuro';
  }
}

let currentTheme = getPreferredTheme();
applyTheme(currentTheme);
if (!localStorage.getItem(THEME_KEY)){
  localStorage.setItem(THEME_KEY, currentTheme);
}

const themeBtn = document.getElementById('themeToggleBtn');
if (themeBtn){
  themeBtn.addEventListener('click', ()=>{
    currentTheme = (document.documentElement.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, currentTheme);
    applyTheme(currentTheme);
  });
}

document.documentElement.style.colorScheme = 'dark light';

function setVh(){
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setVh();
window.addEventListener('resize', setVh);

const LANG_KEY = 'lorenzo-lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'es';

const i18n = {
  es: {
    title: "Denbot SharePoint Helper",
    subtitle: "Asistente de SharePoint",
    statusReady: " Listo",
    typing: "Denbot · escribiendo…",
    footnote: "Versión 1.2.0",
    quick_acceso: "Contenido",
    quick_archivos: "Contacto",
    quick_sp: "🔙 Volver a SharePoint",
    quick_intranet: "Intranet Denso",
    back: "← Volver",
    restart: "↺ Reiniciar",
    me_you: "tú",
    bot: "bot",
    input_placeholder: "Escribe tu mensaje…",
    send: "Enviar",
    intro: "¡Hola! Soy DenBot. Trabajo con un <b>flujo de decisiones.</b> Usa los 2 accesos rápidos o navega con las opciones dentro del chat."
  },
  en: {
    title: "Denbot SharePoint Helper",
    subtitle: "SharePoint Assistant",
    statusReady: " Ready",
    typing: "Denbot · typing…",
    footnote: "Version 1.2.0",
    quick_acceso: "Content",
    quick_archivos: "Contact",
    quick_sp: "🔙 Back to SharePoint",
    quick_intranet: "Denso Intranet",
    back: "← Back",
    restart: "↺ Restart",
    me_you: "you",
    bot: "bot",
    input_placeholder: "Type your message…",
    send: "Send",
    intro: "Hi! I’m Denbot. I now work with a <b>decision flow</b>. Use the 2 quick actions or navigate with the chips in chat."
  }
};

function toggleLanguage(){
  currentLang = (currentLang === 'es') ? 'en' : 'es';
  localStorage.setItem(LANG_KEY, currentLang);
  applyLanguage(true);
}

function applyLanguage(rerender=false){
  const flagImg = document.getElementById('langFlag');
  if (flagImg){
    flagImg.src = currentLang === 'es' ? 'img/mx-flag.png' : 'img/us-flag.png';
    flagImg.alt = currentLang === 'es' ? 'Español' : 'English';
  }

  const title = document.querySelector('.title');
  const subtitle = document.querySelector('.subtitle');
  if (title)    title.textContent = i18n[currentLang].title;
  if (subtitle) subtitle.textContent = i18n[currentLang].subtitle;

  const statusEl = document.querySelector('.status');
  if (statusEl) statusEl.innerHTML = '<span class="pulse" aria-hidden="true"></span>' + i18n[currentLang].statusReady;

  const qBtns = document.querySelectorAll('#quickbar > button');
  if (qBtns[0]) qBtns[0].textContent = i18n[currentLang].quick_acceso;
  if (qBtns[1]) qBtns[1].textContent = i18n[currentLang].quick_archivos;
  if (qBtns[2]) qBtns[2].textContent = i18n[currentLang].quick_sp;
  if (qBtns[3]) qBtns[3].textContent = i18n[currentLang].quick_intranet;

  const foot = document.querySelector('.footnote');
  if (foot) foot.textContent = i18n[currentLang].footnote;

  if (rerender){
    logEl.innerHTML = '';
    addHtml(i18n[currentLang].intro, 'bot');
    renderNode(currentNode || 'inicio');
  }
}

document.getElementById('langToggleBtn')?.addEventListener('click', toggleLanguage);

function addMsg(text, who='bot'){
  const wrap = document.createElement('div');
  wrap.className = 'msg ' + (who === 'me' ? 'me' : 'bot');
  wrap.textContent = text;

  const meta = document.createElement('small');
  meta.textContent =
    (who==='me' ? i18n[currentLang].me_you : i18n[currentLang].bot) +
    ' · ' + new Date().toLocaleTimeString();

  wrap.appendChild(meta);
  logEl.appendChild(wrap);
  logEl.scrollTop = logEl.scrollHeight;
  return wrap;
}

function addHtml(html, who='bot'){
  const wrap = document.createElement('div');
  wrap.className = 'msg ' + (who === 'me' ? 'me' : 'bot');
  wrap.innerHTML = html;

  const meta = document.createElement('small');
  meta.textContent =
    (who==='me' ? i18n[currentLang].me_you : i18n[currentLang].bot) +
    ' · ' + new Date().toLocaleTimeString();

  wrap.appendChild(meta);
  logEl.appendChild(wrap);
  logEl.scrollTop = logEl.scrollHeight;
  return wrap;
}

function addTyping(){
  const d = document.createElement('div');
  d.className = 'msg bot';
  d.innerHTML = `<span class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span><small>${i18n[currentLang].typing}</small>`;
  logEl.appendChild(d);
  logEl.scrollTop = logEl.scrollHeight;
  return d;
}

const flows = {
  es: {
    inicio: {
      text: "¿Qué necesitas?",
      options: [
        { label: "Contenido", next: "contenido_home", set: { section: "Contenido" } },
        { label: "Contacto", next: "contacto_perm_ti", set: { section: "Contacto" } },
        { label: "🔙 Volver a SharePoint", link: "https://globaldenso.sharepoint.com/sites/NA_000451/SitePages/PRUEBAS-BOT.aspx" }
      ]
    },

    contacto_perm_ti: {
      text: `
        <p><b>Contacto (demo)</b></p>
        <p>Para temas de <b>permisos</b> o <b>TI</b>, indica:</p>
        <ul style="margin:6px 0 10px; padding-left:18px">
          <li>Tu <b>usuario/red</b> y área.</li>
          <li>El <b>sitio o carpeta</b> de SharePoint.</li>
          <li>Tipo de acceso requerido (lectura/edición).</li>
        </ul>
        <p>Ejemplo de solicitud clara:<br>
        “Necesito <b>edición</b> en <i>NA_000451/CRR/FY25/DMEX/ME</i> para subir reportes semanales”.</p>
      `,
      options: [{ label: "Volver al inicio", next: "inicio" }]
    },

    contenido_home: {
      text: "Contenido — elige un módulo",
      options: [
        { label: "CRR", next: "crr_enunciado", set: { module: "CRR" } },
        { label: "3Y (demo)", next: "demo" }
      ]
    },

    crr_enunciado: {
      text: "CRR — Selecciona el enunciado",
      options: [
        { label: "Tendencias (demo)", next: "demo", set: { statement: "Tendencias" } },
        { label: "Reportes", next: "crr_fy", set: { statement: "Reportes" } },
        { label: "Close Meeting (demo)", next: "demo", set: { statement: "Close Meeting" } }
      ]
    },

    crr_fy: {
      text: "Reportes · CRR — Selecciona año fiscal",
      options: [
        { label: "FY20 (demo)", next: "demo", set: { fiscalYear: "FY20" } },
        { label: "FY22 (demo)", next: "demo", set: { fiscalYear: "FY22" } },
        { label: "FY23 (demo)", next: "demo", set: { fiscalYear: "FY23" } },
        { label: "FY24 (demo)", next: "demo", set: { fiscalYear: "FY24" } },
        { label: "FY25", next: "crr_region", set: { fiscalYear: "FY25" } }
      ]
    },

    crr_region: {
      text: "Reportes · CRR · FY25 — Selecciona región",
      options: [
        { label: "DMEX", next: "crr_bu", set: { region: "DMEX" } },
        { label: "NL (demo)", next: "demo", set: { region: "NL" } },
        { label: "BUX (demo)", next: "demo", set: { region: "BUX" } }
      ]
    },

    crr_bu: {
      text: "Reportes · CRR · FY25 · DMEX — Selecciona Business Unit",
      options: [
        { label: "ME", next: "crr_producto", set: { businessUnit: "ME" } },
        { label: "MXS APP (demo)", next: "demo", set: { businessUnit: "MXS APP" } },
        { label: "MSX 6PP (demo)", next: "demo", set: { businessUnit: "MSX 6PP" } },
        { label: "EC (demo)", next: "demo", set: { businessUnit: "EC" } },
        { label: "TAC (demo)", next: "demo", set: { businessUnit: "TAC" } },
        { label: "LPP (demo)", next: "demo", set: { businessUnit: "LPP" } }
      ]
    },

    crr_producto: {
      text: "Reportes · CRR · FY25 · DMEX · ME — Selecciona producto",
      options: [
        { label: "CLUSTER", next: "crr_resumen", set: { product: "CLUSTER" } },
        { label: "COD (demo)", next: "demo", set: { product: "COD" } },
        { label: "AC PANEL (demo)", next: "demo", set: { product: "AC PANEL" } },
        { label: "HUD (demo)", next: "demo", set: { product: "HUD" } }
      ]
    },

    crr_resumen: {
      text: (s)=> {
        const parts = [s.section, s.module, s.statement, s.fiscalYear, s.region, s.businessUnit, s.product]
          .filter(Boolean)
          .join(', ');
        return `
          <p><b>Resumen de tu selección</b></p>
          <p>Has elegido: <b>${parts}</b>.</p>

          <p><b>Instrucciones (ejemplo):</b></p>
          <ol style="margin:6px 0 10px; padding-left:18px">
            <li>Abre el sitio de SharePoint del área correspondiente.</li>
            <li>Ve a la “Ubicación de botones” y sigue la ruta seleccionada.</li>
            <li>Descarga el reporte o copia el enlace para compartir.</li>
          </ol>
          <img src="img/ejemplo1.png" alt="Vista de ejemplo" class="msg-media">
          <div class="msg-link">
            <a href="https://globaldenso.sharepoint.com/sites/NA_000451" target="_blank" rel="noopener">
              🔗 Enlace de ejemplo a SharePoint
            </a>
          </div>
        `;
      },
      options: [{ label: "Volver al inicio", next: "inicio" }]
    },

    demo: {
      text: "Ruta de demostración. El tramo funcional es: Contenido → CRR → Reportes → FY25 → DMEX → ME → CLUSTER.",
      options: [{ label: "Volver al inicio", next: "inicio" }]
    }
  },

  en: {
    inicio: {
      text: "What do you need?",
      options: [
        { label: "Content", next: "contenido_home", set: { section: "Content" } },
        { label: "Contact", next: "contacto_perm_ti", set: { section: "Contact" } },
        { label: "🔙 Back to SharePoint", link: "https://globaldenso.sharepoint.com/sites/NA_000451/SitePages/PRUEBAS-BOT.aspx" }
      ]
    },

    contacto_perm_ti: {
      text: `
        <p><b>Contact (demo)</b></p>
        <p>For <b>permissions</b> or <b>IT</b> topics, please include:</p>
        <ul style="margin:6px 0 10px; padding-left:18px">
          <li>Your <b>network/user</b> and area.</li>
          <li>The <b>SharePoint site/folder</b>.</li>
          <li>Access type needed (read/edit).</li>
        </ul>
        <p>Clear request example:<br>
        “I need <b>edit</b> access to <i>NA_000451/CRR/FY25/DMEX/ME</i> to upload weekly reports”.</p>
      `,
      options: [{ label: "Back to start", next: "inicio" }]
    },

    contenido_home: {
      text: "Content — choose a module",
      options: [
        { label: "CRR", next: "crr_enunciado", set: { module: "CRR" } },
        { label: "3Y (demo)", next: "demo" }
      ]
    },

    crr_enunciado: {
      text: "CRR — Select statement",
      options: [
        { label: "Trends (demo)", next: "demo", set: { statement: "Trends" } },
        { label: "Reports", next: "crr_fy", set: { statement: "Reports" } },
        { label: "Close Meeting (demo)", next: "demo", set: { statement: "Close Meeting" } }
      ]
    },

    crr_fy: {
      text: "Reports · CRR — Select fiscal year",
      options: [
        { label: "FY20 (demo)", next: "demo", set: { fiscalYear: "FY20" } },
        { label: "FY22 (demo)", next: "demo", set: { fiscalYear: "FY22" } },
        { label: "FY23 (demo)", next: "demo", set: { fiscalYear: "FY23" } },
        { label: "FY24 (demo)", next: "demo", set: { fiscalYear: "FY24" } },
        { label: "FY25", next: "crr_region", set: { fiscalYear: "FY25" } }
      ]
    },

    crr_region: {
      text: "Reports · CRR · FY25 — Select region",
      options: [
        { label: "DMEX", next: "crr_bu", set: { region: "DMEX" } },
        { label: "NL (demo)", next: "demo", set: { region: "NL" } },
        { label: "BUX (demo)", next: "demo", set: { region: "BUX" } }
      ]
    },

    crr_bu: {
      text: "Reports · CRR · FY25 · DMEX — Select Business Unit",
      options: [
        { label: "ME", next: "crr_producto", set: { businessUnit: "ME" } },
        { label: "MXS APP (demo)", next: "demo", set: { businessUnit: "MXS APP" } },
        { label: "MSX 6PP (demo)", next: "demo", set: { businessUnit: "MSX 6PP" } },
        { label: "EC (demo)", next: "demo", set: { businessUnit: "EC" } },
        { label: "TAC (demo)", next: "demo", set: { businessUnit: "TAC" } },
        { label: "LPP (demo)", next: "demo", set: { businessUnit: "LPP" } }
      ]
    },

    crr_producto: {
      text: "Reports · CRR · FY25 · DMEX · ME — Select product",
      options: [
        { label: "CLUSTER", next: "crr_resumen", set: { product: "CLUSTER" } },
        { label: "COD (demo)", next: "demo", set: { product: "COD" } },
        { label: "AC PANEL (demo)", next: "demo", set: { product: "AC PANEL" } },
        { label: "HUD (demo)", next: "demo", set: { product: "HUD" } }
      ]
    },

    crr_resumen: {
      text: (s)=>{
        const parts = [s.section, s.module, s.statement, s.fiscalYear, s.region, s.businessUnit, s.product]
          .filter(Boolean)
          .join(', ');
        return `
          <p><b>Selection summary</b></p>
          <p>You chose: <b>${parts}</b>.</p>

          <p><b>Instructions (example):</b></p>
          <ol style="margin:6px 0 10px; padding-left:18px">
            <li>Open the SharePoint site.</li>
            <li>Go to the “Buttons area” and follow the selected route.</li>
            <li>Download the report or copy the link.</li>
          </ol>
          <img src="img/ejemplo1.png" alt="Example view" class="msg-media">
          <div class="msg-link">
            <a href="https://globaldenso.sharepoint.com/sites/NA_000451" target="_blank" rel="noopener">
              🔗 Example link to SharePoint
            </a>
          </div>
        `;
      },
      options: [{ label: "Back to start", next: "inicio" }]
    },

    demo: {
      text: "Demo route. Functional path: Content → CRR → Reports → FY25 → DMEX → ME → CLUSTER.",
      options: [{ label: "Back to start", next: "inicio" }]
    }
  }
};

const selectionState = {};
const stateStack = [];
const stack = [];
let currentNode = 'inicio';

function applySetFromBtn(btn){
  if (!btn.dataset.set) return;
  try{
    const updates = JSON.parse(btn.dataset.set);
    const prev = {};
    for (const [k, v] of Object.entries(updates)){
      prev[k] = Object.prototype.hasOwnProperty.call(selectionState, k) ? selectionState[k] : undefined;
      selectionState[k] = v;
    }
    stateStack.push({ updates, prev });
  }catch(err){
    console.warn('data-set inválido', err);
  }
}

function rollbackLastSet(){
  const last = stateStack.pop();
  if (!last) return;
  for (const [k, prevVal] of Object.entries(last.prev)){
    if (prevVal === undefined) delete selectionState[k];
    else selectionState[k] = prevVal;
  }
}

function resetSelectionState(){
  for (const k of Object.keys(selectionState)) delete selectionState[k];
  stateStack.length = 0;
}

function renderOptions(nodeKey){
  const node = flows[currentLang][nodeKey];
  const group = document.createElement('div');
  group.className = 'option-group';

  if (stack.length){
    const back = document.createElement('button');
    back.className = 'nav-chip';
    back.textContent = i18n[currentLang].back;
    back.dataset.back = '1';
    group.appendChild(back);
  }

  const restart = document.createElement('button');
  restart.className = 'nav-chip';
  restart.textContent = i18n[currentLang].restart;
  restart.dataset.restart = '1';
  group.appendChild(restart);

  (node.options || []).forEach(opt=>{
    const b = document.createElement('button');
    b.className = 'option-chip';
    b.textContent = opt.label;
    if (opt.next) b.dataset.next = opt.next;
    if (opt.link) b.dataset.link = opt.link;
    if (opt.set)  b.dataset.set  = JSON.stringify(opt.set);
    group.appendChild(b);
  });
  return group;
}

function renderNode(nodeKey){
  currentNode = nodeKey;
  const node = flows[currentLang][nodeKey];
  if (!node){
    console.warn('Nodo inexistente:', nodeKey);
    return;
  }
  const typing = addTyping();
  setTimeout(()=>{
    typing.remove();

    const raw = (typeof node.text === 'function') ? node.text(selectionState) : node.text;
    const html = (typeof raw === 'string' && raw.includes('<')) ? raw : String(raw).replace(/\n/g, '<br>');

    const box = addHtml(html, 'bot');
    const opts = renderOptions(nodeKey);
    box.dataset.nodeKey = nodeKey;
    box.appendChild(opts);
  }, 350);
}

logEl.addEventListener('click', (e)=>{
  const btn = e.target.closest('button.option-chip, button.nav-chip');
  if (!btn) return;

  if (btn.dataset.restart){
    addMsg(i18n[currentLang].restart, 'me');
    stack.length = 0;
    resetSelectionState();
    renderNode('inicio');
    return;
  }

  if (btn.dataset.back){
    addMsg(i18n[currentLang].back, 'me');
    rollbackLastSet();
    const prev = stack.pop() || 'inicio';
    renderNode(prev);
    return;
  }

  if (btn.dataset.link){
    addMsg(btn.textContent, 'me');
    window.open(btn.dataset.link, '_blank');
    return;
  }

  if (btn.dataset.next){
    addMsg(btn.textContent, 'me');
    applySetFromBtn(btn);
    const currentMsg = btn.closest('.msg');
    const currentKey = currentMsg?.dataset.nodeKey || 'inicio';
    if (currentKey) stack.push(currentKey);
    renderNode(btn.dataset.next);
  }
});

quick.addEventListener('click', (e)=>{
  const b = e.target.closest('button[data-start]');
  if (!b) return;
  const want = b.getAttribute('data-start') || 'inicio';
  const exists = !!flows[currentLang][want];
  addMsg(b.textContent, 'me');
  stack.length = 0;
  renderNode(exists ? want : 'inicio');
});

/** =========================
 *  Preloader + Topbar
 * ========================= */
const MIN_PRELOADER_TIME = 2000;
const bar = document.querySelector('#topbar span');
let p = 0;
const startTime = Date.now();
const tick = setInterval(()=>{
  p += Math.max(5, (100 - p) * 0.25);
  if (p > 100) p = 100;
  bar.style.width = p + '%';
  if (p === 100) clearInterval(tick);
}, 80);

const elapsed = Date.now() - startTime;
const remaining = Math.max(0, MIN_PRELOADER_TIME - elapsed);

window.addEventListener('load', ()=>{
  setTimeout(()=>{
    document.getElementById('preloader')?.classList.add('hidden');
    const topbar = document.getElementById('topbar');
    topbar.style.transition = 'opacity .5s ease';
    topbar.style.opacity = '0';
    setTimeout(()=> topbar.remove(), 600);

    logEl.innerHTML = '';
    applyLanguage(false);
    addHtml(i18n[currentLang].intro, 'bot');
    renderNode('inicio');
  }, remaining);
});
