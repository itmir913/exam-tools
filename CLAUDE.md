# 이 저장소에서 지킬 것

## 커밋 메시지에 서명 줄을 넣지 않는다

`Co-Authored-By:`를 비롯해 생성 도구가 붙이는 서명 줄(`🤖 Generated with ...` 등)은
이 저장소의 이력에 남기지 않는다. 커밋 메시지는 무엇을 왜 바꿨는지만 적는다.

`.githooks/commit-msg`가 커밋할 때 그런 줄을 자동으로 지운다. 처음 클론했으면 한 번
연결해 준다.

```bash
git config core.hooksPath .githooks
```

hook을 거치지 않고 들어간 커밋이 있으면 **push 전에** rebase로 지운다.

```bash
git rebase -i --root   # 또는 손댈 범위만
```

이미 push된 이력이라면 임의로 force push하지 않고 먼저 묻는다.

## 화면 글자는 text-base(16px) 미만으로 쓰지 않는다

작은 글씨는 읽기 힘들어 쓰지 않는다. tailwind의 `text-sm`·`text-xs`와 1rem 미만
`font-size`는 `.github/scripts/check_text_size.py`가 찾아내 배포를 막는다. 배포 전에
직접 돌려 볼 수 있다.

```bash
python .github/scripts/check_text_size.py
```

## 파일 두는 자리

- 도구 전용 파일은 그 도구 폴더 안에 둔다 (`exam-points/`, `choice-order/`).
- 저장소 전체에 걸친 규칙·스크립트·워크플로는 `.github/` 아래에 둔다.
- `manifest.json`은 커밋하지 않는다. 배포할 때 Actions가
  `.github/scripts/build_manifest.py`로 새로 만든다.
