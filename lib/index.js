'use strict';

/**  Lexical Analysis
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
/** Syntactic Analysis
 * turn tokens into AST
 * 
 * @params {array} tokens
 * @return {object} AST
 */
function parser(tokens) {
	let current = 0;
	// recursion
	function walk() {
		let token = tokens[current];
		// `number` token
		if(token.type === 'number') {
			current += 1;
			return {
				type: 'NumberLiteral',
				value: token.value
			};
		}
		// `string` token
		if(token.type === 'string') {
			current++;
			return {
				type: 'StringLiteral',
				value: token.value
			};
		}
		// CallExpressions
		if(
			token.type === 'paren' &&
			token.value === '('
		) {
			token = tokens[++current];
			let node = {
				type: 'CallExpression',
				name: token.value,
				params: []
			};
			token = tokens[++current];
			while (
				(token.type !== 'paren') ||
				(token.type === 'paren' & token.value !== ')')
			) {
				node.params.push(walk());
				token = tokens[current];
			}
			current += 1;
			return node;
		}

		throw new TypeError('TypeError', token.type);
	}
	// create AST
	let AST = {
		type: 'Program',
		body: []
	};
	while (current < tokens.length) {
		AST.body.push(walk());
	}
	return AST;
}

/** Transformation - Traversal
 * 
 * @param {object} AST
 * @param {object} visitor
 */
function traverser(ast, visitor) {
	/**
	 * @param {array} arr
	 * @param {obejct} parent
	 */
	function traverseArray(arr, parent) {
		arr.forEach(child => {
			traverseNode(child, parent);
		});
	}
	/**
	 * @param {obejct} child
	 * @param {obejct} parent
	 */
	function traverseNode(node, parent) {
		let methods = visitor[node.type];
		if(methods && methods.enter) {
			methods.enter(node, parent);
		}
		switch(node.type) {
			case 'Program':
				traverseArray(node.body, node);
				break;
			case 'CallExpression':
		        traverseArray(node.params, node);
		        break;
		    case 'NumberLiteral':
		    case 'StringLiteral':
		        break;
		    default: throw new TypeError('TypeError', node.type);
		}
		if (methods && methods.exit) {
		    methods.exit(node, parent);
		}
	}
	traverseNode(ast, null);
}

/** Transformation - Traversal
 * 
 * @param {object} ast
 * @return {object} target ast
 */
function transformer(ast) {
	let target = {
		type: 'Program',
		body: []
	};
	ast._context = target.body;
	traverser(ast, {
		NumberLiteral: {
			enter(node, parent) {
				parent._context.push({
					type: 'NumberLiteral',
					value: node.value
				});
			},
		},
		StringLiteral: {
	        enter(node, parent) {
	        	parent._context.push({
	          		type: 'StringLiteral',
	          		value: node.value,
	        	});
	        },
	    },
	    CallExpression: {
	    	enter(node, parent) {
	    		let expression = {
			        type: 'CallExpression',
			        callee: {
			            type: 'Identifier',
			            name: node.name,
			        },
			        arguments: [],
		        };
		        node._context = expression.arguments;
		        if (parent.type !== 'CallExpression') {
		            expression = {
		            	type: 'ExpressionStatement',
		            	expression: expression,
		            };
		        }
		        parent._context.push(expression);
	    	}
	    }
	});
	return target;
}

/** CODE GENERATOR
 * 
 * @params {object} ast
 * @returns {string}
 */
function codeGenerator(node) {
	switch (node.type) {
		case 'Program': 
			return node.body.map(codeGenerator).join("\n");
		case 'ExpressionStatement':
			return codeGenerator(node.expression) + ';';
		case 'CallExpression':
			return codeGenerator(node.callee) + '(' + node.arguments.map(codeGenerator).join(", ") + ')';
		case 'Identifier':
			return node.name;
		case 'NumberLiteral':
			return node.value;
		case 'StringLiteral':
			return '"' + node.value + '"';
		default: throw new TypeError('TypeError', node.type);
	}
}

/** compiler
 * link together every part of the pipeline.
 * 
 *   1. input     =>  tokenizer   => tokens
 *   2. tokens    =>  parser      => ast
 *   3. ast       =>  transformer => targetAST
 *   4. targetAST =>  generator   => output
 */
function compiler(input) {
	let tokens    =  tokenizer(input);
	let ast       =  parser(tokens);
	let targetAST =  transformer(ast);
	let output    =  codeGenerator(targetAST);
	return output;
}

export {
	tokenizer,
	parser,
	traverser,
	transformer,
	codeGenerator,
	compiler
}