// 手写 SVG 图表：折线、柱状、环形、迷你趋势线、横向条形。
// 零依赖，纯字符串拼 SVG，全部离线可用。

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function niceTicks(min, max, count) {
  if (max === min) max = min + 1;
  const step = (max - min) / (count - 1);
  const ticks = [];
  for (let i = 0; i < count; i++) ticks.push(min + step * i);
  return ticks;
}

function fmtTick(v) {
  const a = Math.abs(v);
  if (a >= 1000) return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (a >= 100) return String(Math.round(v * 10) / 10);
  return String(Math.round(v * 100) / 100);
}

// 折线图：points = [{year, value}]，label 用于纵轴标题
export function lineChart(points, opts = {}) {
  const w = opts.width || 720;
  const h = opts.height || 300;
  const color = opts.color || '#0e7490';
  const padL = 58, padR = 16, padT = opts.title ? 32 : 18, padB = 34;
  const vals = points.map((p) => p.value);
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  const span = max - min || 1;
  min -= span * 0.12;
  max += span * 0.12;
  const x = (i) => padL + (i * (w - padL - padR)) / Math.max(points.length - 1, 1);
  const y = (v) => padT + (1 - (v - min) / (max - min)) * (h - padT - padB);
  const ticks = niceTicks(min, max, 5);
  let g = '';
  ticks.forEach((t) => {
    g += `<line x1="${padL}" y1="${y(t)}" x2="${w - padR}" y2="${y(t)}" stroke="#e3e8ef" stroke-width="1"/>`;
    g += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#7a8694">${fmtTick(t)}</text>`;
  });
  const area = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  g += `<path d="${area} L${x(points.length - 1).toFixed(1)},${h - padB} L${x(0).toFixed(1)},${h - padB} Z" fill="${color}" fill-opacity="0.08"/>`;
  g += `<path d="${area}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>`;
  points.forEach((p, i) => {
    g += `<circle cx="${x(i)}" cy="${y(p.value)}" r="3.5" fill="#fff" stroke="${color}" stroke-width="2"/>`;
    if (opts.showValues) {
      g += `<text x="${x(i)}" y="${y(p.value) - 9}" text-anchor="middle" font-size="11" fill="#334155">${fmtTick(p.value)}</text>`;
    }
    if (i % 2 === 0 || points.length <= 6) {
      g += `<text x="${x(i)}" y="${h - 12}" text-anchor="middle" font-size="11" fill="#7a8694">${p.year}</text>`;
    }
  });
  const title = opts.title ? `<text x="${padL}" y="12" font-size="12" fill="#475569">${esc(opts.title)}</text>` : '';
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${esc(opts.title || '折线图')}">${title}${g}</svg>`;
}

// 柱状图：points = [{year, value}]
export function barChart(points, opts = {}) {
  const w = opts.width || 720;
  const h = opts.height || 300;
  const color = opts.color || '#1d4ed8';
  const padL = 58, padR = 16, padT = opts.title ? 32 : 18, padB = 34;
  const vals = points.map((p) => p.value);
  const max = Math.max(...vals, 0) * 1.12;
  const min = Math.min(...vals, 0) * 1.12;
  const slot = (w - padL - padR) / points.length;
  const y = (v) => padT + (1 - (v - min) / (max - min)) * (h - padT - padB);
  const ticks = niceTicks(min, max, 5);
  let g = '';
  ticks.forEach((t) => {
    g += `<line x1="${padL}" y1="${y(t)}" x2="${w - padR}" y2="${y(t)}" stroke="#e3e8ef" stroke-width="1"/>`;
    g += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#7a8694">${fmtTick(t)}</text>`;
  });
  points.forEach((p, i) => {
    const bw = Math.min(slot * 0.62, 44);
    const bx = padL + i * slot + (slot - bw) / 2;
    const top = y(Math.max(p.value, 0));
    const base = y(Math.min(p.value, 0));
    g += `<rect x="${bx.toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(base - top, 1).toFixed(1)}" rx="3" fill="${p.highlight ? '#b45309' : color}"/>`;
    if (opts.showValues) {
      g += `<text x="${(bx + bw / 2).toFixed(1)}" y="${(top - 6).toFixed(1)}" text-anchor="middle" font-size="11" fill="#334155">${fmtTick(p.value)}</text>`;
    }
    g += `<text x="${(bx + bw / 2).toFixed(1)}" y="${h - 12}" text-anchor="middle" font-size="11" fill="#7a8694">${p.year}</text>`;
  });
  const title = opts.title ? `<text x="${padL}" y="12" font-size="12" fill="#475569">${esc(opts.title)}</text>` : '';
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${esc(opts.title || '柱状图')}">${title}${g}</svg>`;
}

// 柱状 + 折线双轴：bars 为柱，line 为折线（各自归一化到同一画布）
export function barLineChart(bars, line, opts = {}) {
  const w = opts.width || 720;
  const h = opts.height || 320;
  const padL = 58, padR = 58, padT = opts.title ? 32 : 18, padB = 34;
  const bMax = Math.max(...bars.map((p) => p.value), 0) * 1.12;
  const lVals = line.map((p) => p.value);
  let lMin = Math.min(...lVals);
  let lMax = Math.max(...lVals);
  const lSpan = lMax - lMin || 1;
  lMin -= lSpan * 0.25;
  lMax += lSpan * 0.25;
  const slot = (w - padL - padR) / bars.length;
  const yB = (v) => padT + (1 - v / bMax) * (h - padT - padB);
  const yL = (v) => padT + (1 - (v - lMin) / (lMax - lMin)) * (h - padT - padB);
  const ticks = niceTicks(0, bMax, 5);
  let g = '';
  ticks.forEach((t) => {
    g += `<line x1="${padL}" y1="${yB(t)}" x2="${w - padR}" y2="${yB(t)}" stroke="#e3e8ef" stroke-width="1"/>`;
    g += `<text x="${padL - 8}" y="${yB(t) + 4}" text-anchor="end" font-size="11" fill="#7a8694">${fmtTick(t)}</text>`;
  });
  const lTicks = niceTicks(lMin, lMax, 4);
  lTicks.forEach((t) => {
    g += `<text x="${w - padR + 8}" y="${yL(t) + 4}" font-size="11" fill="#b45309">${fmtTick(t)}%</text>`;
  });
  bars.forEach((p, i) => {
    const bw = Math.min(slot * 0.6, 42);
    const bx = padL + i * slot + (slot - bw) / 2;
    g += `<rect x="${bx.toFixed(1)}" y="${yB(p.value).toFixed(1)}" width="${bw.toFixed(1)}" height="${(h - padB - yB(p.value)).toFixed(1)}" rx="3" fill="#1d4ed8" fill-opacity="0.85"/>`;
    g += `<text x="${(bx + bw / 2).toFixed(1)}" y="${h - 12}" text-anchor="middle" font-size="11" fill="#7a8694">${p.year}</text>`;
  });
  const path = line.map((p, i) => `${i === 0 ? 'M' : 'L'}${(padL + i * slot + slot / 2).toFixed(1)},${yL(p.value).toFixed(1)}`).join(' ');
  g += `<path d="${path}" fill="none" stroke="#b45309" stroke-width="2.5" stroke-linejoin="round"/>`;
  line.forEach((p, i) => {
    g += `<circle cx="${(padL + i * slot + slot / 2).toFixed(1)}" cy="${yL(p.value).toFixed(1)}" r="3.5" fill="#fff" stroke="#b45309" stroke-width="2"/>`;
  });
  const title = opts.title ? `<text x="${padL}" y="12" font-size="12" fill="#475569">${esc(opts.title)}</text>` : '';
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${esc(opts.title || '柱状折线图')}">${title}${g}</svg>`;
}

// 环形图：parts = [{label, value, color}]
export function donut(parts, opts = {}) {
  const size = opts.size || 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r * 0.62;
  const total = parts.reduce((a, p) => a + p.value, 0) || 1;
  let angle = -Math.PI / 2;
  let g = '';
  const legend = [];
  parts.forEach((p) => {
    const frac = p.value / total;
    const a2 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    const xi1 = cx + inner * Math.cos(angle);
    const yi1 = cy + inner * Math.sin(angle);
    const xi2 = cx + inner * Math.cos(a2);
    const yi2 = cy + inner * Math.sin(a2);
    g += `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} L${xi2.toFixed(1)},${yi2.toFixed(1)} A${inner},${inner} 0 ${large} 0 ${xi1.toFixed(1)},${yi1.toFixed(1)} Z" fill="${p.color}"/>`;
    angle = a2;
    legend.push(`<div class="legend-item"><span class="swatch" style="background:${p.color}"></span>${esc(p.label)}<b>${p.value.toFixed(1)}%</b></div>`);
  });
  const center = opts.center || '';
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="环形图">${g}<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="20" font-weight="700" fill="#0f2a4a">${esc(center)}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="11" fill="#7a8694">${esc(opts.centerSub || '')}</text></svg><div class="legend">${legend.join('')}</div></div>`;
}

// 迷你趋势线（卡片用）：values 为数字数组
export function sparkline(values, opts = {}) {
  const w = opts.width || 120;
  const h = opts.height || 36;
  const color = opts.color || '#0e7490';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i) => (i * w) / Math.max(values.length - 1, 1);
  const y = (v) => 4 + (1 - (v - min) / span) * (h - 8);
  const path = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><path d="${path}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/><circle cx="${x(values.length - 1)}" cy="${y(values[values.length - 1])}" r="3" fill="${color}"/></svg>`;
}

// 横向条形：items = [{label, value, max, color, note}]
export function hbars(items, opts = {}) {
  const w = opts.width || 680;
  const rows = items.map((it) => {
    const pct = Math.max(0, Math.min(100, (it.value / (it.max || 1)) * 100));
    return `<div class="hbar-row"><span class="hbar-label">${esc(it.label)}</span><div class="hbar-track"><div class="hbar-fill" style="width:${pct.toFixed(1)}%;background:${it.color || '#0e7490'}"></div></div><span class="hbar-value">${esc(it.note || String(it.value))}</span></div>`;
  }).join('');
  return `<div class="hbars" style="max-width:${w}px">${rows}</div>`;
}
