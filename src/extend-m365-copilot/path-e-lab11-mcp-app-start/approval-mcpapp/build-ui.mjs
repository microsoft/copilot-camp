/**
 * Build script that compiles all UI HTML entry points using Vite.
 * Each HTML file in ui/ is built as a separate single-file bundle into dist/.
 *
 * Usage:
 *   node build-ui.mjs          # Build all once
 *   node build-ui.mjs --watch  # Watch mode for development
 */
import { readdirSync } from "node:fs";
import { execSync, spawn } from "node:child_process";
import { join } from "node:path";

const UI_DIR = "ui";
const isWatch = process.argv.includes("--watch");

const htmlFiles = readdirSync(UI_DIR).filter((f) => f.endsWith(".html"));

if (htmlFiles.length === 0) {
  console.log("No HTML files found in ui/ directory.");
  process.exit(0);
}

console.log(`Found ${htmlFiles.length} UI entry point(s): ${htmlFiles.join(", ")}`);

if (isWatch) {
  const children = htmlFiles.map((file) => {
    const input = join(UI_DIR, file);
    console.log(`[watch] Starting watcher for ${input}`);
    const child = spawn("npx", ["cross-env", `INPUT=${input}`, "vite", "build", "--watch"], {
      stdio: "inherit",
      shell: true,
    });
    return child;
  });

  process.on("SIGINT", () => {
    children.forEach((c) => c.kill());
    process.exit(0);
  });
} else {
  for (const file of htmlFiles) {
    const input = join(UI_DIR, file);
    console.log(`\nBuilding ${input}...`);
    try {
      execSync(`npx cross-env INPUT=${input} vite build`, { stdio: "inherit" });
    } catch (err) {
      console.error(`Failed to build ${input}`);
      process.exit(1);
    }
  }
  console.log(`\n✓ Built ${htmlFiles.length} UI entry point(s) successfully.`);
}
