#!/usr/bin/env python3

import hashlib
import json
import os
import pathlib
import random
from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo


LOCAL_TZ = ZoneInfo("America/Phoenix")
START_TIME = time(8, 0)
END_TIME = time(22, 0)
SLOT_MINUTES = 15
MIN_UPDATES = 1
MAX_UPDATES = 6
NOW_PATH = pathlib.Path(__file__).resolve().parents[1] / "data" / "now.json"


def parse_now():
    test_time = os.environ.get("NOW_UPDATE_TEST_TIME")
    if test_time:
        parsed = datetime.fromisoformat(test_time)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=LOCAL_TZ)
        return parsed.astimezone(LOCAL_TZ)
    return datetime.now(LOCAL_TZ)


def local_slots(day):
    current = datetime.combine(day, START_TIME, tzinfo=LOCAL_TZ)
    end = datetime.combine(day, END_TIME, tzinfo=LOCAL_TZ)
    slots = []
    while current < end:
        slots.append(current)
        current += timedelta(minutes=SLOT_MINUTES)
    return slots


def selected_slots(day, seed):
    slots = local_slots(day)
    digest = hashlib.sha256(f"{seed}:{day.isoformat()}".encode("utf-8")).hexdigest()
    rng = random.Random(int(digest, 16))
    count = rng.randint(MIN_UPDATES, MAX_UPDATES)
    return sorted(rng.sample(slots, count))


def floor_to_slot(moment):
    minute = moment.minute - (moment.minute % SLOT_MINUTES)
    return moment.replace(minute=minute, second=0, microsecond=0)


def last_update_time():
    try:
        with NOW_PATH.open("r", encoding="utf-8") as handle:
            updated_at = json.load(handle).get("updatedAt")
        if not updated_at:
            return None
        parsed = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=LOCAL_TZ)
        return parsed.astimezone(LOCAL_TZ)
    except (OSError, ValueError, TypeError, json.JSONDecodeError):
        return None


def write_github_output(name, value):
    output_path = os.environ.get("GITHUB_OUTPUT")
    if not output_path:
        return
    with open(output_path, "a", encoding="utf-8") as handle:
        handle.write(f"{name}={value}\n")


def main():
    seed = os.environ.get("SPOTIFY_UPDATE_RANDOM_SEED", "")
    now = parse_now()
    day = now.date()
    current_slot = floor_to_slot(now)
    today_slots = selected_slots(day, seed)
    last_update = last_update_time()
    due_slots = [
        slot
        for slot in today_slots
        if slot <= current_slot and (last_update is None or slot > last_update)
    ]
    should_run = bool(due_slots)

    formatted_slots = ", ".join(slot.strftime("%I:%M %p").lstrip("0") for slot in today_slots)
    print(f"Local time: {now.isoformat()}")
    print(f"Selected update slots for {day.isoformat()} America/Phoenix: {formatted_slots}")
    print(f"Current 15-minute slot: {current_slot.strftime('%I:%M %p').lstrip('0')}")
    print(f"Last widget update: {last_update.isoformat() if last_update else 'unknown'}")
    if due_slots:
        print(f"Catching up selected slot: {due_slots[0].strftime('%I:%M %p').lstrip('0')}")
    print(f"should_run={'true' if should_run else 'false'}")

    write_github_output("should_run", "true" if should_run else "false")


if __name__ == "__main__":
    main()
