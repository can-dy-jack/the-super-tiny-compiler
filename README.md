# the-super-tiny-compiler

> forked from [jamiebuilds/the-super-tiny-compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)


This compiler going to compile simple lisp-like function calls into some C-like function calls.

> ESM mudoles version

|               | LISP                     | C                     |
|:-------------:|:------------------------:|:---------------------:|
| 2 + 2         | `(add 2 2) `               | `add(2, 2)`             |
| 4 - 2         | `(subtract 4 2)`           | `subtract(4, 2)`        |
| 2 + (4 - 2)   | `(add 2 (subtract 4 2))`   | `add(2, subtract(4, 2))`|


1. Parsing
	1. Lexical Analysis 
	2. Syntactic Analysis)。
2. Transformation
3. Code Generation

pipeline:
> 1. input     =>  tokenizer   => tokens
> 2. tokens    =>  parser      => ast
> 3. ast       =>  transformer => targetAST
> 4. targetAST =>  generator   => output


### Tests

Run with `node __test__/index.test.js`

