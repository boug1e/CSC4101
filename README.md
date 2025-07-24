# CSC4101 Recursive Descent Parser

A web-based implementation of a recursive descent parser for a simple programming language.

## Overview

This project implements a complete lexical analyzer and recursive descent parser for a custom programming language. The parser is built using TypeScript and provides a web-based interface for testing code compilation.

## Features

- **Lexical Analysis**: Tokenizes input code into meaningful tokens
- **Recursive Descent Parsing**: Implements top-down parsing with recursive functions
- **Web Interface**: Interactive browser-based code editor and output display
- **Error Handling**: Comprehensive error reporting for syntax and lexical errors
- **Real-time Compilation**: Instant feedback on code compilation status

## Supported Language Features

The parser supports the following language constructs:

### Basic Structure
- Program blocks: `program ... end_program`
- Statements and expressions
- Variable assignments: `variable = expression;`

### Control Structures
- **Conditional Statements**: `if (condition) statements end_if`
- **Loops**: `loop (variable = start : end) statements end_loop`

### Expressions
- **Arithmetic Operations**: `+`, `-`, `*`, `/`, `%`
- **Logical Operations**: `&&`, `||`
- **Comparison Operators**: `==`, `!=`, `<=`, `>=`, `>`, `<`
- **Parentheses**: For grouping expressions

### Data Types
- **Identifiers**: Variable names (letters, digits, underscores)
- **Integer Literals**: Whole numbers
- **Comments**: Single-line comments

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/boug1e/Recursive-Descent-Parser
   cd CSC4101
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Compile TypeScript** (if needed):
   ```bash
   npx tsc FinalProject.ts
   ```

## Usage

1. **Open the application**:
   - Simply open `index.html` in a web browser
   - Or serve the files using a local web server

2. **Write code**:
   - Enter your code in the left text area
   - Use the supported language syntax

3. **Compile**:
   - Click the play button (▶️) to compile your code
   - View the output in the right text area

4. **Navigation**:
   - **Code**: Switch to code input mode
   - **Documentation**: View grammar documentation
   - **About**: View project information

## Grammar Specification

The parser implements the following context-free grammar:

```
<program> -> program <stmts> end_program

<stmts> -> {stmt}

<stmt> -> <ident> = <expr>; | <condition> | <loop>

<condition> -> if (<logic_exp>) <stmts> end_if 

<logic_exp> -> <factor> (== | != | <= | >= | > | <) <factor> {<bin_cond>}

<bin_cond> -> (&& | ||) <logic_exp>

<loop> -> loop (<loop_cond>) <stmts> end_loop

<loop_cond> -> <ident> = <factor> : <factor>

<expr> -> <term> {(+ | -) <expr>}

<term> -> <factor> {(* | / | %) <term>}

<factor> -> <ident> | <lit> | (<expr>)
```

## Example Code

Here's a simple example that demonstrates the language features:

```
program
    x = 5;
    y = 10;
    if (x < y)
        result = x + y;
    end_if
    loop (i = 1 : 5)
        sum = sum + i;
    end_loop
end_program
```

## Technical Implementation

### Architecture
- **Frontend**: HTML, CSS, TypeScript
- **Parser**: Recursive descent implementation
- **Lexer**: Custom tokenizer with regex patterns
- **Error Handling**: Comprehensive error reporting

### Key Components

1. **Lexer (`lexer` function)**:
   - Tokenizes input string into meaningful tokens
   - Handles identifiers, literals, operators, and keywords
   - Supports comments and whitespace

2. **Parser (`parser` function)**:
   - Implements recursive descent parsing
   - Each grammar rule corresponds to a function
   - Provides detailed error messages

3. **Web Interface**:
   - Real-time code compilation
   - Syntax highlighting and error display
   - Interactive documentation

### Token Types

The lexer recognizes the following token types:
- **Keywords**: `program`, `end_program`, `if`, `end_if`, `loop`, `end_loop`
- **Operators**: Arithmetic (`+`, `-`, `*`, `/`, `%`), Comparison (`==`, `!=`, `<=`, `>=`, `>`, `<`), Logical (`&&`, `||`)
- **Punctuation**: `=`, `;`, `(`, `)`, `:`
- **Identifiers**: Variable names
- **Literals**: Integer constants
- **Comments**: Single-line comments

## Error Handling

The parser provides comprehensive error handling for:
- **Lexical Errors**: Invalid characters, malformed tokens
- **Syntax Errors**: Incorrect grammar structure
- **Semantic Errors**: Type mismatches, undefined variables

## Development

### Project Structure
```
CSC4101/
├── index.html          # Main HTML interface
├── style.css           # Styling for the web interface
├── FinalProject.ts     # TypeScript source code
├── FinalProject.js     # Compiled JavaScript
├── package.json        # Node.js dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

### Building from Source
1. Install TypeScript: `npm install -g typescript`
2. Compile: `tsc FinalProject.ts`
3. Open `index.html` in a browser
