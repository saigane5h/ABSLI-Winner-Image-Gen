(() => {
  const STORAGE_KEY = 'kh-leaderboard-v1';
  const $ = (sel) => document.querySelector(sel);

  // ---------- Defaults ----------
  const SAMPLE = [
    ['Priya Sharma', 'Mumbai West', 980],
    ['Rahul Mehta', 'Pune Central', 945],
    ['Ananya Iyer', 'Chennai North', 910],
    ['Vikram Singh', 'Delhi NCR', 870],
    ['Sneha Kulkarni', 'Nagpur', 825],
    ['Arjun Nair', 'Kochi', 760],
    ['Meera Joshi', 'Ahmedabad', 715],
    ['Karan Kapoor', 'Chandigarh', 680],
    ['Divya Reddy', 'Hyderabad', 640],
    ['Sahil Verma', 'Lucknow', 590],
  ].map(([name, location, points]) => ({ name, location, points }));

  const fmtDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  function lastWeekRange() {
    const now = new Date();
    const day = (now.getDay() + 6) % 7; // Mon = 0
    const thisMon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
    const lastMon = new Date(thisMon); lastMon.setDate(thisMon.getDate() - 7);
    const lastSun = new Date(thisMon); lastSun.setDate(thisMon.getDate() - 1);
    return `${fmtDate(lastMon)} – ${fmtDate(lastSun)}`;
  }

  function headerDefaults(mode) {
    if (mode === 'weekly') {
      return {
        eyebrow: 'The Keyword Hunter',
        title: 'This Week’s Top 10',
        subtitle: `Ranked by points earned ${lastWeekRange()}`,
      };
    }
    return {
      eyebrow: 'The Keyword Hunter',
      title: 'Yesterday’s Top 10',
      subtitle: 'Ranked by points earned yesterday',
    };
  }

  function boardDefaults(mode) {
    return { ...headerDefaults(mode), pointsLabel: 'points', highlight: 3, entries: SAMPLE.map((e) => ({ ...e })) };
  }

  // ---------- State ----------
  let state = load() || { mode: 'daily', boards: { daily: boardDefaults('daily'), weekly: boardDefaults('weekly') } };
  const board = () => state.boards[state.mode];

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  // ---------- Helpers ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function initials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }
  const fmtPoints = (p) => (p === '' || p == null || isNaN(p) ? '' : Number(p).toLocaleString('en-IN'));

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), 2200);
  }

  // ---------- Card rendering ----------
  const DECO = `
    <svg class="deco" viewBox="0 0 220 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fff1b8"/><stop offset=".45" stop-color="#e6b34a"/>
          <stop offset=".75" stop-color="#b9821f"/><stop offset="1" stop-color="#f3d27a"/>
        </linearGradient>
      </defs>
      <path d="M78 -4 C 62 14, 98 22, 82 40 S 96 66, 78 80 S 92 104, 86 116" fill="none" stroke="url(#gold)" stroke-width="7" stroke-linecap="round"/>
      <path d="M190 -4 C 170 10, 206 22, 186 40 S 204 64, 182 78 S 196 102, 190 116" fill="none" stroke="url(#gold)" stroke-width="7" stroke-linecap="round"/>
      <path d="M150 -6 C 140 6, 160 14, 150 24" fill="none" stroke="url(#gold)" stroke-width="5" stroke-linecap="round" opacity=".85"/>
      <g fill="#f2c45a">
        <rect x="18" y="30" width="7" height="3" rx="1" transform="rotate(-25 21 31)"/>
        <rect x="120" y="22" width="7" height="3" rx="1" transform="rotate(30 123 23)"/>
        <rect x="140" y="70" width="6" height="3" rx="1" transform="rotate(-40 143 71)"/>
        <rect x="104" y="92" width="7" height="3" rx="1" transform="rotate(15 107 93)"/>
        <rect x="206" y="58" width="6" height="3" rx="1" transform="rotate(50 209 59)"/>
        <rect x="46" y="70" width="6" height="3" rx="1" transform="rotate(-10 49 71)"/>
      </g>
      <g fill="#ffd9a0" opacity=".8">
        <circle cx="160" cy="44" r="1.8"/><circle cx="60" cy="16" r="1.6"/><circle cx="212" cy="20" r="1.6"/>
      </g>
    </svg>`;

  function renderCard() {
    const b = board();
    const rows = b.entries.map((e, i) => `
      <div class="lb-row ${i < b.highlight ? 'top' : ''}">
        <div class="rank">${i + 1}</div>
        <div class="avatar">${esc(initials(e.name))}</div>
        <div class="who">
          <div class="name">${esc(e.name)}</div>
          <div class="loc">${esc(e.location)}</div>
        </div>
        <div class="pts">
          <div class="val">${esc(fmtPoints(e.points))}</div>
          <div class="lbl">${esc(b.pointsLabel)}</div>
        </div>
      </div>`).join('');

    $('#card').innerHTML = `
      <div class="card-header">
        ${DECO}
        <div class="eyebrow">${esc(b.eyebrow)}</div>
        <div class="card-title">${esc(b.title)}</div>
        <div class="card-sub">${esc(b.subtitle)}</div>
      </div>
      <div class="card-list">${rows || '<div class="empty">No winners yet — add some on the left.</div>'}</div>`;
  }

  // ---------- Editor rendering ----------
  const FIELDS = ['eyebrow', 'title', 'subtitle', 'pointsLabel'];

  function renderHeaderFields() {
    const b = board();
    FIELDS.forEach((f) => ($('#f-' + f).value = b[f]));
    $('#f-highlight').value = b.highlight;
  }

  function renderEntries() {
    const b = board();
    $('#count').textContent = `(${b.entries.length})`;
    $('#entries').innerHTML = b.entries.map((e, i) => `
      <div class="entry" data-i="${i}">
        <span class="num">${i + 1}</span>
        <input type="text" data-k="name" value="${esc(e.name)}" placeholder="Name" />
        <input type="text" data-k="location" value="${esc(e.location)}" placeholder="Location" />
        <input type="number" data-k="points" value="${esc(e.points)}" placeholder="0" />
        <span class="actions">
          <button data-act="up" title="Move up">↑</button>
          <button data-act="down" title="Move down">↓</button>
          <button data-act="del" title="Remove">✕</button>
        </span>
      </div>`).join('');
  }

  function renderAll() {
    document.querySelectorAll('.mode-switch button').forEach((btn) => btn.classList.toggle('active', btn.dataset.mode === state.mode));
    renderHeaderFields();
    renderEntries();
    renderCard();
  }

  function commit({ editor = false } = {}) {
    save();
    if (editor) renderEntries();
    renderCard();
  }

  // ---------- Events ----------
  document.querySelectorAll('.mode-switch button').forEach((btn) =>
    btn.addEventListener('click', () => { state.mode = btn.dataset.mode; save(); renderAll(); }));

  FIELDS.forEach((f) => $('#f-' + f).addEventListener('input', (ev) => { board()[f] = ev.target.value; commit(); }));
  $('#f-highlight').addEventListener('input', (ev) => { board().highlight = Math.max(0, parseInt(ev.target.value, 10) || 0); commit(); });

  $('#btn-defaults').addEventListener('click', () => { Object.assign(board(), headerDefaults(state.mode)); save(); renderAll(); });

  $('#entries').addEventListener('input', (ev) => {
    const row = ev.target.closest('.entry'); if (!row) return;
    const e = board().entries[+row.dataset.i];
    const k = ev.target.dataset.k;
    e[k] = k === 'points' ? (ev.target.value === '' ? '' : Number(ev.target.value)) : ev.target.value;
    commit();
  });

  $('#entries').addEventListener('click', (ev) => {
    const btn = ev.target.closest('button[data-act]'); if (!btn) return;
    const list = board().entries;
    const i = +btn.closest('.entry').dataset.i;
    if (btn.dataset.act === 'del') list.splice(i, 1);
    if (btn.dataset.act === 'up' && i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
    if (btn.dataset.act === 'down' && i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
    commit({ editor: true });
  });

  $('#btn-add').addEventListener('click', () => {
    board().entries.push({ name: '', location: '', points: '' });
    commit({ editor: true });
    const inputs = document.querySelectorAll('#entries .entry:last-child input');
    inputs[0]?.focus();
  });

  const sortByPoints = (list) => list.sort((a, b) => (Number(b.points) || 0) - (Number(a.points) || 0));
  $('#btn-sort').addEventListener('click', () => { sortByPoints(board().entries); commit({ editor: true }); });

  $('#btn-bulk').addEventListener('click', () => {
    const lines = $('#bulk').value.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const entries = lines.map((line) => {
      const cols = (line.includes('\t') ? line.split('\t') : line.split(',')).map((c) => c.trim());
      const pts = cols.length > 1 ? Number(String(cols[cols.length - 1]).replace(/[^\d.-]/g, '')) : '';
      const hasPts = cols.length > 1 && !isNaN(pts) && cols[cols.length - 1] !== '';
      return {
        name: cols[0] || '',
        location: (hasPts ? cols.slice(1, -1) : cols.slice(1)).join(', '),
        points: hasPts ? pts : '',
      };
    }).filter((e) => e.name);
    if (!entries.length) return toast('Nothing to import — check the format.');
    if ($('#bulk-sort').checked) sortByPoints(entries);
    board().entries = entries;
    commit({ editor: true });
    toast(`Imported ${entries.length} winners`);
  });

  $('#btn-sample').addEventListener('click', () => { board().entries = SAMPLE.map((e) => ({ ...e })); commit({ editor: true }); });
  $('#btn-clear').addEventListener('click', () => {
    if (confirm('Clear all winners from the ' + state.mode + ' list?')) { board().entries = []; commit({ editor: true }); }
  });

  $('#btn-export-json').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `keyword-hunter-data-${new Date().toISOString().slice(0, 10)}.json`);
  });
  $('#import-json').addEventListener('change', async (ev) => {
    const file = ev.target.files[0]; if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!data.boards?.daily || !data.boards?.weekly) throw new Error('bad shape');
      state = data; save(); renderAll(); toast('Data imported');
    } catch { toast('That file is not a valid leaderboard export.'); }
    ev.target.value = '';
  });

  // ---------- Export image ----------
  function downloadBlob(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function imageFilename() {
    const d = new Date();
    if (state.mode === 'daily') d.setDate(d.getDate() - 1); // daily board shows yesterday
    return `keyword-hunter-${state.mode}-${d.toISOString().slice(0, 10)}.png`;
  }

  async function renderPng() {
    await document.fonts.ready;
    const node = $('#card');
    return htmlToImage.toBlob(node, {
      pixelRatio: Number($('#scale').value),
      style: { boxShadow: 'none' },
      cacheBust: true,
    });
  }

  $('#btn-download').addEventListener('click', async () => {
    try { downloadBlob(await renderPng(), imageFilename()); toast('PNG downloaded'); }
    catch (err) { console.error(err); toast('Export failed — see console.'); }
  });

  $('#btn-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': renderPng() })]);
      toast('Image copied — paste into WhatsApp / Slack / email');
    } catch (err) { console.error(err); toast('Copy not supported here — use Download.'); }
  });

  renderAll();
})();
