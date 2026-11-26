// 数观中国 — 路由与页面渲染（hash 路由，全部交互真实可用）
import { YEARS, SERIES, INDUSTRY, AGE_STRUCTURE, PROVINCES, CITIES, SOCIAL, META, valueAt, seriesPoints, fmt } from './data.js';
import { lineChart, barChart, barLineChart, donut, sparkline, hbars } from './charts.js';

const app = document.getElementById('app');
const yearSel = document.getElementById('year');
const searchInput = document.getElementById('search');
const searchBox = document.getElementById('search-results');

let year = 2024;
let ecoMetric = 'gdp';
let ageYear = 2024;
let cmpA = '广东';
let cmpB = '江苏';
let cmpPopA = '广东';
let cmpPopB = '山东';
const sortState = {}; // tableId -> {key, dir}

const NAV = [
  { hash: '#/', label: '总览', id: 'home' },
  { hash: '#/economy', label: '经济', id: 'economy' },
  { hash: '#/population', label: '人口', id: 'population' },
  { hash: '#/livelihood', label: '民生', id: 'livelihood' },
  { hash: '#/environment', label: '环境', id: 'environment' },
];

const SEARCH_INDEX = [
  ...Object.entries(SERIES).map(([key, s]) => ({
    kind: '指标', key, label: s.label, detail: `${s.unit} · 2015–2024 年度序列`,
    page: key === 'gdp' || key === 'gdpGrowth' || key === 'gdpPerCapita' || key === 'income' || key === 'trade' ? 'economy'
      : key === 'population' || key === 'naturalGrowth' || key === 'urbanization' ? 'population'
      : key === 'lifeExpectancy' || key === 'higherEdu' || key === 'healthSpend' ? 'livelihood'
      : key === 'co2' || key === 'renewable' || key === 'forest' || key === 'pm25' ? 'environment' : '',
  })),
  ...PROVINCES.map((p) => ({
    kind: '省份', key: p.name, label: p.name, detail: `2024 年 GDP 约 ${p.gdp} 万亿元 · 人口约 ${p.pop} 万人`,
    page: 'economy',
  })),
  ...CITIES.map((c) => ({
    kind: '城市', key: c.name, label: c.name, detail: `2024 年末常住人口约 ${c.pop} 万人`, page: 'population',
  })),
];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function deltaText(key, y) {
  const cur = valueAt(key, y);
  const prev = valueAt(key, y - 1);
  if (cur === null || prev === null || prev === 0) return { text: '上年数据未发布', cls: 'flat' };
  const d = cur - prev;
  const pct = (d / Math.abs(prev)) * 100;
  const sign = d > 0 ? '+' : '';
  return {
    text: `较上年 ${sign}${d.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}（${sign}${pct.toFixed(1)}%）`,
    cls: d > 0 ? 'up' : d < 0 ? 'down' : 'flat',
  };
}

function kpiCard(key, page) {
  const s = SERIES[key];
  const v = valueAt(key, year);
  const d = deltaText(key, year);
  const pts = seriesPoints(key).map((p) => p.value);
  return `<article class="card kpi"><a href="#/${page}">
    <div class="kpi-label">${esc(s.label)}（${esc(s.unit)}）</div>
    <div class="kpi-value">${v === null ? '未发布' : esc(fmt(key, v).replace(/^约 /, ''))}<small> ${esc(s.unit)}</small></div>
    <div class="kpi-delta ${d.cls}">${esc(d.text)}</div>
    <div class="kpi-spark">${sparkline(pts, { color: '#0e7490' })}</div>
    <div class="hint">2015–2024 年趋势 · ${year} 年</div>
  </a></article>`;
}

function pageHead(title, intro) {
  return `<div class="page-head"><h1>${esc(title)}</h1><p>${esc(intro)}</p><span class="year-tag">当前年份：${year} 年</span></div>`;
}

function section(title, note, inner) {
  return `<section class="section"><h2>${esc(title)}</h2><p class="section-note">${esc(note)}</p>${inner}</section>`;
}

// ---------- 总览 ----------
function viewHome() {
  const cards = [
    kpiCard('population', 'population'),
    kpiCard('gdp', 'economy'),
    kpiCard('gdpPerCapita', 'economy'),
    kpiCard('cpi', 'economy'),
    kpiCard('unemployment', 'livelihood'),
    kpiCard('lifeExpectancy', 'livelihood'),
    kpiCard('urbanization', 'population'),
    kpiCard('trade', 'economy'),
  ].join('');
  const gdpPts = seriesPoints('gdp');
  const popPts = seriesPoints('population');
  return `
  ${pageHead('中国国家统计总览', '一个页面看清中国十年来的关键数字：人口、经济、民生与环境。点任意卡片进入对应专题页。')}
  <div class="grid kpis">${cards}</div>
  ${section('十年走势', 'GDP 总量（柱）与增速（线），2015–2024 年。', `
    <div class="card">${barLineChart(gdpPts, seriesPoints('gdpGrowth'), { title: '国内生产总值（万亿元）与增速（%）' })}
    <p class="hint">2024 年 GDP 约 134.9 万亿元，比上年增长 5.0%。2020 年增速 2.2%，为十年低点；2021 年反弹至 8.6%。</p></div>`)}
  ${section('人口与城镇化', '年末常住人口与城镇化率双双走过十年拐点。', `
    <div class="grid two">
      <div class="card"><h3>年末常住人口</h3><p class="hint">单位：亿人。2022 年起人口连续三年小幅减少。</p>${lineChart(popPts, { title: '年末常住人口（亿人）', color: '#0e7490' })}</div>
      <div class="card"><h3>常住人口城镇化率</h3><p class="hint">单位：%。2024 年约 67.0%，十年提高约 11 个百分点。</p>${lineChart(seriesPoints('urbanization'), { title: '城镇化率（%）', color: '#15803d' })}</div>
    </div>`)}
  ${section('指标索引', '站内全部 18 项年度指标，按专题分组，点开直达。', `
    <div class="index-list">${SEARCH_INDEX.filter((i) => i.kind === '指标').map((i) => `<a href="#/${i.page}"><b>${esc(i.label)}</b><span>${esc(i.detail)}</span></a>`).join('')}</div>`)}
  <p class="callout" style="margin-top:26px">${esc(META.source)}。本站为原创整理的可视化站点，与任何官方机构无关。</p>`;
}

// ---------- 可排序表格 ----------
function sortRows(rows, tableId, key) {
  const st = sortState[tableId] || { key: null, dir: 1 };
  if (st.key === key) st.dir = -st.dir;
  else { st.key = key; st.dir = key === 'name' ? 1 : -1; }
  sortState[tableId] = st;
  const sorted = [...rows].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (typeof av === 'string') return st.dir * av.localeCompare(bv, 'zh-CN');
    return st.dir * (av - bv);
  });
  return { sorted, st };
}

function th(label, tableId, key) {
  const st = sortState[tableId];
  const arrow = st && st.key === key ? (st.dir === 1 ? ' ▲' : ' ▼') : '';
  return `<th data-table="${tableId}" data-key="${key}">${esc(label)}${arrow}</th>`;
}

function bindSorting(container) {
  container.querySelectorAll('th[data-table]').forEach((el) => {
    el.addEventListener('click', () => {
      const tableId = el.dataset.table;
      const key = el.dataset.key;
      renderTable(tableId, key);
    });
  });
}

let provinceRows = [...PROVINCES];
let cityRows = [...CITIES];

function renderTable(tableId, key) {
  if (tableId === 'prov-table') {
    const { sorted } = sortRows(provinceRows, tableId, key);
    provinceRows = sorted;
    const body = document.getElementById('prov-tbody');
    if (body) body.innerHTML = provinceTableRows();
    const head = document.querySelector('#prov-table thead tr');
    if (head) head.innerHTML = provinceTableHead();
    bindSorting(document.getElementById('prov-table').closest('.card'));
  } else if (tableId === 'city-table') {
    const { sorted } = sortRows(cityRows, tableId, key);
    cityRows = sorted;
    const body = document.getElementById('city-tbody');
    if (body) body.innerHTML = cityTableRows();
    const head = document.querySelector('#city-table thead tr');
    if (head) head.innerHTML = cityTableHead();
    bindSorting(document.getElementById('city-table').closest('.card'));
  }
}

function provinceTableHead() {
  return `${th('省份', 'prov-table', 'name')}${th('GDP（万亿元）', 'prov-table', 'gdp')}${th('常住人口（万人）', 'prov-table', 'pop')}${th('人均 GDP（万元）', 'prov-table', 'perCapita')}`;
}
function provinceTableRows() {
  return provinceRows.map((p, i) => {
    const pc = ((p.gdp * 10000) / p.pop).toFixed(1);
    return `<tr><td>${i + 1}. ${esc(p.name)}</td><td class="num">${p.gdp.toFixed(2)}</td><td class="num">${p.pop.toLocaleString('zh-CN')}</td><td class="num">${pc}</td></tr>`;
  }).join('');
}
function cityTableHead() {
  return `${th('城市', 'city-table', 'name')}${th('常住人口（万人）', 'city-table', 'pop')}`;
}
function cityTableRows() {
  return cityRows.map((c, i) => `<tr><td>${i + 1}. ${esc(c.name)}</td><td class="num">${c.pop.toLocaleString('zh-CN')}</td></tr>`).join('');
}

// ---------- 省份对比 ----------
function provinceOptions(selected) {
  return PROVINCES.map((p) => `<option value="${esc(p.name)}" ${p.name === selected ? 'selected' : ''}>${esc(p.name)}</option>`).join('');
}

function compareBox(name, metricLabel, metricValue, unit) {
  const p = PROVINCES.find((x) => x.name === name);
  const pc = ((p.gdp * 10000) / p.pop).toFixed(1);
  return `<div class="compare-box"><h4>${esc(name)}</h4>
    <div class="big">${esc(metricValue)}<small> ${esc(unit)}</small></div>
    <dl><dt>GDP</dt><dd>约 ${p.gdp.toFixed(2)} 万亿元</dd>
    <dt>常住人口</dt><dd>约 ${p.pop.toLocaleString('zh-CN')} 万人</dd>
    <dt>人均 GDP</dt><dd>约 ${pc} 万元</dd></dl></div>`;
}

function compareSection(kind) {
  const a = kind === 'gdp' ? cmpA : cmpPopA;
  const b = kind === 'gdp' ? cmpB : cmpPopB;
  const pa = PROVINCES.find((x) => x.name === a);
  const pb = PROVINCES.find((x) => x.name === b);
  const label = kind === 'gdp' ? 'GDP（万亿元）' : '常住人口（万人）';
  const va = kind === 'gdp' ? pa.gdp.toFixed(2) : pa.pop.toLocaleString('zh-CN');
  const vb = kind === 'gdp' ? pb.gdp.toFixed(2) : pb.pop.toLocaleString('zh-CN');
  const unit = kind === 'gdp' ? '万亿元' : '万人';
  const id = kind === 'gdp' ? 'cmp-gdp' : 'cmp-pop';
  const maxV = Math.max(...PROVINCES.map((p) => kind === 'gdp' ? p.gdp : p.pop));
  return `<div class="card" id="${id}">
    <h3>省份对比 · ${esc(label)}</h3>
    <p class="hint">选两个省，比一比 2024 年的家底。下方条形按全省最高值归一。</p>
    <div class="controls">
      <select class="input" data-cmp="${kind}" data-side="a" aria-label="省份甲">${provinceOptions(a)}</select>
      <span class="vs">VS</span>
      <select class="input" data-cmp="${kind}" data-side="b" aria-label="省份乙">${provinceOptions(b)}</select>
    </div>
    <div class="compare">
      ${compareBox(a, label, va, unit)}
      ${compareBox(b, label, vb, unit)}
    </div>
    <div style="margin-top:14px">${hbars([
      { label: a, value: kind === 'gdp' ? pa.gdp : pa.pop, max: maxV, color: '#1d4ed8', note: kind === 'gdp' ? `约 ${pa.gdp.toFixed(2)} 万亿元` : `约 ${pa.pop.toLocaleString('zh-CN')} 万人` },
      { label: b, value: kind === 'gdp' ? pb.gdp : pb.pop, max: maxV, color: '#0e7490', note: kind === 'gdp' ? `约 ${pb.gdp.toFixed(2)} 万亿元` : `约 ${pb.pop.toLocaleString('zh-CN')} 万人` },
    ])}</div>
  </div>`;
}

// ---------- 经济 ----------
function viewEconomy() {
  const metrics = [
    { key: 'gdp', label: 'GDP 总量', chart: 'bar' },
    { key: 'gdpGrowth', label: 'GDP 增速', chart: 'bar' },
    { key: 'gdpPerCapita', label: '人均 GDP', chart: 'line' },
    { key: 'income', label: '人均可支配收入', chart: 'line' },
    { key: 'trade', label: '货物进出口总额', chart: 'bar' },
  ];
  const m = metrics.find((x) => x.key === ecoMetric) || metrics[0];
  const s = SERIES[m.key];
  const pts = seriesPoints(m.key);
  const chart = m.chart === 'bar'
    ? barChart(pts, { title: `${s.label}（${s.unit}）`, color: '#1d4ed8', showValues: m.key === 'gdpGrowth' })
    : lineChart(pts, { title: `${s.label}（${s.unit}）`, color: '#0e7490', showValues: false });
  const chips = metrics.map((x) => `<button class="chip ${x.key === ecoMetric ? 'on' : ''}" data-metric="${x.key}">${esc(x.label)}</button>`).join('');
  // 产业结构：取不晚于当前年份的最近有数年份
  const indYears = Object.keys(INDUSTRY).map(Number).sort((a, b) => a - b);
  const indYear = [...indYears].reverse().find((y) => y <= year) || indYears[0];
  const ind = INDUSTRY[indYear];
  const indNote = indYear === year ? `${year} 年三次产业占比` : `产业结构最近有数年份为 ${indYear} 年（当前选 ${year} 年）`;
  return `
  ${pageHead('经济', '总量、增速、收入与贸易：十年经济账本。切换指标，图表与解读随之而变。')}
  ${section('指标切换', '点下面的指标，图表立刻换成对应序列。', `
    <div class="card"><div class="controls">${chips}</div>${chart}
    <p class="hint">${esc(s.label)}：${year} 年为 ${esc(fmt(m.key, valueAt(m.key, year)))} ${esc(s.unit)}。${m.key === 'gdp' ? '2024 年 GDP 约 134.9 万亿元，居世界第二。' : m.key === 'income' ? '十年间人均可支配收入接近翻倍。' : m.key === 'trade' ? '货物进出口总额十年从约 24.6 万亿元增至约 43.8 万亿元。' : ''}</p></div>`)}
  ${section('总量与增速同图', '柱为 GDP 总量，线为增速（右轴，%）。', `
    <div class="card">${barLineChart(seriesPoints('gdp'), seriesPoints('gdpGrowth'), { title: 'GDP 总量（万亿元）与增速（%），2015–2024' })}
    <p class="hint">2020 年增速回落至 2.2%，2021 年反弹至 8.6%，此后回到 5% 左右。</p></div>`)}
  ${section('三次产业结构', indNote, `
    <div class="card">${donut([
      { label: '第一产业', value: ind.primary, color: '#15803d' },
      { label: '第二产业', value: ind.secondary, color: '#1d4ed8' },
      { label: '第三产业', value: ind.tertiary, color: '#b45309' },
    ], { center: `${ind.tertiary.toFixed(1)}%`, centerSub: '第三产业占比' })}
    <p class="hint">${indYear} 年：第一产业约 ${ind.primary}%，第二产业约 ${ind.secondary}%，第三产业约 ${ind.tertiary}%。</p></div>`)}
  ${section('省份对比', '两个省的 GDP 与人口，面对面比。', compareSection('gdp'))}
  ${section('2024 年各省份 GDP', '点表头排序。数值为约数，人均 GDP 由 GDP 与人口换算。', `
    <div class="card"><p class="sort-hint">点击表头可按该列排序，再点一次反向。</p>
    <table class="data" id="prov-table"><thead><tr>${provinceTableHead()}</tr></thead><tbody id="prov-tbody">${provinceTableRows()}</tbody></table>
    <p class="hint">广东、江苏 2024 年 GDP 均超 13 万亿元；西藏、青海、宁夏不足 1 万亿元。</p></div>`)}`;
}

// ---------- 人口 ----------
function viewPopulation() {
  const age = AGE_STRUCTURE[ageYear];
  const chips = [2020, 2024].map((y) => `<button class="chip ${y === ageYear ? 'on' : ''}" data-age="${y}">${y} 年${y === 2020 ? '（七普）' : '（估算）'}</button>`).join('');
  return `
  ${pageHead('人口', '总量、自然增长、年龄结构与城镇化：人口这本账，正在过拐点。')}
  ${section('总量与自然增长', '2022 年自然增长率首次转负，人口开始小幅减少。', `
    <div class="grid two">
      <div class="card"><h3>年末常住人口</h3><p class="hint">单位：亿人</p>${lineChart(seriesPoints('population'), { title: '年末常住人口（亿人）', color: '#0e7490' })}</div>
      <div class="card"><h3>人口自然增长率</h3><p class="hint">单位：‰，2024 年约 −0.99‰</p>${barChart(seriesPoints('naturalGrowth'), { title: '人口自然增长率（‰）', color: '#b45309', showValues: false })}</div>
    </div>`)}
  ${section('年龄结构', '60 岁及以上人口占比从 2020 年的 18.7% 升至 2024 年估算的约 21.5%。', `
    <div class="card"><div class="controls">${chips}</div>
    ${hbars(age.map((a, i) => ({ label: a.group, value: a.share, max: 100, color: ['#1d4ed8', '#0e7490', '#b45309'][i], note: `${a.share.toFixed(1)}% · ${a.note}` })))}
    <p class="hint">${ageYear} 年：${age.map((a) => `${a.group}约 ${a.share.toFixed(1)}%`).join('，')}。</p></div>`)}
  ${section('城镇化', '常住人口城镇化率十年从 56.1% 升至约 67.0%。', `
    <div class="card">${lineChart(seriesPoints('urbanization'), { title: '常住人口城镇化率（%）', color: '#15803d' })}</div>`)}
  ${section('省份对比 · 人口', '两个省的常住人口面对面比。', compareSection('pop'))}
  ${section('主要城市常住人口', '2024 年末约数，点表头排序。', `
    <div class="card"><p class="sort-hint">点击表头可按该列排序，再点一次反向。</p>
    <table class="data" id="city-table"><thead><tr>${cityTableHead()}</tr></thead><tbody id="city-tbody">${cityTableRows()}</tbody></table>
    <p class="hint">重庆常住人口约 3191 万人，居各城市之首；上海约 2480 万人，北京约 2189 万人。</p></div>`)}`;
}

// ---------- 民生 ----------
function viewLivelihood() {
  return `
  ${pageHead('民生', '活得更久、读更多书、看病更有保障：民生指标十年变迁。')}
  <div class="grid kpis">
    ${kpiCard('lifeExpectancy', 'livelihood')}
    ${kpiCard('higherEdu', 'livelihood')}
    ${kpiCard('healthSpend', 'livelihood')}
    ${kpiCard('unemployment', 'livelihood')}
  </div>
  ${section('人均预期寿命', '十年从约 76.3 岁升至约 79.0 岁。', `
    <div class="card">${lineChart(seriesPoints('lifeExpectancy'), { title: '人均预期寿命（岁）', color: '#15803d' })}</div>`)}
  ${section('教育与医疗', '高等教育毛入学率突破 60%，人均卫生费用十年翻倍有余。', `
    <div class="grid two">
      <div class="card"><h3>高等教育毛入学率</h3><p class="hint">单位：%。2024 年约 60.8%。</p>${lineChart(seriesPoints('higherEdu'), { title: '高等教育毛入学率（%）', color: '#1d4ed8' })}</div>
      <div class="card"><h3>人均卫生总费用</h3><p class="hint">单位：元，约数。2024 年约 7010 元。</p>${lineChart(seriesPoints('healthSpend'), { title: '人均卫生总费用（元）', color: '#0e7490' })}</div>
    </div>`)}
  ${section('社会保障覆盖', '参保人数十年变化（约数）。', `
    <div class="grid two">
      <div class="card"><h3>基本养老保险</h3><p class="hint">参保人数</p><div class="kpi-value" style="font-size:28px;font-weight:800;color:var(--navy)">${esc(SOCIAL.pension2024.value)}</div><p class="hint">2015 年${esc(SOCIAL.pension2015.value)}，十年增加约 2.1 亿人。</p></div>
      <div class="card"><h3>基本医疗保险</h3><p class="hint">参保人数</p><div class="kpi-value" style="font-size:28px;font-weight:800;color:var(--navy)">${esc(SOCIAL.medical2024.value)}</div><p class="hint">2015 年${esc(SOCIAL.medical2015.value)}，覆盖面长期稳定在 95% 以上。</p></div>
    </div>`)}
  ${section('城镇调查失业率', '2018 年起官方发布该口径，近年稳定在 5% 上下。', `
    <div class="card">${barChart(seriesPoints('unemployment'), { title: '城镇调查失业率（%）', color: '#b45309', showValues: true })}
    <p class="hint">2015–2017 年该口径未发布；2022 年为 5.6%，为近年高点。</p></div>`)}`;
}

// ---------- 环境 ----------
function viewEnvironment() {
  return `
  ${pageHead('环境与能源', '碳排放、清洁能源、森林与空气：环境账本在变绿。')}
  <div class="grid kpis">
    ${kpiCard('co2', 'environment')}
    ${kpiCard('renewable', 'environment')}
    ${kpiCard('forest', 'environment')}
    ${kpiCard('pm25', 'environment')}
  </div>
  ${section('碳排放与清洁能源', '二氧化碳排放量增速放缓，非化石能源占比稳步上升。', `
    <div class="grid two">
      <div class="card"><h3>二氧化碳排放量</h3><p class="hint">单位：亿吨，约数。2024 年约 11.1 亿吨。</p>${lineChart(seriesPoints('co2'), { title: '二氧化碳排放量（亿吨）', color: '#b45309' })}</div>
      <div class="card"><h3>非化石能源占能源消费比重</h3><p class="hint">单位：%。2024 年约 18.6%。</p>${lineChart(seriesPoints('renewable'), { title: '非化石能源占比（%）', color: '#15803d' })}</div>
    </div>`)}
  ${section('森林覆盖率', '十年从约 21.7% 升至约 24.0%。', `
    <div class="card">${lineChart(seriesPoints('forest'), { title: '森林覆盖率（%）', color: '#15803d' })}</div>`)}
  ${section('空气质量', '全国平均 PM2.5 浓度十年从约 50 微克/立方米降至约 29.3 微克/立方米。', `
    <div class="card">${barChart(seriesPoints('pm25'), { title: '全国平均 PM2.5 浓度（微克/立方米）', color: '#0e7490', showValues: false })}
    <p class="hint">2015 年约 50 微克/立方米，2024 年约 29.3 微克/立方米，降幅约四成。</p></div>`)}
  <p class="callout" style="margin-top:26px">中国已提出 2030 年前实现碳达峰、2060 年前实现碳中和的目标；非化石能源占比与森林覆盖率是迈向目标的关键刻度。</p>`;
}

// ---------- 渲染与事件 ----------
function render() {
  document.title = `数观中国 · ${year} 年`;
  const hash = location.hash || '#/';
  const route = hash.replace(/^#\/?/, '').split('/')[0] || '';
  document.querySelectorAll('.nav a').forEach((a) => {
    const on = (route === '' && a.dataset.page === 'home') || a.dataset.page === route;
    a.classList.toggle('active', on);
  });
  let html = '';
  if (route === 'economy') html = viewEconomy();
  else if (route === 'population') html = viewPopulation();
  else if (route === 'livelihood') html = viewLivelihood();
  else if (route === 'environment') html = viewEnvironment();
  else html = viewHome();
  app.innerHTML = html;
  bindSorting(app);
  app.querySelectorAll('[data-metric]').forEach((el) => {
    el.addEventListener('click', () => { ecoMetric = el.dataset.metric; render(); });
  });
  app.querySelectorAll('[data-age]').forEach((el) => {
    el.addEventListener('click', () => { ageYear = Number(el.dataset.age); render(); });
  });
  app.querySelectorAll('select[data-cmp]').forEach((el) => {
    el.addEventListener('change', () => {
      const kind = el.dataset.cmp;
      const side = el.dataset.side;
      if (kind === 'gdp') { if (side === 'a') cmpA = el.value; else cmpB = el.value; }
      else { if (side === 'a') cmpPopA = el.value; else cmpPopB = el.value; }
      render();
    });
  });
  window.scrollTo(0, 0);
}

function doSearch(q) {
  const query = q.trim();
  if (!query) { searchBox.innerHTML = ''; searchBox.hidden = true; return; }
  const hits = SEARCH_INDEX.filter((i) => i.label.includes(query) || i.detail.includes(query)).slice(0, 8);
  if (!hits.length) {
    searchBox.innerHTML = `<div class="search-empty">没有找到“${esc(query)}”相关的内容，试试“GDP”“广东”“人口”。</div>`;
  } else {
    searchBox.innerHTML = hits.map((h, i) => `<button data-i="${i}">${esc(h.label)}<small>${esc(h.kind)} · ${esc(h.detail)}</small></button>`).join('');
    searchBox.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const hit = hits[Number(btn.dataset.i)];
        searchBox.hidden = true;
        searchInput.value = '';
        location.hash = `#/${hit.page}`;
        setTimeout(() => {
          const target = document.querySelector('.page-head') || app;
          target.classList.add('flash');
        }, 60);
      });
    });
  }
  searchBox.hidden = false;
}

YEARS.forEach((y) => {
  const opt = document.createElement('option');
  opt.value = String(y);
  opt.textContent = `${y} 年`;
  if (y === year) opt.selected = true;
  yearSel.appendChild(opt);
});
yearSel.addEventListener('change', () => { year = Number(yearSel.value); render(); });
searchInput.addEventListener('input', () => doSearch(searchInput.value));
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(searchInput.value); });
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) { searchBox.hidden = true; }
});
// 按 "/" 快速聚焦搜索框（输入框/文本域/下拉框内按下时不拦截，让用户正常输入）
document.addEventListener('keydown', (e) => {
  if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
  e.preventDefault();
  searchInput.focus();
});

window.addEventListener('hashchange', render);
render();
