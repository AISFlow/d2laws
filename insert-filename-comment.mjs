import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputDir = path.join(__dirname, "diagrams");

const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".d2"));

for (const file of files) {
	const inputPath = path.join(inputDir, file);
	const content = fs.readFileSync(inputPath, "utf-8");

	if (content.startsWith("#")) {
		console.log(`🔹 Skipped (already commented): ${file}`);
		continue;
	}

	const comment = `# ${file}\n\n`;
	fs.writeFileSync(inputPath, comment + content);
	console.log(`✅ Inserted comment into: ${file}`);
}
