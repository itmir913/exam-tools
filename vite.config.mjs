/* 랜딩과 두 도구가 한 저장소에 있고, 각자 제 폴더 안에서 완결되게 빌드한다
 * (build.mjs가 폴더마다 한 번씩 이 설정을 쓴다).
 *
 * base를 './'로 두어 모든 주소가 상대 주소로 나온다. 같은 빌드 하나가
 * luminousky.com/exam-tools/ 아래에서도, 내려받은 zip을 파일로 열 때도(file://)
 * 그대로 뜬다.
 *
 * 개발 중에는 `npm run dev` 하나로 세 쪽을 모두 볼 수 있다. */
import { execFile } from 'node:child_process';
import { resolve } from 'node:path';

/* Vite는 <link>·<script>에 crossorigin을 붙인다. 파일로 열면(file://) 그 요청은
 * 출처가 없는 것으로 다뤄져 막히고, 스타일이 빠진 쪽이 뜬다. 그래서 떼어 낸다. */
function dropCrossorigin() {
  return {
    name: 'drop-crossorigin',
    transformIndexHtml(html) {
      return html.replace(/\s+crossorigin(?==|\s|>)/g, '');
    },
  };
}

/* 랜딩이 읽는 manifest.json은 커밋하지 않고 .github/scripts/build_manifest.py가 만든다.
 * 개발 서버는 주소를 요청받을 때마다 그 스크립트를 돌려 새로 만들어 주므로, 도구 폴더를
 * 더하거나 <title>을 고치면 새로고침만으로 카드가 바뀐다. 만드는 쪽을 하나로 두려고
 * 같은 스크립트를 그대로 부른다. */
function devManifest() {
  const script = resolve(import.meta.dirname, '.github/scripts/build_manifest.py');
  const python = process.platform === 'win32' ? 'python' : 'python3';
  const generate = () => new Promise(done =>
    execFile(python, [script], error => {
      if (error) console.warn(`manifest.json을 만들지 못했습니다: ${error.message}`);
      done();
    }));
  return {
    name: 'dev-manifest',
    apply: 'serve',
    async configureServer(server) {
      await generate();
      server.middlewares.use(async (req, _res, next) => {
        if (req.url && req.url.split('?')[0].endsWith('/manifest.json')) await generate();
        next();
      });
    },
  };
}

export default {
  base: './',
  plugins: [dropCrossorigin(), devManifest()],
  build: {
    // 글꼴·아이콘까지 그 쪽 폴더 안에 담는다. 폴더만 zip으로 묶어도 모자란 것이 없다.
    assetsDir: 'assets',
  },
};
