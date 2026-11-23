// Run with: node scripts/test_gita_progress.mjs
import assert from "assert";
import * as P from "../js/progress.mjs";
import { pieces } from "../js/speech.mjs";

let p = P.emptyProgress();
assert.deepStrictEqual(P.todayPlan(p, 100, "2026-10-22"), { kind: "new", day: 1 });
P.completeDay(p, 1, "2026-10-22");
assert.deepStrictEqual(P.todayPlan(p, 100, "2026-10-22"), { kind: "done", day: 1 });
assert.deepStrictEqual(p.reviews[1], { step: 0, due: "2026-10-23" });
// Next day: day 2 is new, day 1 is due for recall.
assert.deepStrictEqual(P.todayPlan(p, 100, "2026-10-23"), { kind: "new", day: 2 });
assert.deepStrictEqual(P.dueReviews(p, "2026-10-23").map((r) => r.day), [1]);
P.completeDay(p, 2, "2026-10-23");
// Grades: remembered steps up, fuzzy stays, forgot resets.
P.gradeReview(p, 1, "remembered", "2026-10-23");
assert.deepStrictEqual([p.reviews[1].step, p.reviews[1].due], [1, "2026-10-26"]);
P.gradeReview(p, 1, "fuzzy", "2026-10-26");
assert.deepStrictEqual([p.reviews[1].step, p.reviews[1].due], [1, "2026-10-29"]);
P.gradeReview(p, 1, "forgot", "2026-10-29");
assert.deepStrictEqual([p.reviews[1].step, p.reviews[1].due], [0, "2026-10-30"]);
for (let i = 0; i < 9; i++) P.gradeReview(p, 1, "remembered", "2026-11-01");
assert.strictEqual(p.reviews[1].step, 4); // capped at 30 days
// Missed days: no backlog, nothing marked missed, the next day is simply next.
assert.strictEqual(p.streak, undefined);
assert.deepStrictEqual(P.todayPlan(p, 100, "2026-10-28"), { kind: "new", day: 3 });
P.completeDay(p, 3, "2026-10-28");
assert.strictEqual(p.completed[3], "2026-10-28");
// Most overdue first, at most three, never today's verse.
p = P.emptyProgress();
p.reviews = { 1: { step: 0, due: "2026-10-20" }, 2: { step: 0, due: "2026-10-10" }, 3: { step: 0, due: "2026-10-21" }, 4: { step: 0, due: "2026-10-15" }, 5: { step: 0, due: "2026-11-01" } };
assert.deepStrictEqual(P.dueReviews(p, "2026-10-22").map((r) => r.day), [2, 4, 1]);
assert.deepStrictEqual(P.dueReviews(p, "2026-10-22", 2).map((r) => r.day), [4, 1, 3]);
// Stars and weekend recap.
P.toggleStar(p, 5); P.toggleStar(p, 3); P.toggleStar(p, 5);
assert.deepStrictEqual(p.starred, [3]);
for (let d = 1; d <= 9; d++) p.completed[d] = "2026-10-1" + (d - 1);
assert.deepStrictEqual(P.recapDays(p, "2026-10-24"), [3, 4, 5, 6, 7, 8, 9]); // Saturday
assert.deepStrictEqual(P.recapDays(p, "2026-10-22"), []); // Thursday
// Finished journey.
p = P.emptyProgress(); p.nextDay = 101;
assert.deepStrictEqual(P.todayPlan(p, 100, "2026-10-22"), { kind: "finished" });
console.log("gita progress: all checks passed");

// Read-aloud: text is spoken in sentence-sized pieces (long utterances stall on iPhone).
const long = "One short sentence. " + "A much longer sentence that goes on and on with many words in it, ".repeat(6) + "and ends here.";
const parts = pieces(["  Hello   there. How are you?  ", "", long]);
assert.strictEqual(parts[0], "Hello there. How are you?");
assert.ok(parts.length > 2 && parts.every((x) => x.length <= 420), "long text is split");
assert.strictEqual(parts.join(" ").replace(/\s+/g, " "), ["Hello there. How are you?", long].join(" ").replace(/\s+/g, " ").trim());
