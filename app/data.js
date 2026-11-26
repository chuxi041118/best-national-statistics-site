// 中国国家统计数据（2015–2024）
// 整理自国家统计局历年《中国统计年鉴》《国民经济和社会发展统计公报》等公开数据。
// 标“约”的为四舍五入约数；部分早期年份个别指标官方未发布，以 null 表示。

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const META = {
  country: '中国',
  source: '数据来源：国家统计局公开数据整理；带“约”的数值为四舍五入约数',
  updated: '2024 年数据',
};

// 全国年度序列：值与单位、口径说明一并存放，页面直接取用。
export const SERIES = {
  population: {
    label: '年末常住人口', unit: '亿人', decimals: 2, approx: true,
    values: { 2015: 13.75, 2016: 13.83, 2017: 13.90, 2018: 13.95, 2019: 14.00, 2020: 14.12, 2021: 14.13, 2022: 14.12, 2023: 14.10, 2024: 14.08 },
  },
  naturalGrowth: {
    label: '人口自然增长率', unit: '‰', decimals: 2, approx: false,
    values: { 2015: 4.96, 2016: 5.86, 2017: 5.32, 2018: 3.81, 2019: 3.34, 2020: 1.45, 2021: 0.34, 2022: -0.60, 2023: -1.48, 2024: -0.99 },
  },
  gdp: {
    label: '国内生产总值', unit: '万亿元', decimals: 1, approx: true,
    values: { 2015: 68.9, 2016: 74.6, 2017: 83.2, 2018: 91.9, 2019: 98.7, 2020: 101.4, 2021: 114.9, 2022: 120.5, 2023: 126.6, 2024: 134.9 },
  },
  gdpGrowth: {
    label: 'GDP 增速', unit: '%', decimals: 1, approx: false,
    values: { 2015: 6.9, 2016: 6.8, 2017: 6.9, 2018: 6.7, 2019: 6.0, 2020: 2.2, 2021: 8.6, 2022: 3.0, 2023: 5.2, 2024: 5.0 },
  },
  gdpPerCapita: {
    label: '人均 GDP', unit: '元', decimals: 0, approx: true,
    values: { 2015: 49922, 2016: 53783, 2017: 59592, 2018: 65534, 2019: 70078, 2020: 71828, 2021: 81370, 2022: 85308, 2023: 89358, 2024: 95769 },
  },
  cpi: {
    label: '居民消费价格指数（CPI）涨幅', unit: '%', decimals: 1, approx: false,
    values: { 2015: 1.4, 2016: 2.0, 2017: 1.6, 2018: 2.1, 2019: 2.9, 2020: 2.5, 2021: 0.9, 2022: 2.0, 2023: 0.2, 2024: 0.2 },
  },
  unemployment: {
    label: '城镇调查失业率', unit: '%', decimals: 1, approx: false,
    values: { 2015: null, 2016: null, 2017: null, 2018: 4.9, 2019: 5.2, 2020: 5.2, 2021: 5.1, 2022: 5.6, 2023: 5.2, 2024: 5.1 },
  },
  lifeExpectancy: {
    label: '人均预期寿命', unit: '岁', decimals: 1, approx: true,
    values: { 2015: 76.3, 2016: 76.5, 2017: 76.7, 2018: 77.0, 2019: 77.3, 2020: 77.9, 2021: 78.2, 2022: 78.5, 2023: 78.6, 2024: 79.0 },
  },
  urbanization: {
    label: '常住人口城镇化率', unit: '%', decimals: 1, approx: false,
    values: { 2015: 56.1, 2016: 57.4, 2017: 58.5, 2018: 59.6, 2019: 60.6, 2020: 63.9, 2021: 64.7, 2022: 65.2, 2023: 66.2, 2024: 67.0 },
  },
  income: {
    label: '人均可支配收入', unit: '元', decimals: 0, approx: false,
    values: { 2015: 21966, 2016: 23821, 2017: 25974, 2018: 28228, 2019: 30733, 2020: 32189, 2021: 35128, 2022: 36883, 2023: 39218, 2024: 41314 },
  },
  trade: {
    label: '货物进出口总额', unit: '万亿元', decimals: 1, approx: true,
    values: { 2015: 24.6, 2016: 24.3, 2017: 27.8, 2018: 30.5, 2019: 31.5, 2020: 32.2, 2021: 39.1, 2022: 42.1, 2023: 41.8, 2024: 43.8 },
  },
  co2: {
    label: '二氧化碳排放量', unit: '亿吨', decimals: 1, approx: true,
    values: { 2015: 9.2, 2016: 9.2, 2017: 9.4, 2018: 9.6, 2019: 9.8, 2020: 9.9, 2021: 10.5, 2022: 10.6, 2023: 11.0, 2024: 11.1 },
  },
  renewable: {
    label: '非化石能源占能源消费比重', unit: '%', decimals: 1, approx: true,
    values: { 2015: 12.1, 2016: 13.3, 2017: 13.8, 2018: 14.3, 2019: 15.3, 2020: 15.9, 2021: 16.6, 2022: 17.5, 2023: 17.9, 2024: 18.6 },
  },
  forest: {
    label: '森林覆盖率', unit: '%', decimals: 1, approx: true,
    values: { 2015: 21.7, 2016: 21.8, 2017: 21.9, 2018: 22.1, 2019: 22.3, 2020: 23.0, 2021: 23.2, 2022: 23.6, 2023: 23.9, 2024: 24.0 },
  },
  pm25: {
    label: '全国平均 PM2.5 浓度', unit: '微克/立方米', decimals: 1, approx: true,
    values: { 2015: 50, 2016: 47, 2017: 43, 2018: 39, 2019: 36, 2020: 33, 2021: 30, 2022: 29, 2023: 30, 2024: 29.3 },
  },
  higherEdu: {
    label: '高等教育毛入学率', unit: '%', decimals: 1, approx: false,
    values: { 2015: 40.0, 2016: 42.7, 2017: 45.7, 2018: 48.1, 2019: 51.6, 2020: 54.4, 2021: 57.8, 2022: 59.6, 2023: 60.2, 2024: 60.8 },
  },
  healthSpend: {
    label: '人均卫生总费用', unit: '元', decimals: 0, approx: true,
    values: { 2015: 2952, 2016: 3321, 2017: 3670, 2018: 4148, 2019: 4707, 2020: 5112, 2021: 5429, 2022: 5983, 2023: 6553, 2024: 7010 },
  },
};

// 三次产业占 GDP 比重（%，约数），用于经济页环形图
export const INDUSTRY = {
  2015: { primary: 8.9, secondary: 40.9, tertiary: 50.2 },
  2018: { primary: 7.2, secondary: 39.7, tertiary: 53.1 },
  2020: { primary: 7.7, secondary: 37.8, tertiary: 54.5 },
  2022: { primary: 7.3, secondary: 39.9, tertiary: 52.8 },
  2024: { primary: 7.1, secondary: 36.5, tertiary: 56.4 },
};

// 年龄结构（%，约数）：2020 年为第七次人口普查，2024 年为估算
export const AGE_STRUCTURE = {
  2020: [
    { group: '0–14 岁', share: 17.95, note: '第七次人口普查' },
    { group: '15–59 岁', share: 63.35, note: '第七次人口普查' },
    { group: '60 岁及以上', share: 18.70, note: '第七次人口普查' },
  ],
  2024: [
    { group: '0–14 岁', share: 16.5, note: '估算' },
    { group: '15–59 岁', share: 62.0, note: '估算' },
    { group: '60 岁及以上', share: 21.5, note: '估算' },
  ],
};

// 省份：2024 年 GDP（万亿元，约数）与年末常住人口（万人，约数）
export const PROVINCES = [
  { name: '广东', gdp: 14.16, pop: 12780 },
  { name: '江苏', gdp: 13.71, pop: 8526 },
  { name: '山东', gdp: 9.86, pop: 10146 },
  { name: '浙江', gdp: 9.01, pop: 6582 },
  { name: '四川', gdp: 6.47, pop: 8368 },
  { name: '河南', gdp: 6.36, pop: 9807 },
  { name: '湖北', gdp: 6.00, pop: 5834 },
  { name: '福建', gdp: 5.77, pop: 4180 },
  { name: '上海', gdp: 5.39, pop: 2480 },
  { name: '湖南', gdp: 5.32, pop: 6557 },
  { name: '安徽', gdp: 5.07, pop: 6127 },
  { name: '北京', gdp: 4.98, pop: 2189 },
  { name: '河北', gdp: 4.76, pop: 7335 },
  { name: '陕西', gdp: 3.55, pop: 3953 },
  { name: '江西', gdp: 3.44, pop: 4509 },
  { name: '辽宁', gdp: 3.26, pop: 4197 },
  { name: '重庆', gdp: 3.21, pop: 3191 },
  { name: '云南', gdp: 3.15, pop: 4657 },
  { name: '广西', gdp: 2.86, pop: 5019 },
  { name: '内蒙古', gdp: 2.63, pop: 2396 },
  { name: '山西', gdp: 2.55, pop: 3456 },
  { name: '贵州', gdp: 2.26, pop: 3853 },
  { name: '新疆', gdp: 2.05, pop: 2590 },
  { name: '天津', gdp: 1.81, pop: 1364 },
  { name: '黑龙江', gdp: 1.64, pop: 3057 },
  { name: '吉林', gdp: 1.47, pop: 2339 },
  { name: '甘肃', gdp: 1.30, pop: 2469 },
  { name: '海南', gdp: 0.79, pop: 1043 },
  { name: '宁夏', gdp: 0.55, pop: 728 },
  { name: '青海', gdp: 0.38, pop: 595 },
  { name: '西藏', gdp: 0.28, pop: 367 },
];

// 主要城市常住人口（万人，约数，2024 年末）
export const CITIES = [
  { name: '重庆', pop: 3191 },
  { name: '上海', pop: 2480 },
  { name: '北京', pop: 2189 },
  { name: '成都', pop: 2142 },
  { name: '广州', pop: 1878 },
  { name: '深圳', pop: 1786 },
  { name: '武汉', pop: 1378 },
  { name: '天津', pop: 1364 },
  { name: '西安', pop: 1308 },
  { name: '苏州', pop: 1296 },
  { name: '郑州', pop: 1283 },
  { name: '杭州', pop: 1252 },
];

// 社会保障覆盖（约数）
export const SOCIAL = {
  pension2024: { label: '基本养老保险参保人数', value: '约 10.7 亿人', year: 2024 },
  medical2024: { label: '基本医疗保险参保人数', value: '约 13.3 亿人', year: 2024 },
  pension2015: { label: '基本养老保险参保人数', value: '约 8.6 亿人', year: 2015 },
  medical2015: { label: '基本医疗保险参保人数', value: '约 13.4 亿人', year: 2015 },
};

// 取某指标某年的值；缺失返回 null
export function valueAt(key, year) {
  const s = SERIES[key];
  if (!s) return null;
  const v = s.values[year];
  return v === undefined ? null : v;
}

// 某指标 2015–2024 的完整序列（跳过 null）
export function seriesPoints(key) {
  return YEARS.map((y) => ({ year: y, value: SERIES[key].values[y] }))
    .filter((p) => p.value !== null && p.value !== undefined);
}

// 格式化数值：按指标的小数位，约数前加“约”
export function fmt(key, v) {
  if (v === null || v === undefined) return '未发布';
  const s = SERIES[key];
  const n = Number(v).toLocaleString('zh-CN', {
    minimumFractionDigits: s.decimals, maximumFractionDigits: s.decimals,
  });
  return (s.approx ? '约 ' : '') + n;
}
