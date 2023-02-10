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
}

export default print;