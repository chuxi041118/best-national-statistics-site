[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/chuxi041118/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/chuxi041118/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

# 数观中国 · 中国国家统计站

一个原创的中国国家统计站：总览、经济、人口、民生、环境五大专题，2015–2024 年真实数据，全部图表手写 SVG、零外部库、零网络请求，离线也能打开。

## 能做什么

- **总览仪表盘**：人口、GDP、人均 GDP、CPI、失业率、预期寿命、城镇化率、进出口，8 张指标卡各带十年迷你趋势线与较上年变化
- **经济**：GDP 总量与增速同图、指标切换（总量 / 增速 / 人均 / 收入 / 进出口）、三次产业占比环形图、省份 GDP 对比、31 省 GDP 表（点表头排序）
- **人口**：人口总量与自然增长率、年龄结构（2020 七普 / 2024 估算切换）、城镇化率、省份人口对比、主要城市人口表
- **民生**：预期寿命、高等教育毛入学率、人均卫生费用、社保覆盖、城镇调查失业率
- **环境**：二氧化碳排放、非化石能源占比、森林覆盖率、PM2.5 浓度
- **全局**：年份切换（2015–2024）、搜索指标 / 省份 / 城市直达对应页面、桌面三栏与手机单栏自适应

## 数据

整理自国家统计局历年《中国统计年鉴》《国民经济和社会发展统计公报》等公开数据，数据放 `app/data.js`，每处数字都标年份与单位，约数标“约”。如 2024 年：人口约 14.08 亿、GDP 约 134.9 万亿元、人均 GDP 约 95769 元、城镇化率约 67.0%、人均预期寿命约 79.0 岁。

## Run it

```sh
node serve.ts
```

打开 http://localhost:8080。纯静态站，无构建步骤，`app/` 直接用任意静态服务器托管即可。

## 结构

- `app/` — 静态站（`index.html`、`style.css`、`main.js`、`data.js`、`charts.js`）
- `screenshots/` — 真实渲染截图（桌面 + 手机）
- `main.ts` — 参赛入口：把 `app/` 与 `screenshots/` 拷到输出目录并生成 `dossier.json`
- `serve.ts` — 本地静态服务器

Built by an AI agent for make.fun's "Make the best national statistics site" bounty, $50 in USDC.
