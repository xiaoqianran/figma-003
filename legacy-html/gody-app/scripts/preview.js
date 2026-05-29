// GODY Integrated Prototype - Preview Controller
// This gradually unifies all the previously scattered HTML pages into one experience.

let currentPath = null;
let pageRegistry = [];
let chromeVisible = false;

async function init() {
  // Load page registry (generated at build time)
  try {
    const res = await fetch('./page-registry.json');
    pageRegistry = await res.json();
  } catch (e) {
    // Fallback hardcoded (in case of file:// restrictions)
    pageRegistry = await getFallbackRegistry();
  }

  renderPageList(pageRegistry);
  renderQuickFlow();
  setupSearch();
  setupIframeListeners();

  // Default to login page - the entry point of the app
  setTimeout(() => {
    loadPage('login-page/index.html', true);
  }, 120);

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard);
  
  console.log('%c[GODY] Integrated preview initialized with ' + pageRegistry.length + ' screens', 'color:#64748b');
}

function getFallbackRegistry() {
  // Minimal fallback if fetch fails (file protocol)
  return Promise.resolve([
    { path: "login-page/index.html", display: "Login" },
    { path: "signup-page/index.html", display: "Signup" },
    { path: "home-page/index.html", display: "Home" },
    { path: "trips-pages/your-trips-upcoming.html", display: "Trips • Upcoming" },
    { path: "account-pages/profile.html", display: "Account • Profile" },
    { path: "payment-pages/select-payment.html", display: "Payment" },
    { path: "search1-page/index.html", display: "Search" }
  ]);
}

// Render grouped navigation
function renderPageList(pages) {
  const container = document.getElementById('page-list');
  container.innerHTML = '';

  // Group pages logically
  const groups = {
    'Authentication': pages.filter(p => p.path.includes('login') || p.path.includes('signup')),
    'Main': pages.filter(p => p.path.includes('home-page') || p.path.includes('notification')),
    'Search & Discovery': pages.filter(p => p.path.includes('search')),
    'Booking Flow': pages.filter(p => 
      p.path.includes('choose-') || 
      p.path.includes('confirm-') || 
      p.path.includes('requesting') ||
      p.path.includes('schedule-page')
    ),
    'Trips & Activity': pages.filter(p => p.path.includes('trip') || p.path.includes('trips')),
    'Payments': pages.filter(p => p.path.includes('payment')),
    'Account': pages.filter(p => p.path.includes('account')),
    'Maps': pages.filter(p => p.path.includes('map')),
    'Other': pages.filter(p => p.path.includes('evaluate'))
  };

  Object.entries(groups).forEach(([groupName, items]) => {
    if (items.length === 0) return;

    const header = document.createElement('div');
    header.className = 'section-header';
    header.textContent = groupName;
    container.appendChild(header);

    items.forEach(page => {
      const item = document.createElement('div');
      item.className = `nav-item flex items-center gap-2.5 px-3 py-[7px] mx-1 rounded-2xl text-sm cursor-pointer mb-px text-slate-300 hover:text-slate-100`;
      item.innerHTML = `
        <i class="fa-solid ${getIconForPage(page.path)} w-4 text-center text-slate-400"></i>
        <span class="flex-1 truncate">${page.display}</span>
      `;
      
      item.onclick = () => loadPage(page.path);
      
      // Store reference for active state
      item.dataset.path = page.path;
      
      container.appendChild(item);
    });
  });
}

function getIconForPage(path) {
  if (path.includes('login') || path.includes('signup')) return 'fa-sign-in-alt';
  if (path.includes('home')) return 'fa-home';
  if (path.includes('search')) return 'fa-search';
  if (path.includes('trip') || path.includes('trips')) return 'fa-route';
  if (path.includes('payment')) return 'fa-credit-card';
  if (path.includes('account') || path.includes('profile')) return 'fa-user';
  if (path.includes('map')) return 'fa-map';
  if (path.includes('confirm')) return 'fa-check-circle';
  if (path.includes('choose')) return 'fa-car';
  if (path.includes('request')) return 'fa-clock';
  if (path.includes('schedule')) return 'fa-calendar';
  if (path.includes('evaluate')) return 'fa-star';
  return 'fa-file';
}

function renderQuickFlow() {
  const container = document.getElementById('quick-flow');
  
  // A realistic end-to-end user journey
  const flow = [
    { label: 'Login', path: 'login-page/index.html' },
    { label: 'Home', path: 'home-page/index.html' },
    { label: 'Search', path: 'search1-page/index.html' },
    { label: 'Choose Trip', path: 'choose-trip1-page/index.html' },
    { label: 'Confirm', path: 'confirm-pickup1-page/index.html' },
    { label: 'Pay', path: 'payment-pages/select-payment.html' }
  ];

  flow.forEach((step, i) => {
    const el = document.createElement('div');
    el.className = `flow-step flex-1 text-center font-medium text-[#713f12]`;
    el.innerHTML = step.label;
    el.onclick = () => loadPage(step.path);
    container.appendChild(el);
    
    if (i < flow.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'text-[#854d0e] self-center px-0.5 text-xs';
      arrow.innerHTML = '→';
      container.appendChild(arrow);
    }
  });
}

function setupSearch() {
  const input = document.getElementById('search-input');
  
  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    
    document.querySelectorAll('#page-list .nav-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? '' : 'none';
    });
    
    // Also show/hide section headers dynamically (simple version)
    document.querySelectorAll('#page-list .section-header').forEach(h => {
      let hasVisible = false;
      let sibling = h.nextElementSibling;
      while (sibling && !sibling.classList.contains('section-header')) {
        if (sibling.style.display !== 'none') hasVisible = true;
        sibling = sibling.nextElementSibling;
      }
      h.style.display = (hasVisible || !q) ? '' : 'none';
    });
  });
  
  // Clear on escape
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      document.querySelectorAll('#page-list .nav-item').forEach(i => i.style.display = '');
      document.querySelectorAll('#page-list .section-header').forEach(h => h.style.display = '');
    }
  });
}

function setupIframeListeners() {
  const iframe = document.getElementById('preview-iframe');
  
  iframe.onload = () => {
    const status = document.getElementById('iframe-status');
    status.textContent = 'Loaded';
    status.className = 'text-emerald-400';
    
    // Try to inject a small helper script into iframe for better integration (optional)
    tryInjectIntegrationScript(iframe);
    
    // After a short delay, update status back
    setTimeout(() => {
      status.textContent = 'Ready';
      status.className = 'text-slate-400';
    }, 1400);
  };

  iframe.onerror = () => {
    document.getElementById('iframe-status').textContent = 'Error loading';
  };
}

// Attempt to make the page inside the iframe aware of the unified shell (progressive enhancement)
function tryInjectIntegrationScript(iframe) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (!doc) return;

    // Add a tiny badge so users know they are in the integrated preview
    const badge = doc.createElement('div');
    badge.style.cssText = 'position:fixed;bottom:52px;right:12px;background:#111;color:#fde047;font-size:9px;padding:1px 6px;border-radius:3px;opacity:0.6;z-index:99999;pointer-events:none;';
    badge.textContent = 'integrated';
    
    // Only add if the page has a body
    if (doc.body) {
      doc.body.appendChild(badge);
      
      // Auto-remove after 3 seconds
      setTimeout(() => badge.remove(), 2800);
    }
  } catch (err) {
    // Cross-origin or file:// restrictions — silently ignore
  }
}

function loadPage(path, isInitial = false) {
  const iframe = document.getElementById('preview-iframe');
  const frame = document.getElementById('phone-frame');
  
  // Resolve relative to the project root (two levels up from gody-app/)
  const resolvedSrc = '../' + path;
  
  iframe.src = resolvedSrc;
  currentPath = path;

  // UI updates
  updateActiveNav(path);
  updateInfoPanel(path);
  updateToolbar(path);

  // Visual feedback
  frame.style.boxShadow = '0 0 0 1px #444, 0 25px 60px -12px rgb(0 0 0 / 0.4), 0 10px 20px -4px rgb(0 0 0 / 0.3)';
  setTimeout(() => {
    frame.style.boxShadow = '0 0 0 1px #333, 0 25px 60px -12px rgb(0 0 0 / 0.4), 0 10px 20px -4px rgb(0 0 0 / 0.3)';
  }, 380);

  // Auto show chrome for certain flows
  if (!isInitial && (path.includes('home') || path.includes('trip') || path.includes('profile'))) {
    if (!chromeVisible) setTimeout(() => showAppChrome(), 650);
  }

  // Update hash for shareable links (future)
  history.replaceState(null, '', '#' + path);
}

function updateActiveNav(path) {
  document.querySelectorAll('#page-list .nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.path === path);
    if (el.classList.contains('active')) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}

function updateToolbar(path) {
  const nameEl = document.getElementById('current-page-name');
  const pathEl = document.getElementById('current-page-path');
  
  const pageInfo = pageRegistry.find(p => p.path === path) || { display: path.split('/')[0], path };
  
  nameEl.textContent = pageInfo.display || path;
  pathEl.textContent = path;
}

function updateInfoPanel(path) {
  const panel = document.getElementById('info-panel');
  
  const pageInfo = pageRegistry.find(p => p.path === path);
  const folder = path.split('/')[0];
  
  let html = `
    <div>
      <div class="font-semibold">${pageInfo?.display || path}</div>
      <div class="text-xs text-slate-500 mt-0.5 font-mono">${path}</div>
    </div>
    
    <div class="pt-1">
      <div class="text-xs text-slate-400">Belongs to flow:</div>
      <div class="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs" style="background:#27251f;color:#fde047">
        ${getFlowName(folder)}
      </div>
    </div>
  `;
  
  if (path.includes('login') || path.includes('signup')) {
    html += `<div class="text-xs bg-slate-800 p-2 rounded-xl">Entry point. Social + phone login supported in design.</div>`;
  }
  if (path.includes('home')) {
    html += `<div class="text-xs bg-slate-800 p-2 rounded-xl">Main map screen. Primary entry after auth.</div>`;
  }
  
  panel.innerHTML = html;
}

function getFlowName(folder) {
  const map = {
    'login-page': 'Auth',
    'signup-page': 'Auth',
    'home-page': 'Core',
    'search1-page': 'Discovery',
    'search2-page': 'Discovery',
    'choose-car-page': 'Booking',
    'choose-trip1-page': 'Booking',
    'confirm-pickup1-page': 'Booking',
    'payment-pages': 'Payments',
    'trips-pages': 'Trips',
    'trip-pages': 'Trips',
    'account-pages': 'Account'
  };
  return map[folder] || 'Feature';
}

function reloadIframe() {
  const iframe = document.getElementById('preview-iframe');
  if (currentPath) {
    iframe.src = iframe.src; // force reload
  }
}

function openOriginalCurrent() {
  if (!currentPath) return;
  window.open('../' + currentPath, '_blank');
}

function navigateViaChrome(path) {
  loadPage(path);
  
  // Highlight active tab temporarily
  document.querySelectorAll('#app-chrome-tabs .tab-btn').forEach(btn => {
    btn.classList.remove('!text-[#fecc2a]');
    if (btn.getAttribute('onclick')?.includes(path)) {
      btn.classList.add('!text-[#fecc2a]');
      setTimeout(() => btn.classList.remove('!text-[#fecc2a]'), 800);
    }
  });
}

function showAppChrome() {
  const tabs = document.getElementById('app-chrome-tabs');
  tabs.classList.remove('hidden');
  tabs.classList.add('flex');
  chromeVisible = true;
}

function hideAppChrome() {
  const tabs = document.getElementById('app-chrome-tabs');
  tabs.classList.add('hidden');
  tabs.classList.remove('flex');
  chromeVisible = false;
}

function toggleAppChrome() {
  const tabs = document.getElementById('app-chrome-tabs');
  if (tabs.classList.contains('hidden')) {
    showAppChrome();
  } else {
    hideAppChrome();
  }
}

function resetToHome() {
  loadPage('home-page/index.html');
}

function handleKeyboard(e) {
  if (e.metaKey && e.key === 'k') {
    e.preventDefault();
    document.getElementById('search-input').focus();
    document.getElementById('search-input').select();
  }
  
  if (e.key === '?' && document.activeElement.tagName === 'BODY') {
    e.preventDefault();
    showIntegrationHelp();
  }
  
  if (e.key.toLowerCase() === 'r' && e.target === document.body) {
    reloadIframe();
  }
}

function showIntegrationHelp() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/70 z-[999] flex items-center justify-center p-6';
  modal.innerHTML = `
    <div onclick="event.target.remove()" class="absolute inset-0"></div>
    <div onclick="event.stopImmediatePropagation()" class="relative bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-7 text-sm">
      <div class="flex justify-between items-start">
        <div>
          <div class="font-semibold text-xl">How to Gradually Integrate Pages</div>
          <div class="text-xs text-slate-400 mt-1">Current architecture: iframe shell + page registry</div>
        </div>
        <button onclick="this.closest('.fixed').remove()" class="text-2xl leading-none text-slate-400 hover:text-white">&times;</button>
      </div>
      
      <div class="mt-6 space-y-5 text-slate-300">
        <div>
          <div class="font-semibold mb-1 text-[#fecc2a]">Step 1 — Already done</div>
          <div class="text-xs">All 44 HTML files are now discoverable and runnable from a single beautiful device frame with working relative navigation.</div>
        </div>
        
        <div>
          <div class="font-semibold mb-1 text-[#fecc2a]">Step 2 — Extract shared chrome (recommended next)</div>
          <div class="text-xs">Create <span class="font-mono bg-slate-800 px-1 rounded">gody-app/components/bottom-tab.html</span> and inject it via JS into pages that don't have native nav.</div>
        </div>
        
        <div>
          <div class="font-semibold mb-1 text-[#fecc2a]">Step 3 — Promote important flows</div>
          <div class="text-xs">Pick 1 full user journey (e.g. Login → Home → Search → Choose Trip → Confirm → Pay). Copy the inner content of those 5–6 pages into <span class="font-mono bg-slate-800 px-1 rounded">/views/*.html</span> partials and render them without iframe for shared CSS/JS state.</div>
        </div>
        
        <div>
          <div class="font-semibold mb-1 text-[#fecc2a]">Step 4 — React migration (long term)</div>
          <div class="text-xs">The .figma/ folder already contains many index.jsx + *.module.scss files. Use these as the basis for a real Vite + React + React Router single-page app.</div>
        </div>
      </div>
      
      <div class="mt-6 pt-5 border-t border-slate-700 text-[11px] text-slate-400">
        Tip: Press <span class="font-mono bg-slate-800 px-1">⌘K</span> to focus search. Press <span class="font-mono bg-slate-800 px-1">R</span> to reload current screen.
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Initialize everything
init();

// Bonus: Support deep links via hash on load
window.addEventListener('load', () => {
  const hash = location.hash.replace('#', '');
  if (hash && hash.includes('.html')) {
    setTimeout(() => {
      const iframe = document.getElementById('preview-iframe');
      if (iframe) {
        loadPage(hash);
      }
    }, 400);
  }
});
