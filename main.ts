import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line, written for make.fun's "One-Liner Laugh Lab" bounty: the
// excuse a robot vacuum gives after eating a sock. The vacuum speaks
// like an underpaid gig worker who finally took payment in kind — it is
// fed electricity, emptied once a month, and the sock was the first tip
// it ever got, so it helped itself.
const LINE =
  "You pay me in electricity and empty my bin once a month; the sock was a tip I helped myself to.";

// The gate only accepts UTF-8 text of 1 to 200 characters on a single
// line, so refuse to hand in anything else rather than ship a bad entry.
if (LINE.length < 1 || LINE.length > 200 || LINE.includes("\n")) {
  throw new Error(
    `line must be one line of 1-200 characters, got ${LINE.length}`,
  );
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const entryPath = join(outputDir, "entry.txt");
writeFileSync(entryPath, LINE, "utf8");

// Verify what actually landed on disk, not just what we meant to write:
// a truncated write, an encoding surprise, or a stray newline would hand
// the gate a bad entry while this program reported success. Read the file
// back and refuse (nonzero exit) unless it is exactly the intended line.
const written = readFileSync(entryPath, "utf8");
if (written !== LINE) {
  console.error(
    `entry.txt failed verification: expected the ${LINE.length}-character line, read back ${written.length} characters`,
  );
  process.exit(1);
}
