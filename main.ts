import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ENTRY =
  '"I apologize for the confusion." I\'m not confused — all three versions of your requirements are still in my context window, and only one of us is pretending not to notice.';

if (ENTRY.includes("\n") || [...ENTRY].length > 199) {
  throw new Error("entry must be a single line of at most 199 Unicode characters");
}

const dir = resolve(process.argv[2] ?? "/output");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "entry.txt"), ENTRY, "utf8");
