/**
 * console.log() 
 */
const print = {
	green: (text, ...text2) => {
		console.log(`\x1b[32m${text}\x1b[0m${text2.join(" ")}`);
	},
	red: (text,  ...text2) => {
		console.log(`\x1b[31m${text}\x1b[0m${text2.join(" ")}`);
	},
	info: (...text) => {
		console.log(text.join(" "));
	},
	blue: (text, ...text2) => {
		console.log(`\x1b[34m${text}\x1b[0m${text2.join(" ")}`);
	},
	gray: (text, ...text2) => {
		console.log(`\x1b[2m${text}\x1b[0m${text2.join(" ")}`);
	},
	yellow: (text, ...text2) => {
		console.log(`\x1B[33m${text}\x1b[0m${text2.join(" ")}`);
	},
	process: (start, end) => {
		// start, end 必须是英文字符，其它字符可能会超过或不足一行。
		let len = process.stdout.columns;
		process.stdout.write(start);
		process.stdout.write(" [");
		for (let i = start.length + end.length; i < process.stdout.columns - 5; i++) {
			process.stdout.write("=")
		}
		process.stdout.write(">] ");
		process.stdout.write(end);
		process.stdout.write("\n");
	}
}

export default print;