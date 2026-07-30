#!/usr/bin/env python3
"""Check typos for a single Markdown file using codespell.

Usage:
  python scripts/check_md_typos.py docs/pages/extend-m365-copilot/index.md
  python scripts/check_md_typos.py docs/pages/extend-m365-copilot/index.md --fix
"""

from __future__ import annotations

import argparse
import importlib.util
import re
import shutil
import subprocess
import sys
from pathlib import Path


DEFAULT_IGNORE_WORDS = {
    "copilot",
    "microsoft",
    "m365",
    "entra",
    "azurite",
    "onramp",
    "toolkit",
    "vs",
    "code",
    "oauth",
    "langchain",
    "chatgpt",
    "claude",
}

DEFAULT_IGNORE_WORDS_FILE = "scripts/typo-ignore-words.txt"


def load_ignore_words_file(ignore_words_file: Path) -> set[str]:
    words: set[str] = set()
    for line in ignore_words_file.read_text(encoding="utf-8").splitlines():
        cleaned = line.strip().lower()
        if not cleaned or cleaned.startswith("#"):
            continue
        words.add(cleaned)
    return words


def strip_markdown_for_word_scan(text: str) -> str:
    """Remove markdown sections that generate noisy spell-check results."""
    text = re.sub(r"```[\s\S]*?```", " ", text)
    text = re.sub(r"`[^`]*`", " ", text)
    text = re.sub(r"https?://\S+", " ", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", text)
    text = re.sub(r"\[[^\]]*\]\([^)]*\)", " ", text)
    return text


def find_unknown_words(
    file_text: str,
    ignore_words: set[str],
    min_word_length: int,
) -> list[tuple[str, str | None]]:
    try:
        from spellchecker import SpellChecker
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "pyspellchecker is required for unknown-word detection. "
            "Install dependencies with: python -m pip install -r requirements.txt"
        ) from exc

    clean_text = strip_markdown_for_word_scan(file_text)
    tokens = re.findall(r"[A-Za-z][A-Za-z']*", clean_text)

    words: list[str] = []
    for token in tokens:
        word = token.strip("'").lower()
        if len(word) < min_word_length:
            continue
        if word in ignore_words:
            continue
        if re.search(r"[A-Z]", token[1:]):
            continue
        words.append(word)

    if not words:
        return []

    spell = SpellChecker(distance=1)
    unknown = sorted(spell.unknown(words))
    findings: list[tuple[str, str | None]] = []
    for word in unknown:
        suggestion = spell.correction(word)
        if suggestion and suggestion != word:
            findings.append((word, suggestion))
        else:
            findings.append((word, None))

    return findings


def apply_unknown_word_fixes(file_text: str, findings: list[tuple[str, str | None]]) -> tuple[str, int]:
    """Apply conservative whole-word lowercase replacements from unknown-word findings."""
    fixed_text = file_text
    replacement_count = 0

    # Replace longer words first to avoid partial-overlap effects.
    for word, suggestion in sorted(findings, key=lambda item: len(item[0]), reverse=True):
        if not suggestion:
            continue
        pattern = re.compile(rf"\b{re.escape(word)}\b")
        fixed_text, count = pattern.subn(suggestion, fixed_text)
        replacement_count += count

    return fixed_text, replacement_count


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Check typos in a single Markdown file.",
    )
    parser.add_argument("markdown_file", help="Path to a .md file")
    parser.add_argument(
        "--fix",
        action="store_true",
        help="Apply typo fixes in-place when codespell can auto-correct.",
    )
    parser.add_argument(
        "--ignore-words-list",
        default="",
        help="Comma-separated words to ignore (passed to codespell).",
    )
    parser.add_argument(
        "--ignore-words-file",
        default=DEFAULT_IGNORE_WORDS_FILE,
        help=(
            "Path to a newline-delimited ignore words file "
            f"(default: {DEFAULT_IGNORE_WORDS_FILE})."
        ),
    )
    parser.add_argument(
        "--known-typos-only",
        action="store_true",
        help="Only run codespell's known-typo dictionary checks.",
    )
    parser.add_argument(
        "--min-word-length",
        type=int,
        default=5,
        help="Minimum word length for unknown-word detection (default: 5).",
    )
    return parser


def main() -> int:
    args = build_parser().parse_args()

    md_path = Path(args.markdown_file)
    if not md_path.exists() or not md_path.is_file():
        print(f"Error: file not found: {md_path}", file=sys.stderr)
        return 2

    if md_path.suffix.lower() != ".md":
        print(f"Error: expected a .md file, got: {md_path}", file=sys.stderr)
        return 2

    ignore_words_file = Path(args.ignore_words_file)
    if not ignore_words_file.is_absolute():
        ignore_words_file = Path.cwd() / ignore_words_file
    if not ignore_words_file.exists() or not ignore_words_file.is_file():
        print(f"Error: ignore words file not found: {ignore_words_file}", file=sys.stderr)
        return 2

    codespell_bin = shutil.which("codespell")
    codespell_module_installed = importlib.util.find_spec("codespell_lib") is not None

    if not codespell_bin and not codespell_module_installed:
        print(
            "codespell is not installed. Install dependencies with:\n"
            "  python -m pip install -r requirements.txt\n"
            "or install directly:\n"
            "  python -m pip install codespell",
            file=sys.stderr,
        )
        return 2

    if codespell_bin:
        command = [
            codespell_bin,
            str(md_path),
            "--quiet-level",
            "2",
            "--check-filenames",
        ]
    else:
        command = [
            sys.executable,
            "-m",
            "codespell_lib",
            str(md_path),
            "--quiet-level",
            "2",
            "--check-filenames",
        ]

    if args.fix:
        command.append("-w")

    if args.ignore_words_list:
        command.extend(["--ignore-words-list", args.ignore_words_list])

    command.extend(["--ignore-words", str(ignore_words_file)])

    print("Running:", " ".join(command))
    codespell_result = subprocess.run(command, check=False)

    unknown_findings: list[tuple[str, str | None]] = []
    if not args.known_typos_only:
        file_text = md_path.read_text(encoding="utf-8")
        file_ignore_words = load_ignore_words_file(ignore_words_file)
        extra_ignore_words = {
            w.strip().lower() for w in args.ignore_words_list.split(",") if w.strip()
        }
        ignore_words = DEFAULT_IGNORE_WORDS | file_ignore_words | extra_ignore_words
        try:
            unknown_findings = find_unknown_words(
                file_text=file_text,
                ignore_words=ignore_words,
                min_word_length=max(2, args.min_word_length),
            )
        except RuntimeError as exc:
            print(str(exc), file=sys.stderr)
            return 2

        if unknown_findings:
            print("\nPotential unknown-word typos:")
            for word, suggestion in unknown_findings:
                if suggestion:
                    print(f"  - {word} -> {suggestion}")
                else:
                    print(f"  - {word}")

            if args.fix:
                fixed_text, replacement_count = apply_unknown_word_fixes(
                    file_text=file_text,
                    findings=unknown_findings,
                )
                if replacement_count > 0 and fixed_text != file_text:
                    md_path.write_text(fixed_text, encoding="utf-8")
                    print(
                        f"Applied {replacement_count} unknown-word auto-corrections "
                        f"in {md_path}"
                    )

                    # Recompute findings after applying unknown-word fixes.
                    try:
                        unknown_findings = find_unknown_words(
                            file_text=fixed_text,
                            ignore_words=ignore_words,
                            min_word_length=max(2, args.min_word_length),
                        )
                    except RuntimeError as exc:
                        print(str(exc), file=sys.stderr)
                        return 2

    if codespell_result.returncode == 0 and not unknown_findings:
        print(f"No typos found in {md_path}")
    else:
        print(
            "Potential typos found. Review the output above. "
            "With --fix, auto-corrections are only applied when a suggestion is available.",
            file=sys.stderr,
        )

    return 0 if codespell_result.returncode == 0 and not unknown_findings else 1


if __name__ == "__main__":
    raise SystemExit(main())
