/* 세 쪽을 각각 빌드해 dist/에 모은다.
 *
 *   dist/index.html            랜딩
 *   dist/create-points/          지필평가 배점 생성기 (이 폴더만으로 완결된다)
 *   dist/choice-order/         지필평가 선택지 정렬기 (같다)
 *
 * 폴더마다 따로 빌드하는 이유는 글꼴·CSS 같은 산출물이 그 폴더 안에 들어가야
 * 하기 때문이다. 한 번에 빌드하면 산출물이 dist/assets에 모여, 도구 폴더만
 * 묶은 zip은 스타일이 빠진 채로 열린다.
 *
 *   node build.mjs      (= npm run build)
 */
import { rm, mkdir, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { build } from 'vite';

const ROOT = import.meta.dirname;
const DIST = resolve(ROOT, 'dist');
// root를 도구 폴더로 두면 Vite가 그 폴더에서 설정을 찾는다. 설정은 하나뿐이므로 집어 준다.
const CONFIG = resolve(ROOT, 'vite.config.mjs');

// 도구가 브라우저에서 이름 그대로 읽는 파일들. 고전 <script>와 Worker의
// importScripts, fetch가 이름으로 찾으므로 묶지 않고 그대로 옮긴다.
const RUNTIME = {
  'create-points': ['solver.js', 'worker.js', 'precalc.json'],
  'choice-order': ['sorter.js'],
};

// 랜딩을 먼저 빌드한다 (dist를 비우는 것은 이때 한 번)
await rm(DIST, { recursive: true, force: true });
await build({ root: ROOT, configFile: CONFIG, build: { outDir: 'dist' } });

for (const tool of Object.keys(RUNTIME)) {
  await build({
    root: resolve(ROOT, tool),
    configFile: CONFIG,
    build: { outDir: resolve(DIST, tool), emptyOutDir: false },
  });

  for (const file of RUNTIME[tool]) {
    const to = resolve(DIST, tool, file);
    await mkdir(dirname(to), { recursive: true });
    await copyFile(resolve(ROOT, tool, file), to);
  }
}

console.log('\ndist/ 준비 완료');
