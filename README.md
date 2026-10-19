# 지필평가 도구

지필평가를 낼 때 손이 많이 가는 계산과 정리를 브라우저에서 끝내는 정적 도구 모음입니다.
서버가 없고, 입력한 내용은 전부 브라우저 안에서만 처리합니다.

<https://luminousky.com/exam-tools/>

## 도구

각 도구 쪽에는 오프라인 zip을 받는 링크가 있습니다. 인터넷이 없는 교무실 PC에서도
풀어서 `index.html`을 열면 그대로 돌아갑니다 (글꼴과 스타일까지 zip 안에 들어 있습니다).

### [지필평가 배점 생성기](https://luminousky.com/exam-tools/create-points/) — `create-points/`

총점과 문항 수를 넣으면 배점별 문항 수를 자동으로 나눕니다. 배점 종류를 최대한 늘려
다른 문항을 틀린 학생끼리 같은 점수가 덜 나오게 합니다. 난이도별 문항 수를 함께 지정할
수 있고, 답이 없을 때는 왜 없는지와 가능한 다른 안을 알려 줍니다.

### [지필평가 선택지 정렬기](https://luminousky.com/exam-tools/choice-order/) — `choice-order/`

원안지의 선택지나 보기를 붙여 넣으면 글자 수순·사전순으로 정렬해 줍니다. ①②③, ㉠㉡㉢,
가나다, A. 등 시험지에서 쓰는 번호를 알아보고 다시 매기며, 탭 구분으로 복사하면
한글·워드·엑셀에서 칸이 맞습니다.

## 로컬에서 보기

Tailwind CSS를 빌드해 쓰므로 Vite 개발 서버로 엽니다. 세 쪽(랜딩과 두 도구)이 한
서버에 올라오고, 고친 자리는 바로 화면에 반영됩니다.

```bash
npm install
npm run dev
```

랜딩(`index.html`)은 `manifest.json`을 읽어 카드를 그립니다. 이 파일은 커밋하지 않으므로,
카드를 보려면 한 번 만들어 줍니다.

```bash
python .github/scripts/build_manifest.py
```

배포될 모습 그대로 보려면 빌드한 뒤 띄웁니다. 결과는 `dist/`에 쌓입니다.

```bash
npm run build
npm run preview
```

## 테스트

도구마다 의존성 없는 node 테스트가 있습니다.

```bash
npm test
```

```bash
node create-points/test.js
node choice-order/test.js
```

화면 글자 크기 검사도 같이 돌려 볼 수 있습니다.

```bash
python .github/scripts/check_text_size.py
```

## 빌드

`npm run build`(= `node build.mjs`)가 Vite로 세 쪽을 각각 빌드해 `dist/`에 모읍니다.
도구마다 따로 빌드하는 이유는 그 도구가 쓰는 CSS와 글꼴이 **그 폴더 안에** 들어가야
하기 때문입니다. 그래야 `dist/create-points/` 하나만 묶어도 인터넷 없이 열리는 zip이
됩니다. 주소는 모두 상대 주소(`base: './'`)라 같은 빌드가 Pages에서도, 파일로 열어도
그대로 뜹니다.

솔버·정렬기처럼 브라우저가 이름 그대로 읽는 파일(`solver.js`, `worker.js`,
`precalc.json`, `sorter.js`)은 묶지 않고 그대로 옮깁니다. `build.mjs`의 `RUNTIME`
목록이 그 명단입니다.

## 배포

`main`에 push하면 GitHub Actions(`.github/workflows/deploy-pages.yml`)가 검사와 테스트를
돌리고, 빌드한 `dist/`를 GitHub Pages에 올립니다. 같은 실행에서 도구 폴더마다
`create-points.zip`·`choice-order.zip`을 만들어 `latest` 릴리스에 갱신합니다 - 사이트와
내려받는 zip이 늘 같은 커밋을 가리킵니다. 하나라도 실패하면 사이트도 zip도 그대로
둡니다. 저장소 설정은 Settings → Pages → Source: GitHub Actions 입니다.
