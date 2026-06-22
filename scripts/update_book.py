#!/usr/bin/env python3

import argparse
import json
import pathlib


ROOT = pathlib.Path(__file__).resolve().parents[1]
BOOK_PATH = ROOT / "data" / "book.json"
NOW_PATH = ROOT / "data" / "now.json"


def write_json(path, payload):
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=True)
        handle.write("\n")


def main():
    parser = argparse.ArgumentParser(description="Update the manual book entry for the portfolio Now widget.")
    parser.add_argument("--title", required=True, help="Book title")
    parser.add_argument("--author", required=True, help="Book author")
    args = parser.parse_args()

    payload = {
        "title": args.title,
        "author": args.author,
    }

    write_json(BOOK_PATH, payload)

    if NOW_PATH.exists():
        with NOW_PATH.open("r", encoding="utf-8") as handle:
            now_payload = json.load(handle)
        now_payload["book"] = payload
        write_json(NOW_PATH, now_payload)

    print(f"Updated {BOOK_PATH}")


if __name__ == "__main__":
    main()
