#!/usr/bin/env python3

import json
import os
import pathlib
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo


LOCAL_TZ = ZoneInfo("America/Phoenix")
REFRESH_INTERVAL = timedelta(hours=4)
FUTURE_TOLERANCE = timedelta(minutes=5)
NOW_PATH = pathlib.Path(__file__).resolve().parents[1] / "data" / "now.json"


def parse_now():
    test_time = os.environ.get("NOW_UPDATE_TEST_TIME")
    if test_time:
        parsed = datetime.fromisoformat(test_time)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=LOCAL_TZ)
        return parsed.astimezone(LOCAL_TZ)
    return datetime.now(LOCAL_TZ)


def parse_bool(value):
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


def last_update_time(path=NOW_PATH):
    if not path.exists():
        return None, "missing"

    try:
        with path.open("r", encoding="utf-8") as handle:
            updated_at = json.load(handle).get("updatedAt")
        if not updated_at:
            return None, "invalid"
        parsed = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            return None, "invalid"
        return parsed.astimezone(LOCAL_TZ), "valid"
    except (OSError, ValueError, TypeError, json.JSONDecodeError):
        return None, "invalid"


def refresh_decision(now, last_update, state="valid", force=False):
    if force:
        return True, "forced", None if last_update is None else (now - last_update).total_seconds() / 60
    if state == "missing":
        return True, "missing_data", None
    if state != "valid" or last_update is None:
        return True, "invalid_data", None

    age = now - last_update
    age_minutes = age.total_seconds() / 60
    if last_update > now + FUTURE_TOLERANCE:
        return True, "future_timestamp", age_minutes
    if last_update.date() < now.date():
        return True, "new_local_day", age_minutes
    if age >= REFRESH_INTERVAL:
        return True, "stale", age_minutes
    return False, "fresh", age_minutes


def write_github_output(name, value):
    output_path = os.environ.get("GITHUB_OUTPUT")
    if not output_path:
        return
    with open(output_path, "a", encoding="utf-8") as handle:
        handle.write(f"{name}={value}\n")


def main():
    now = parse_now()
    last_update, state = last_update_time()
    force = parse_bool(os.environ.get("FORCE_UPDATE", "false"))
    should_run, reason, age_minutes = refresh_decision(now, last_update, state, force)

    last_updated_at = last_update.isoformat() if last_update else ""
    formatted_age = "" if age_minutes is None else str(max(0, round(age_minutes)))

    print(f"Local time: {now.isoformat()}")
    print(f"Last widget update: {last_updated_at or state}")
    print(f"Decision reason: {reason}")
    print(f"Age in minutes: {formatted_age or 'unknown'}")
    print(f"should_run={'true' if should_run else 'false'}")

    write_github_output("should_run", "true" if should_run else "false")
    write_github_output("reason", reason)
    write_github_output("last_updated_at", last_updated_at)
    write_github_output("age_minutes", formatted_age)


if __name__ == "__main__":
    main()
