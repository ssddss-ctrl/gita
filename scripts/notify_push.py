#!/usr/bin/env python3
"""Send a Gita reminder (morning, evening or test) to each device in PUSH_SUBSCRIPTIONS.

Device addresses and keys are never printed. A delivery problem is reported in the
run summary but does not fail the run.
"""
import argparse
import json
import os
import sys

SITE = "https://ssddss-ctrl.github.io/gita/"
CONTACT = "mailto:242222705+ssddss-ctrl@users.noreply.github.com"


def subscriptions(raw):
    """Accept one subscription object or a list of them; skip anything malformed."""
    try:
        value = json.loads(raw or "")
    except ValueError:
        return []
    items = value if isinstance(value, list) else [value]
    valid = []
    for item in items:
        keys = item.get("keys", {}) if isinstance(item, dict) else {}
        if (
            isinstance(item, dict)
            and str(item.get("endpoint", "")).startswith("https://")
            and keys.get("p256dh")
            and keys.get("auth")
        ):
            valid.append(
                {
                    "endpoint": item["endpoint"],
                    "keys": {"p256dh": keys["p256dh"], "auth": keys["auth"]},
                }
            )
    return valid


MESSAGES = {
    "morning": {"title": "Hari Om", "body": "Today's verse is waiting."},
    # The workflow can't see progress on the phone, so the evening alert allows for both cases.
    "evening": {"title": "Hari Om", "body": "If you haven't yet, there's still time for today's verse."},
    "test": {"title": "Gita test reminder", "body": "Reminders are working on this phone."},
}


def message(slot):
    return {**MESSAGES[slot], "url": SITE}


def send(subs, payload, private_key):
    from pywebpush import WebPushException, webpush

    report = []
    for number, sub in enumerate(subs, 1):
        try:
            webpush(
                subscription_info=sub,
                data=json.dumps(payload),
                vapid_private_key=private_key,
                vapid_claims={"sub": CONTACT},
                ttl=4 * 3600,
            )
            report.append(f"Device {number}: reminder sent.")
        except WebPushException as error:
            status = getattr(getattr(error, "response", None), "status_code", None)
            if status in (404, 410):
                report.append(
                    f"Device {number}: reminder address expired. Turn reminders on again in Settings and update the secret."
                )
            else:
                report.append(f"Device {number}: reminder not delivered (HTTP {status}).")
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--slot", choices=sorted(MESSAGES), default="morning", help="Which reminder to send")
    parser.add_argument("--test", action="store_true", help="Same as --slot test")
    args = parser.parse_args()
    subs = subscriptions(os.environ.get("PUSH_SUBSCRIPTIONS", ""))
    key = os.environ.get("VAPID_PRIVATE_KEY", "").strip()
    if not subs:
        print("Reminder skipped: no valid PUSH_SUBSCRIPTIONS secret yet.")
        return 0
    if not key:
        print("Reminder skipped: VAPID_PRIVATE_KEY secret is missing.")
        return 0
    payload = message("test" if args.test else args.slot)
    for line in send(subs, payload, key):
        print(line)
    return 0


if __name__ == "__main__":
    sys.exit(main())
