import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputDir = path.join(__dirname, "diagrams");
const outputPath = path.join(inputDir, "merged.d2");

const files = fs
	.readdirSync(inputDir)
	.filter((f) => f.endsWith(".d2"))
	.sort((a, b) => a.localeCompare(b, "ko"));

let merged = "";

for (const file of files) {
	const fullPath = path.join(inputDir, file);
	const content = fs.readFileSync(fullPath, "utf-8");
	merged += `${content.trim()}\n\n`;
}

fs.writeFileSync(outputPath, merged, "utf-8");

console.log(`✅ All .d2 files merged into: ${outputPath}`);
