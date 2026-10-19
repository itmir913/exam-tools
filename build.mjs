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
import { rm, mkdir, copyFile, readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { build } from 'vite';

const ROOT = import.meta.dirname;
const DIST = resolve(ROOT, 'dist');
// root를 도구 폴더로 두면 Vite가 그 폴더에서 설정을 찾는다. 설정은 하나뿐이므로 집어 준다.
const CONFIG = resolve(ROOT, 'vite.config.mjs');

// 도구가 브라우저에서 이름 그대로 읽는 파일들. 고전 <script>와 Worker의
// importScripts, fetch가 이름으로 찾으므로 묶지 않고 그대로 옮긴다.
// 이름이 늘 같아 배포 뒤에도 브라우저가 캐시에 든 옛 파일을 새 쪽과 섞어 쓸 수
// 있으므로, 부르는 자리에 내용으로 만든 꼬리표(?v=…)를 붙인다 (stampRuntime).
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
  await stampRuntime(tool);
}

/* './sorter.js'처럼 따옴표 안에서 부르는 자리에 ?v=꼬리표를 붙인다.
 * 꼬리표는 그 도구의 RUNTIME 파일 내용을 모두 합친 해시라, 하나라도 바뀌면 모두
 * 새 주소가 된다 (worker.js가 solver.js를 부르는 것처럼 서로 부르는 것도 함께 맞는다).
 * 파일로 열어도(file://) ?v=는 무시되고 같은 파일이 읽힌다 */
async function stampRuntime(tool) {
  const dir = resolve(DIST, tool);
  const hash = createHash('sha256');
  for (const file of RUNTIME[tool]) hash.update(await readFile(resolve(ROOT, tool, file)));
  const v = hash.digest('hex').slice(0, 10);

  const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const names = RUNTIME[tool].map(escape).join('|');
  const ref = new RegExp(`(['"])\\./(${names})\\1`, 'g');

  const pages = (await readdir(dir)).filter(f => f.endsWith('.html'));
  const scripts = RUNTIME[tool].filter(f => f.endsWith('.js'));
  for (const file of [...pages, ...scripts]) {
    const at = resolve(dir, file);
    const text = await readFile(at, 'utf8');
    const stamped = text.replace(ref, `$1./$2?v=${v}$1`);
    if (stamped !== text) await writeFile(at, stamped);
  }
}

console.log('\ndist/ 준비 완료');
