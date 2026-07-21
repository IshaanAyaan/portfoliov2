import json
import os
import pathlib
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from unittest import mock


ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import should_update_now as gate


class FreshnessGateTests(unittest.TestCase):
    def setUp(self):
        self.now = datetime(2026, 7, 20, 12, 17, tzinfo=gate.LOCAL_TZ)

    def test_fresh_data_skips_refresh(self):
        should_run, reason, age = gate.refresh_decision(
            self.now, self.now - timedelta(hours=2), "valid"
        )
        self.assertFalse(should_run)
        self.assertEqual(reason, "fresh")
        self.assertEqual(age, 120)

    def test_stale_data_refreshes(self):
        should_run, reason, age = gate.refresh_decision(
            self.now, self.now - timedelta(hours=4), "valid"
        )
        self.assertTrue(should_run)
        self.assertEqual(reason, "stale")
        self.assertEqual(age, 240)

    def test_missing_and_invalid_data_refresh(self):
        self.assertEqual(gate.refresh_decision(self.now, None, "missing")[:2], (True, "missing_data"))
        self.assertEqual(gate.refresh_decision(self.now, None, "invalid")[:2], (True, "invalid_data"))

    def test_previous_local_day_refreshes_even_when_under_four_hours_old(self):
        now = datetime(2026, 7, 21, 0, 30, tzinfo=gate.LOCAL_TZ)
        previous = datetime(2026, 7, 20, 23, 45, tzinfo=gate.LOCAL_TZ)
        self.assertEqual(gate.refresh_decision(now, previous, "valid")[:2], (True, "new_local_day"))

    def test_timezone_conversion_uses_phoenix_date(self):
        last_update = datetime(2026, 7, 21, 5, 30, tzinfo=timezone.utc).astimezone(gate.LOCAL_TZ)
        now = datetime(2026, 7, 20, 23, 0, tzinfo=gate.LOCAL_TZ)
        self.assertEqual(gate.refresh_decision(now, last_update, "valid")[:2], (False, "fresh"))

    def test_future_timestamp_refreshes(self):
        future = self.now + timedelta(minutes=6)
        self.assertEqual(gate.refresh_decision(self.now, future, "valid")[:2], (True, "future_timestamp"))

    def test_force_refresh_overrides_freshness(self):
        result = gate.refresh_decision(self.now, self.now - timedelta(minutes=5), "valid", force=True)
        self.assertEqual(result[:2], (True, "forced"))

    def test_last_update_rejects_malformed_and_naive_timestamps(self):
        with tempfile.TemporaryDirectory() as directory:
            path = pathlib.Path(directory) / "now.json"
            path.write_text("not json", encoding="utf-8")
            self.assertEqual(gate.last_update_time(path), (None, "invalid"))
            path.write_text(json.dumps({"updatedAt": "2026-07-20T12:00:00"}), encoding="utf-8")
            self.assertEqual(gate.last_update_time(path), (None, "invalid"))

    def test_test_time_is_deterministic_and_converted(self):
        with mock.patch.dict(os.environ, {"NOW_UPDATE_TEST_TIME": "2026-07-21T05:00:00+00:00"}):
            parsed = gate.parse_now()
        self.assertEqual(parsed.isoformat(), "2026-07-20T22:00:00-07:00")

    def test_delayed_hourly_wakeups_still_produce_four_refreshes(self):
        wakeups = [(8, 37), (9, 55), (12, 58), (14, 12), (17, 40), (18, 35), (21, 50)]
        last_update = datetime(2026, 7, 19, 20, 17, tzinfo=gate.LOCAL_TZ)
        refreshes = []
        for hour, minute in wakeups:
            now = datetime(2026, 7, 20, hour, minute, tzinfo=gate.LOCAL_TZ)
            should_run, _, _ = gate.refresh_decision(now, last_update, "valid")
            if should_run:
                refreshes.append(now)
                last_update = now
        self.assertEqual(refreshes, [
            datetime(2026, 7, 20, 8, 37, tzinfo=gate.LOCAL_TZ),
            datetime(2026, 7, 20, 12, 58, tzinfo=gate.LOCAL_TZ),
            datetime(2026, 7, 20, 17, 40, tzinfo=gate.LOCAL_TZ),
            datetime(2026, 7, 20, 21, 50, tzinfo=gate.LOCAL_TZ),
        ])


if __name__ == "__main__":
    unittest.main()
