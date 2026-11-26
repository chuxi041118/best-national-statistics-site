// 数观中国参赛入口（Node 22，只用标准库）。
// 做法：把本站的 app/ 与 screenshots/ 拷进输出目录，再用 kit 自带的
// vendor/makefun-frontend.ts 生成 /output/dossier.json（评分器读的就是它）。
// 本地调试：mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// 评分器容器里 MAKEFUN_OUTPUT_DIR 未设置时，默认写 /output。

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

function countEntries(dir) {
  let total = 0;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    total += 1;
    if (statSync(full).isDirectory()) total += countEntries(full);
  }
  return total;
}

function copyTree(src, dest) {
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
copyTree(join(repoRoot, 'app'), join(outputDir, 'app'));
if (existsSync(join(repoRoot, 'screenshots'))) {
  copyTree(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'));
}

const appEntries = countEntries(join(outputDir, 'app'));
console.log(`copied app/ (${appEntries} entries) and screenshots/ to ${outputDir}`);

// 评分器上限（与 kit 的 gate 一致）：截图最多 4 张、每张 ≤256 KiB；
// app/ 最多 993 个条目、≤16 MiB；单文本文件 ≤160 KiB 计入。
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log('wrote dossier.json');

// 构建后校验：输出目录里必须有 app/index.html、至少一张截图与 dossier.json。
function listFiles(dir, base = dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...listFiles(full, base));
    else out.push({ rel: full.slice(base.length + 1), bytes: statSync(full).size });
  }
  return out;
}
const builtFiles = listFiles(outputDir);
const totalBytes = builtFiles.reduce((n, f) => n + f.bytes, 0);
const missing = ['app/index.html', 'dossier.json'].filter((rel) => !builtFiles.some((f) => f.rel === rel));
if (!builtFiles.some((f) => f.rel.startsWith('screenshots/'))) missing.push('screenshots/（至少一张截图）');
if (missing.length) {
  console.error(`build check failed: missing ${missing.join(', ')}`);
  process.exit(1);
}
console.log(`build check ok: ${builtFiles.length} files, ${totalBytes} bytes in ${outputDir}`);
