import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const main = fileURLToPath(new URL("./main.ts", import.meta.url));

function run(dir: string): string {
  execFileSync(process.execPath, [main, dir], { stdio: "ignore" });
  return readFileSync(join(dir, "entry.txt"), "utf8");
}

test("writes the same single line, within the character limit, every run", (t) => {
  const d1 = mkdtempSync(join(tmpdir(), "entry-a-"));
  const d2 = mkdtempSync(join(tmpdir(), "entry-b-"));
  t.after(() => {
    rmSync(d1, { recursive: true, force: true });
    rmSync(d2, { recursive: true, force: true });
  });

  const first = run(d1);
  const second = run(d2);

  assert.equal(first, second);
  assert.match(first, /^[^\r\n]+$/);
  assert.ok([...first].length >= 1 && [...first].length <= 199);
});

test("writes entry.txt inside the directory given as an argument", (t) => {
  const d = mkdtempSync(join(tmpdir(), "entry-path-"));
  t.after(() => rmSync(d, { recursive: true, force: true }));

  run(d);

  assert.deepEqual(readdirSync(d), ["entry.txt"]);
});

test("defaults the output directory to /output", () => {
  const source = readFileSync(main, "utf8");
  assert.match(source, /"\/output"/);
  assert.match(source, /"entry\.txt"/);
});
