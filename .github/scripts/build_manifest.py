"""바로 아래 폴더 중 index.html이 있는 것을 모아 manifest.json으로 쓴다.

랜딩 index.html이 이 파일을 읽어 바로가기 카드를 그린다.
manifest.json은 커밋하지 않는다 - 배포할 때마다 Actions가 새로 만든다.

훑을 곳은 인자로 받고, 없으면 저장소 뿌리를 본다. 배포할 때는 빌드 결과를 넘긴다:

    python .github/scripts/build_manifest.py          # 저장소 뿌리 (개발 중)
    python .github/scripts/build_manifest.py dist     # 빌드 결과 (Actions)
"""

import html
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else REPO
TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.IGNORECASE | re.DOTALL)


def read_title(index_file: Path) -> str | None:
    match = TITLE_RE.search(index_file.read_text(encoding="utf-8", errors="replace"))
    if not match:
        return None
    title = " ".join(html.unescape(match.group(1)).split())
    return title or None


def main() -> None:
    entries = []
    for folder in sorted(ROOT.iterdir(), key=lambda p: p.name.lower()):
        # .git, .github 같은 숨은 폴더와 _로 시작하는 작업용 폴더는 건너뛴다
        if not folder.is_dir() or folder.name.startswith((".", "_")):
            continue
        # 빌드 도구가 두고 가는 폴더는 도구가 아니다
        if folder.name in {"node_modules", "dist", "src"}:
            continue
        index_file = folder / "index.html"
        if not index_file.is_file():
            continue
        entries.append({
            "path": folder.name,
            "title": read_title(index_file) or folder.name,
        })

    out = ROOT / "manifest.json"
    out.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(entries)} entries -> {out.name}")


if __name__ == "__main__":
    main()
