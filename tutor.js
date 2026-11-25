(function () {
  'use strict';

  const STORAGE_KEY = 'wiring_tutor_cfg_v1';

  const DEFAULT_MODELS = {
    local: 'built-in-free',
    gemini: 'gemini-2.5-flash-lite',
    openai: 'gpt-4o-mini',
    custom: 'gpt-4o-mini'
  };

  function loadCfg() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { provider: 'local', apiKey: '', model: DEFAULT_MODELS.local, endpoint: '' };
      const parsed = JSON.parse(raw);
      return {
        provider: parsed.provider || 'local',
        apiKey: parsed.apiKey || '',
        model: parsed.model || DEFAULT_MODELS[parsed.provider || 'local'] || DEFAULT_MODELS.gemini,
        endpoint: parsed.endpoint || ''
      };
    } catch (e) {
      return { provider: 'local', apiKey: '', model: DEFAULT_MODELS.local, endpoint: '' };
    }
  }

  function saveCfg(cfg) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch (e) {
      /* ignore storage quota errors */
    }
  }

  const tutorState = {
    open: false,
    showSettings: false,
    busy: false,
    cfg: loadCfg(),
    messages: [
      {
        role: 'bot',
        text: 'Hi! I’m your **12V DC Wiring Tutor**. Ask me anything about volts, Romex colors, why a part is needed, or what’s happening on the current panel.\n\n*(Running in **Built-in Free** mode right now—or click **⚙ Model** above to connect a cheap model like `gemini-2.5-flash-lite` or `gpt-4o-mini`.)*'
      }
    ]
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatInlineMarkdown(raw) {
    let safe = escapeHtml(raw);
    safe = safe.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    safe = safe.replace(/\n/g, '<br>');
    return safe;
  }

  function getContext() {
    if (typeof window.getWiringTutorContext === 'function') {
      return window.getWiringTutorContext();
    }
    return {
      panel: 1,
      totalPanels: 14,
      phase: 'Overview',
      title: '12V DC Residential Wiring Board',
      narration: '',
      callouts: [],
      simSummary: null
    };
  }

  function getStarterChips(ctx) {
    const p = ctx.panel;
    if (p === 1) return ['What is Voltage vs Amps?', 'Why does a loop have to close?', 'Why 12V DC instead of 120V AC?'];
    if (p === 2) return ['What does 14/2 vs 14/3 mean?', 'Why do we need a Ground wire?', 'What is the White wire for?'];
    if (p === 3) return ['Why do we need 5A fuses?', 'What do the Brass bus bars do?', 'What does a Wago 221 do?'];
    if (p === 4) return ['Why is Series bad for outlets?', 'Why does Parallel keep 12V?', 'How are our board outlets wired?'];
    if (p === 5 || p === 6) return ['Why label everything 12V DC ONLY?', 'Which bulbs do I need?', 'Can I use wire nuts instead of Wagos?'];
    if (p === 7 || p === 8) return ['Why bond Neutral and Ground?', 'What does the 12V- wire connect to?', 'Why only bond at the main panel?'];
    if (p === 9 || p === 10) return ['Why wrap J-hooks clockwise?', 'Why pigtail instead of daisy-chaining?', 'What screw gets which wire?'];
    if (p === 11) return ['Why break ONLY the brass tab?', 'Why put black tape on a white wire?', 'How does the half-hot outlet work?'];
    if (p === 12) return ['What is the Common screw?', 'What are the 2 Brass traveler screws?', 'How can 2 switches control 1 light?'];
    if (p === 13) return ['Which wire goes to Brass vs Silver?', 'How do I pass Challenge #2?', 'Which screw is Green for?'];
    if (p === 14) return ['How do I use the Multimeter?', 'Why did my Fault Drill break the circuit?', 'Explain what is live right now'];
    return ['Explain this panel simply', 'What wire colors go where?', 'Why do we need fuses?'];
  }

  // =========================================================================
  // BUILT-IN FREE KNOWLEDGE BASE (Zero-cost instant fallback & offline mode)
  // =========================================================================
  const KB = [
    {
      keys: ['volt', 'voltage', 'amp', 'amps', 'current', 'water', 'pressure', 'watt'],
      reply:
        '**Volts** = electrical pressure pushing charges (like water pump pressure). **Amps** = how much current is actually flowing (like gallons per minute). On this board, our 12V supply pushes gently at **12 Volts** and our fuses cap flow at **5 Amps** so nothing overheats.'
    },
    {
      keys: ['loop', 'closed', 'open', 'circle', 'return'],
      reply:
        'Electricity only flows in a **complete closed loop**. Power leaves the **+12V** fuse, travels along the Black Hot wire into your bulb/outlet, and **must** return via the White Neutral wire back to the `-12V` Neutral Bus. A switch simply opens or closes a gap in that loop!'
    },
    {
      keys: ['12v', '120v', 'ac', 'dc', 'safe', 'safety', 'shock', 'label', 'only'],
      reply:
        'Real houses use **120V AC** (which can shock or start fires), while our training board uses **12V DC**—touch-safe with zero shock risk. Because our DIY test plug and E26 sockets physically fit 120V wall outlets/bulbs, **always label the board, 12V LED bulbs, and DIY test plug "12V DC ONLY"** and never plug into a wall outlet!'
    },
    {
      keys: ['14/2', '14/3', '14-2', '14-3', 'romex', 'awg', 'gauge', 'nm-b', 'number'],
      reply:
        '**14** means **14 AWG** copper thickness (rated up to 15 Amps). The second number (`/2` or `/3`) counts the **colored insulated wires** inside (not counting the bare ground):\n• **14/2** = Black + White + Bare Ground.\n• **14/3** = Black + **Red** + White + Bare Ground (used between 3-way switches for the two travelers).'
    },
    {
      keys: ['ground', 'bare', 'copper', 'fault', 'green'],
      reply:
        'The **Bare Copper Ground** (landing on **Green screws** and the Ground Bus) carries **0 Amps during normal use**. It is an emergency safety rail: if a loose hot wire ever touches a metal frame or box, Ground gives fault current a super-low-resistance path back to the panel to **pop the fuse immediately**!'
    },
    {
      keys: ['white', 'neutral', 'silver'],
      reply:
        'The **White (Neutral)** wire is the return highway back to the `-12V` Neutral Bus Bar—completing the circuit loop. Neutral always lands on **Silver screws** on outlets and lamp holders.\n*(Exception: in a 14/2 switch loop like Panel 11, a white wire carrying constant +12V to the switch must be wrapped with **black tape** on both ends!)*'
    },
    {
      keys: ['black', 'red', 'hot', 'brass', 'color', 'screw'],
      reply:
        'Easy screw color rule:\n• **Black or Red (Hot +12V)** → **Brass** screws (or the **Dark Common** screw on a 3-way switch).\n• **White (Neutral -12V)** → **Silver** screws.\n• **Bare Copper (Ground)** → **Green** screws.'
    },
    {
      keys: ['fuse', 'breaker', 'overload', 'melt', 'blow', 'blown'],
      reply:
        'Our **5A blade fuses** mimic a home’s circuit breakers. Inside each plastic fuse is a calibrated thin metal link—if a short circuit or overload draws more than **5 Amps**, that link melts in milliseconds and cuts power **before** any Romex wire can get hot.'
    },
    {
      keys: ['bond', 'jumper', 'bus bar', 'bus', 'subpanel', 'panel'],
      reply:
        'Inside the **Main Panel**, the **Neutral Bus Bar** (`-12V` white returns) and **Ground Bus Bar** (bare copper safety wires) are connected by one **Main Bonding Jumper**. This gives the safety ground a path back to the `-12V` supply so a short pops a fuse. In a real home, this bond is made **ONLY** at the main service panel—never in subpanels.'
    },
    {
      keys: ['clockwise', 'j-hook', 'hook', 'torque', 'strip', '5/8'],
      reply:
        'Strip **5/8"** of insulation (using the `14 AWG` notch so you don’t nick copper) and bend a **clockwise J-hook**. Because terminal screws tighten **clockwise**, a clockwise hook gets pulled **inward** tightly under the screw head; counter-clockwise gets pushed outward!'
    },
    {
      keys: ['wago', 'wire nut', 'pigtail', 'splice', 'daisy'],
      reply:
        'A **pigtail** uses a Wago 221 lever connector or wire nut to join the incoming line wire, outgoing load wire, and a short 6" spur wire to the outlet. That way, downstream outlets stay powered **even if you unscrew or remove Outlet #1**!'
    },
    {
      keys: ['series', 'parallel'],
      reply:
        'In **Series**, electricity passes through one bulb to reach the next—so voltage splits (`6V + 6V` = dim) and unplugging one kills everything. In **Parallel**, every outlet bridges across its own Hot & Neutral branch—so every outlet gets the **full 12.0V** independently.'
    },
    {
      keys: ['half-hot', 'half hot', 'tab', 'split', 'break', 'backfeed'],
      reply:
        'Standard duplex outlets have a removable **brass tab** linking the top and bottom hot screws, and a **silver tab** linking the neutral screws. On Outlet #3, snap off **ONLY the brass tab**! That isolates Top (controlled by the Single-Pole Switch) from Bottom (always hot at 12V). Keep the silver tab intact so both share the neutral return.'
    },
    {
      keys: ['tape', 'switch loop', 're-identify'],
      reply:
        'When a standard `14/2` cable (Black + White) runs between Outlet #3 and the Single-Pole Switch, neither wire is used as a neutral—one brings constant `+12V` up to the switch and the other returns switched `+12V` back down. NEC requires wrapping **black electrical tape** on both ends of the white wire so nobody mistakes it for a neutral!'
    },
    {
      keys: ['3-way', '3 way', 'three way', 'traveler', 'common', 'spdt'],
      reply:
        'A **3-way switch** is an SPDT diverter with 3 terminals:\n• **1 Dark Screw (Common):** Power IN on Switch A, Switched Power OUT to the light on Switch B.\n• **2 Brass Screws (Travelers):** Connected by the **Black** and **Red** wires of your `14/3` cable.\nWhenever both switches point to the *same* traveler, the ceiling bulb turns ON!'
    },
    {
      keys: ['bulb', 'led', 'e26', 'rv', 'marine', 'lamp'],
      reply:
        'You must use **12V DC E26 LED bulbs** (made for RVs/boats). Standard 120V AC household LED bulbs have the same screw base (`E26`) but their internal AC driver will not light at 12V DC. Check polarity if a DC-only bulb doesn’t light (Brass center tab = `+12V`, Silver screw shell = `-12V`).'
    },
    {
      keys: ['multimeter', 'dmm', 'continuity', 'ohm', 'measure', 'probe'],
      reply:
        'Set your Digital Multimeter to **DC Volts (`V ⎓`)** to test outlets (`~12.0V` when live, `0.0V` when off or open). Switch to **Continuity (`🔊 / Ω`)** with power OFF to verify the Neutral Bus ↔ Ground Bus bond (`~0.1 Ω` + beep).'
    }
  ];

  function answerLocally(question, ctx) {
    const q = question.toLowerCase();

    // Special live-panel context helper
    if ((q.includes('right now') || q.includes('happening') || q.includes('fault') || q.includes('why did') || q.includes('broken') || q.includes('explain this')) && ctx.simSummary) {
      return `**Current Live Bench Status (Panel ${ctx.panel}):**\n${ctx.simSummary}\n\nTip: Click any red warning badge directly on the board (Fuse #1, the unbroken Brass Tab, the loose Red wire, or the Open Neutral splice) to repair a fault and re-test with your DIY 12V lamp!`;
    }

    let best = null;
    let bestScore = 0;
    for (const item of KB) {
      let score = 0;
      for (const kw of item.keys) {
        if (q.includes(kw)) score += kw.length > 4 ? 2 : 1;
      }
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }

    if (best && bestScore >= 1) {
      return best.reply;
    }

    const calloutNote = (ctx.callouts && ctx.callouts.length)
      ? `\n\n**Key takeaway here:** ${ctx.callouts[0].text}`
      : '';

    return `You’re currently on **Panel ${String(ctx.panel).padStart(2, '0')} (${ctx.title})**.\n\n${ctx.narration}${calloutNote}\n\n*(Ask about a specific wire color, part name, \`14/2\` vs \`14/3\`, pigtails, 3-way switches, or add a free/cheap API key in **⚙ Model** for open-ended Q&A!)*`;
  }

  // =========================================================================
  // LIVE CHEAP-MODEL CLOUD AI CALLS (Gemini 2.5 Flash-Lite / GPT-4o-mini / Custom)
  // =========================================================================
  function buildSystemPrompt(ctx) {
    const calloutLines = (ctx.callouts || []).map((c) => `- [${c.tag}] ${c.text}`).join('\n');
    return [
      'You are a friendly, patient master electrician teaching a complete beginner using a 12V DC Residential Wiring Training Board.',
      'CRITICAL SAFETY RULE: Always remind users never to connect this board, 12V bulbs, or DIY test plug to 120V household wall power.',
      'Be concise (2–4 short sentences or crisp bullets), clear, and encouraging. Use plain language first, then NEC/electrical terms.',
      `Current Storyboard Panel: Panel ${ctx.panel}/${ctx.totalPanels} — ${ctx.title} (${ctx.phase}).`,
      `Panel Summary: ${ctx.narration}`,
      calloutLines ? `Panel Callouts:\n${calloutLines}` : '',
      ctx.simSummary ? `Live Panel 14 Bench State:\n${ctx.simSummary}` : ''
    ].filter(Boolean).join('\n\n');
  }

  async function callCloudModel(question, ctx) {
    const cfg = tutorState.cfg;
    const sysPrompt = buildSystemPrompt(ctx);
    const history = tutorState.messages.slice(-6).filter((m) => m.role === 'user' || m.role === 'bot');

    if (cfg.provider === 'gemini') {
      const model = (cfg.model || DEFAULT_MODELS.gemini).trim();
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(cfg.apiKey.trim())}`;
      const contents = history.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: question }] });

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: sysPrompt }] },
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 320 }
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error((data.error && data.error.message) || `Gemini HTTP ${resp.status}`);
      }
      const text = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
        ? data.candidates[0].content.parts.map((p) => p.text || '').join('')
        : '';
      if (!text.trim()) throw new Error('Empty response from Gemini');
      return text.trim();
    }

    // OpenAI or Custom OpenAI-Compatible endpoint
    const endpoint = cfg.provider === 'openai'
      ? 'https://api.openai.com/v1/chat/completions'
      : (cfg.endpoint || '').trim();
    if (!endpoint) throw new Error('Custom endpoint URL is empty');

    const headers = { 'Content-Type': 'application/json' };
    if (cfg.apiKey && cfg.apiKey.trim()) {
      headers.Authorization = `Bearer ${cfg.apiKey.trim()}`;
    }

    const messages = [{ role: 'system', content: sysPrompt }];
    history.forEach((m) => {
      messages.push({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text });
    });
    messages.push({ role: 'user', content: question });

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: (cfg.model || DEFAULT_MODELS.openai).trim(),
        messages,
        temperature: 0.4,
        max_tokens: 320
      })
    });
    const data = await resp.json();
    if (!resp.ok) {
      throw new Error((data.error && data.error.message) || `API HTTP ${resp.status}`);
    }
    const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!text || !text.trim()) throw new Error('Empty response from model');
    return text.trim();
  }

  function isCloudReady() {
    const c = tutorState.cfg;
    if (c.provider === 'local') return false;
    if (c.provider === 'custom') return Boolean(c.endpoint && c.endpoint.trim());
    return Boolean(c.apiKey && c.apiKey.trim());
  }

  function activeBadgeText() {
    if (!isCloudReady()) return 'Built-in Free';
    return tutorState.cfg.model || DEFAULT_MODELS[tutorState.cfg.provider];
  }

  // =========================================================================
  // UI RENDERING & ACTIONS
  // =========================================================================
  function mountMarkup() {
    const root = document.getElementById('tutor-root');
    if (!root) return;

    root.innerHTML = `
      <button type="button" id="tutor-fab" class="tutor-fab" title="Ask the AI Wiring Tutor (?)" aria-label="Open AI Wiring Tutor">
        <span>💬</span>
        <span>AI Help</span>
        <span id="tutor-fab-badge" class="tutor-fab-pill font-mono">Free</span>
      </button>

      <aside id="tutor-panel" class="tutor-panel hidden" role="dialog" aria-label="AI Wiring Tutor">
        <div class="tutor-header">
          <div>
            <div class="tutor-title-row">
              <strong>AI Wiring Tutor</strong>
              <span id="tutor-model-badge" class="tutor-model-pill font-mono">Built-in Free</span>
            </div>
            <div id="tutor-ctx-line" class="tutor-ctx-line">Panel 01 · Electricity 101</div>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            <button type="button" id="tutor-cfg-btn" class="ui-btn" style="padding:4px 8px; font-size:11.5px;">⚙ Model</button>
            <button type="button" id="tutor-close-btn" class="ui-btn" style="padding:4px 8px; font-size:11.5px;" aria-label="Close AI Tutor">✕</button>
          </div>
        </div>

        <div id="tutor-settings" class="tutor-settings hidden">
          <div class="tutor-set-row">
            <label for="tutor-provider">AI Provider</label>
            <select id="tutor-provider">
              <option value="local">Built-in Free (No API Key)</option>
              <option value="gemini">Google Gemini (gemini-2.5-flash-lite)</option>
              <option value="openai">OpenAI (gpt-4o-mini)</option>
              <option value="custom">Custom OpenAI-Compatible Endpoint</option>
            </select>
          </div>
          <div id="tutor-cloud-fields" class="hidden" style="display:grid; gap:7px;">
            <div class="tutor-set-row">
              <label for="tutor-model">Model ID</label>
              <input type="text" id="tutor-model" placeholder="gemini-2.5-flash-lite" />
            </div>
            <div id="tutor-endpoint-wrap" class="tutor-set-row hidden">
              <label for="tutor-endpoint">Chat Completions URL</label>
              <input type="text" id="tutor-endpoint" placeholder="https://your-worker.workers.dev/v1/chat/completions" />
            </div>
            <div class="tutor-set-row">
              <label for="tutor-key">API Key (stored only in your browser)</label>
              <input type="password" id="tutor-key" placeholder="Paste key (e.g. AIza... or sk-...)" autocomplete="off" />
            </div>
            <p class="tutor-hint">
              Get a free/ultra-cheap Gemini key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a>. Keys stay in <code>localStorage</code> and never touch GitHub.
            </p>
          </div>
          <div style="display:flex; gap:6px; justify-content:flex-end;">
            <button type="button" id="tutor-clear-key" class="ui-btn" style="padding:5px 9px;">Clear Key</button>
            <button type="button" id="tutor-save-cfg" class="ui-btn primary" style="padding:5px 10px;">Save Settings</button>
          </div>
        </div>

        <div id="tutor-chips" class="tutor-chips"></div>

        <div id="tutor-messages" class="tutor-messages" aria-live="polite"></div>

        <form id="tutor-form" class="tutor-input-row">
          <input type="text" id="tutor-input" placeholder="Ask a beginner question about this step…" autocomplete="off" />
          <button type="submit" id="tutor-send" class="ui-btn primary">Ask</button>
        </form>
      </aside>
    `;

    wireEvents();
    syncUI();
  }

  function syncUI() {
    const fab = document.getElementById('tutor-fab');
    const panel = document.getElementById('tutor-panel');
    const hudBtn = document.getElementById('btn-tutor');
    if (!fab || !panel) return;

    panel.classList.toggle('hidden', !tutorState.open);
    fab.classList.toggle('hidden', tutorState.open);
    if (hudBtn) hudBtn.classList.toggle('active-toggle', tutorState.open);

    const badge = activeBadgeText();
    document.getElementById('tutor-model-badge').textContent = badge;
    document.getElementById('tutor-fab-badge').textContent = isCloudReady() ? 'AI' : 'Free';

    const ctx = getContext();
    document.getElementById('tutor-ctx-line').textContent =
      `Panel ${String(ctx.panel).padStart(2, '0')} · ${ctx.phase}`;

    // Starter Chips
    const chipsEl = document.getElementById('tutor-chips');
    chipsEl.innerHTML = getStarterChips(ctx).map((q) => `
      <button type="button" class="tutor-chip" data-tutor-q="${escapeHtml(q)}">${escapeHtml(q)}</button>
    `).join('');

    // Settings
    const setBox = document.getElementById('tutor-settings');
    setBox.classList.toggle('hidden', !tutorState.showSettings);
    const provSel = document.getElementById('tutor-provider');
    const cloudFields = document.getElementById('tutor-cloud-fields');
    const endWrap = document.getElementById('tutor-endpoint-wrap');
    if (tutorState.showSettings) {
      provSel.value = tutorState.cfg.provider;
      const showCloud = provSel.value !== 'local';
      cloudFields.classList.toggle('hidden', !showCloud);
      endWrap.classList.toggle('hidden', provSel.value !== 'custom');
    }

    // Messages
    const msgEl = document.getElementById('tutor-messages');
    msgEl.innerHTML = tutorState.messages.map((m) => `
      <div class="tutor-msg ${m.role}">${formatInlineMarkdown(m.text)}</div>
    `).join('') + (tutorState.busy ? '<div class="tutor-msg bot tutor-typing">Thinking…</div>' : '');
    msgEl.scrollTop = msgEl.scrollHeight;

    const sendBtn = document.getElementById('tutor-send');
    sendBtn.disabled = tutorState.busy;
  }

  async function askQuestion(rawText) {
    const q = (rawText || '').trim();
    if (!q || tutorState.busy) return;

    tutorState.messages.push({ role: 'user', text: q });
    tutorState.busy = true;
    syncUI();

    const ctx = getContext();
    let answer = '';
    if (isCloudReady()) {
      try {
        answer = await callCloudModel(q, ctx);
      } catch (err) {
        const localAns = answerLocally(q, ctx);
        answer = `*(Cloud model error: ${err.message}. Falling back to Built-in Free tutor:)*\n\n${localAns}`;
      }
    } else {
      answer = answerLocally(q, ctx);
    }

    tutorState.busy = false;
    tutorState.messages.push({ role: 'bot', text: answer });
    syncUI();
  }

  function wireEvents() {
    document.getElementById('tutor-fab').addEventListener('click', () => {
      tutorState.open = true;
      syncUI();
      document.getElementById('tutor-input').focus();
    });

    document.getElementById('tutor-close-btn').addEventListener('click', () => {
      tutorState.open = false;
      syncUI();
    });

    document.getElementById('tutor-cfg-btn').addEventListener('click', () => {
      tutorState.showSettings = !tutorState.showSettings;
      if (tutorState.showSettings) {
        document.getElementById('tutor-provider').value = tutorState.cfg.provider;
        document.getElementById('tutor-model').value = tutorState.cfg.model;
        document.getElementById('tutor-endpoint').value = tutorState.cfg.endpoint;
        document.getElementById('tutor-key').value = tutorState.cfg.apiKey;
      }
      syncUI();
    });

    document.getElementById('tutor-provider').addEventListener('change', (e) => {
      const prov = e.target.value;
      const modelInp = document.getElementById('tutor-model');
      modelInp.value = DEFAULT_MODELS[prov] || DEFAULT_MODELS.gemini;
      document.getElementById('tutor-cloud-fields').classList.toggle('hidden', prov === 'local');
      document.getElementById('tutor-endpoint-wrap').classList.toggle('hidden', prov !== 'custom');
    });

    document.getElementById('tutor-save-cfg').addEventListener('click', () => {
      const prov = document.getElementById('tutor-provider').value;
      const model = document.getElementById('tutor-model').value.trim() || DEFAULT_MODELS[prov];
      const endpoint = document.getElementById('tutor-endpoint').value.trim();
      const apiKey = document.getElementById('tutor-key').value.trim();
      tutorState.cfg = { provider: prov, model, endpoint, apiKey };
      saveCfg(tutorState.cfg);
      tutorState.showSettings = false;
      tutorState.messages.push({
        role: 'bot',
        text: isCloudReady()
          ? `Switched to **${model}** (${prov}). Ask me anything!`
          : 'Switched to **Built-in Free** mode (zero API cost).'
      });
      syncUI();
    });

    document.getElementById('tutor-clear-key').addEventListener('click', () => {
      tutorState.cfg = { provider: 'local', model: DEFAULT_MODELS.local, endpoint: '', apiKey: '' };
      saveCfg(tutorState.cfg);
      document.getElementById('tutor-key').value = '';
      document.getElementById('tutor-provider').value = 'local';
      tutorState.showSettings = false;
      syncUI();
    });

    document.getElementById('tutor-chips').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-tutor-q]');
      if (!btn) return;
      askQuestion(btn.getAttribute('data-tutor-q'));
    });

    document.getElementById('tutor-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = document.getElementById('tutor-input');
      const val = inp.value;
      inp.value = '';
      askQuestion(val);
    });
  }

  window.WiringTutor = {
    open() {
      tutorState.open = true;
      syncUI();
      const inp = document.getElementById('tutor-input');
      if (inp) inp.focus();
    },
    close() {
      tutorState.open = false;
      syncUI();
    },
    toggle() {
      tutorState.open = !tutorState.open;
      syncUI();
      if (tutorState.open) {
        const inp = document.getElementById('tutor-input');
        if (inp) inp.focus();
      }
    },
    onContextChange() {
      if (document.getElementById('tutor-panel')) syncUI();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountMarkup);
  } else {
    mountMarkup();
  }
})();
