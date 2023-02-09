'use strict';

/** We're going to compile some lisp-like function calls into some C-like function calls.
 * 
 * 1. Parsing
 *     - 句法分析通常分为两个阶段：词汇分析和句法分析(Lexical Analysis and Syntactic Analysis)。
 * 2. Transformation
 * 3. Code Generation
 */

/**  Lexical Analysis
 * 
 *  (add 2 (subtract 4 2))
 * 
 *   => 
 * 
 *   [
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'add'      },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'subtract' },
 *     { type: 'number', value: '4'        },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: ')'        },
 *     { type: 'paren',  value: ')'        },
 *   ]
 * 
 * @params {string} input
 * @returns {array} tokens
 */
function tokenizer(input) {
	let current = 0, tokens = [];
	while (current < input.length) {
		let char = input[current];
		if (char === '(' || char === ')') {
			tokens.push({
				type: "paren",
				value: char
			});
			current += 1;
			continue;
		}
		let whitespace = /\s/;
		if (whitespace.test(char)) {
			current += 1;
			continue;
		}
		let number = /[0-9]/;
		if (number.test(char)) {
			let val = '';
			// 循环取到整个数字
			while (number.test(char)) {
				val += char;
				char = input[++current];
			}
			tokens.push({
				type: 'number',
				value: val
			})
			continue;
		}
		if(char === '"') {
			let val = '';
			char = input[++current];
			// 拿到整个字符串
			while(char !== '"') {
				val += char;
				char = input[++current];
			}
			current += 1;
			tokens.push({
				type: "string",
				value: val
			});
			continue;
		}
		let NAME = /[a-z]/i;
		if (NAME.test(char)) {
			let val = '';
			// 拿到整个关键词
			while (NAME.test(char)) {
				val += char;
				char = input[++current];
			}
			tokens.push({
				type: 'name',
				value: val
			});
			continue;
		}
		// none of thoes charactor
		throw new TypeError('TypeError! unrecognized characters: ' + char)
	}
	return tokens;
}



// commendJs
module.exports = {
	tokenizer,
}

