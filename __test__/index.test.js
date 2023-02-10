import {
	tokenizer,
	parser,
	traverser,
	transformer,
	codeGenerator,
	compiler
} from "../lib/index.js";
import assert from 'node:assert/strict';
import print from "./print.js";

const input  = '(add 2 (subtract 4 2))';
const output = 'add(2, subtract(4, 2));';
const tokens = [
  { type: 'paren',  value: '('        },
  { type: 'name',   value: 'add'      },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: '('        },
  { type: 'name',   value: 'subtract' },
  { type: 'number', value: '4'        },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: ')'        },
  { type: 'paren',  value: ')'        }
];
const AST = {
  type: 'Program',
  body: [{
    type: 'CallExpression',
    name: 'add',
    params: [{
      type: 'NumberLiteral',
      value: '2'
    }, {
      type: 'CallExpression',
      name: 'subtract',
      params: [{
        type: 'NumberLiteral',
        value: '4'
      }, {
        type: 'NumberLiteral',
        value: '2'
      }]
    }]
  }]
};
const targetAST = {
  type: 'Program',
  body: [{
    type: 'ExpressionStatement',
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'add'
      },
      arguments: [{
        type: 'NumberLiteral',
        value: '2'
      }, {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'subtract'
        },
        arguments: [{
          type: 'NumberLiteral',
          value: '4'
        }, {
          type: 'NumberLiteral',
          value: '2'
        }]
      }]
    }
  }]
};


function test_part(func, i, o, info) {
	console.log(`  ${func.name}() test:`);
	assert.deepStrictEqual(
		func(i), 
		o, 
		info
	);
	console.log(`\x1b[32m    √ \x1b[0m \x1b[2m${info}\x1b[0m`);
}
/**
 * Assert
 */ 
print.info();
print.blue("the-super-tiny-compiler tests:");

test_part(
	tokenizer, 
	input, tokens, 
	'Tokenizer should turn `input` string into `tokens` array'
);
test_part(
	parser, 
	tokens, AST, 
	'Parser should turn `tokens` array into `ast`'
);
test_part(
	transformer, 
	AST, targetAST, 
	'Transformer should turn `ast` into a `targetAST`'
);
test_part(
	codeGenerator, 
	targetAST, output,
	'Code Generator should turn `targetAST` into `output` string'
);
test_part(
	compiler, 
	input, output,
	'Compiler should turn `input` into `output`'
);

print.process("test", "100%");
print.green("All tests are passed!");
print.info();