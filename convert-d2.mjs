import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { exec as rawExec } from "node:child_process";

const exec = promisify(rawExec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const inputDir = path.join(__dirname, "diagrams");
const outputDir = path.join(inputDir, "png");
const D2 = `${process.env.HOME}/.local/bin/d2`;

if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".d2"));

const tasks = files.map((file) => {
	const inputPath = path.join(inputDir, file);
	const outputPath = path.join(outputDir, file.replace(/\.d2$/, ".png"));
	const cmd = `${D2} "${inputPath}" "${outputPath}" --layout elk --pad 20 --scale 3 --theme 5`;

	return exec(cmd)
		.then(({ stderr }) => {
			if (stderr && !stderr.includes("success") && !stderr.includes("info")) {
				console.warn(`⚠️ stderr for ${file}: ${stderr}`);
			}
			console.log(`✅ Converted: ${file} → ${outputPath}`);
		})
		.catch((err) => {
			console.error(`❌ Error converting ${file}: ${err.message}`);
		});
});

Promise.allSettled(tasks).then((results) => {
	const failed = results.filter((r) => r.status === "rejected").length;
	const total = results.length;
	console.log(
		`\n📊 변환 완료: ${total}개 중 ${total - failed}개 성공, ${failed}개 실패`,
	);
});
