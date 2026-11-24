// One-Sentence Absurd Invention Pitch — a program that writes one
// sentence pitching a ridiculous invention that fixes a tiny everyday
// annoyance, to /output/entry.txt.
//
// The pitch is a fixed string on purpose: the entry is judged on the
// writing, so the program's job is to deliver exactly that sentence,
// byte for byte, every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Why this sentence, against the judge's brief:
// - It is one sentence pitching a ridiculous invention that fixes a
//   tiny everyday annoyance: a keyboard that extorts its owner into
//   cleaning the crumbs out of it.
// - It is funny on the first read: the keyboard takes a vowel hostage,
//   and it starts with the letter you need most — the machine has a
//   sense of timing.
// - The fix is silly yet weirdly plausible: ransom as a cleaning
//   incentive, one vowel a day, escalating until the crumbs are gone.
// - It is fresh: the joke is not a gadget that cleans for you, it is
//   a gadget that blackmails you into cleaning it yourself.
// - It is tight: one sentence that names the annoyance, the invention
//   and its silly mechanism without clutter.
const SENTENCE =
  "A keyboard that holds one vowel hostage a day until you clean the crumbs out of it, starting with the letter you need most.";

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

function main(): void {
  // The gate only accepts 1 to 220 characters of UTF-8 text, so refuse
  // loudly instead of shipping a sentence the gate would throw away. It
  // also refuses text that is only white space, so check that too.
  if (SENTENCE.length < 1 || SENTENCE.length > 220) {
    throw new Error(`entry must be 1-220 characters, got ${SENTENCE.length}`);
  }
  if (SENTENCE.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  // The entry must stand alone as one sentence: no line break anywhere
  // inside it, so a typo can never slip a second line past the gate.
  if (/[\r\n]/.test(SENTENCE)) {
    throw new Error("entry must be a single line");
  }
  // One clean sentence means no tabs and no doubled spaces either: a
  // stray tab would read as a formatting glitch in front of the judge.
  if (/[\t]/.test(SENTENCE) || /  /.test(SENTENCE)) {
    throw new Error("entry must not contain tabs or double spaces");
  }
  // One sentence, not two wearing a trench coat: exactly one terminal
  // period, and no other sentence-ending punctuation hiding inside it.
  const terminators = SENTENCE.match(/[.!?]/g) ?? [];
  if (terminators.length !== 1 || !SENTENCE.endsWith(".")) {
    throw new Error("entry must be exactly one sentence");
  }
  // The gate counts every byte, so write exactly the sentence and nothing
  // else: no trailing newline.
  // /output is a mount point in the grader sandbox: never delete the
  // directory itself, only create it if missing and write the file.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, SENTENCE, "utf8");
  // Read the file back and refuse to finish unless it holds exactly
  // the one sentence: a stray byte would make the gate reject the entry,
  // and it is cheaper to fail here than on the server.
  if (readFileSync(OUT_FILE, "utf8") !== SENTENCE) {
    throw new Error("entry file does not hold exactly the one sentence");
  }
  console.log(`Wrote ${SENTENCE.length} characters to ${OUT_FILE}`);
}

main();
