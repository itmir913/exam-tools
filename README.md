# 지필평가 도구

지필평가를 낼 때 손이 많이 가는 계산과 정리를 브라우저에서 끝내는 정적 도구 모음입니다.
서버가 없고, 입력한 내용은 전부 브라우저 안에서만 처리합니다.

<https://luminousky.com/exam-tools/>

## 도구

### [배점 생성기](https://luminousky.com/exam-tools/exam-points/) — `exam-points/`

총점과 문항 수를 넣으면 배점별 문항 수를 자동으로 나눕니다. 배점 종류를 최대한 늘려
다른 문항을 틀린 학생끼리 같은 점수가 덜 나오게 합니다. 난이도별 문항 수를 함께 지정할
수 있고, 답이 없을 때는 왜 없는지와 가능한 다른 안을 알려 줍니다.

### [지필평가 선택지 정렬기](https://luminousky.com/exam-tools/choice-order/) — `choice-order/`

원안지의 선택지나 보기를 붙여 넣으면 글자 수순·사전순으로 정렬해 줍니다. ①②③, ㉠㉡㉢,
가나다, A. 등 시험지에서 쓰는 번호를 알아보고 다시 매기며, 탭 구분으로 복사하면
한글·워드·엑셀에서 칸이 맞습니다.

## 로컬에서 보기

저장소 뿌리에서 정적 서버를 띄우면 배포된 주소와 같은 구조로 열립니다.

```bash
python -m http.server 8765
```

랜딩(`index.html`)은 `manifest.json`을 읽어 카드를 그립니다. 이 파일은 커밋하지 않으므로,
카드를 보려면 한 번 만들어 줍니다.

```bash
python .github/scripts/build_manifest.py
```

## 테스트

도구마다 의존성 없는 node 테스트가 있습니다.

```bash
node exam-points/test.js
node choice-order/test.js
```

화면 글자 크기 검사도 같이 돌려 볼 수 있습니다.

```bash
python .github/scripts/check_text_size.py
```

## 배포

`main`에 push하면 GitHub Actions(`.github/workflows/deploy-pages.yml`)가 검사와 테스트를
돌리고, `manifest.json`을 만들어 저장소 뿌리를 그대로 GitHub Pages에 올립니다.
하나라도 실패하면 사이트는 그대로 둡니다. 저장소 설정은 Settings → Pages → Source:
GitHub Actions 입니다.
