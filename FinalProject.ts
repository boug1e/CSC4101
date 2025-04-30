var tokens: string[] = [];
var token_index: number = 0;
var nextToken: string;

const tokens_types: Record<string, string> = {
    "PROGRAM": "PROGRAM",
    "END_PROGRAM": "END_PROGRAM",
    "STMTS": "STMTS",
    "STMT": "STMT",
    "EXPR": "EXPR",
    "CONDITION": "CONDITION",
    "IF": "IF",
    "LOGIC_EXPR": "LOGIC_EXPR",
    "END_IF": "END_IF",
    "BINARY_EXPR": "BINARY_EXPR",
    "LOOP": "LOOP",
    "END_LOOP": "END_LOOP",
    "IDENT": "IDENT",
    "INT_LIT": "INT_LIT",
    "ASSIGN": "ASSIGN",
    "SEMICOLON": "SEMICOLON",
    "LPAREN": "LPAREN",
    "RPAREN": "RPAREN",
    "PLUS": "PLUS",
    "MINUS": "MINUS",
    "MULT": "MULT",
    "DIV": "DIV",
    "MOD": "MOD",
    "EQUAL": "EQUAL",
    "NOT_EQUAL": "NOT_EQUAL",
    "GREATER_EQUAL": "GREATER_EQUAL",
    "LESS_EQUAL": "LESS_EQUAL",
    "GREATER": "GREATER",
    "LESS": "LESS",
    "AND": "AND",
    "OR": "OR",
    "COMMENT": "COMMENT",
    "COLON": "COLON"
};

/* ---------------------button stuff---------------------------- */
function handleInput(): void {
    const input_text: HTMLTextAreaElement = document.getElementById("code-input") as HTMLTextAreaElement;
    const output_text: HTMLTextAreaElement = document.getElementById("code-output") as HTMLTextAreaElement;

    output_text.value = "";
    token_index = 0;

    try {
        tokens = lexer(input_text.value);
        console.clear();
        console.log(tokens);
        try {
            output_text.value = parser();
    
            output_text.value += `
            --------------------------------
                Code Compiled Successfully
            --------------------------------
            `;
        } catch (error) {
            output_text.value += error;
        }
    } catch (error) {
        output_text.value += error;
    }

}

function displayDocumentation(): void {
    const output_text: HTMLTextAreaElement = document.getElementById("code-output") as HTMLTextAreaElement;
    output_text.value = `
        --------------------------------
                DOCUMENTATION
        --------------------------------

<program> -> program <stmts> end_program

<stmts> -> {stmt}

<stmt> -> <ident> = <expr>; | <condition> | 
            <loop>

<condition> -> if (<logic_exp>) <stmts> end_if 

<logic_exp> -> <expr> (== | != | <= | 
            >= | > | <) <expr> {<bin_cond>}

<bin_cond> -> (&& | ||) <logic_exp>

<loop> -> loop (<loop_cond>) <stmts> end_loop

<loop_cond> -> <ident> = <expr> : <expr>

<expr> -> <term> {(+ | -) <term>}

<term> -> <factor> {(* | / | %) <term>}

<factor> -> <ident> | <lit> | (<expr>)

<ident> -> char {char | <lit>}

<lit> -> number
    `;
}

function cleanOutput(): void {
    const output_text: HTMLTextAreaElement = document.getElementById("code-output") as HTMLTextAreaElement;
    output_text.value = "";
}

function displayAbout(): void {
    const output_text: HTMLTextAreaElement = document.getElementById("code-output") as HTMLTextAreaElement;
    output_text.value = `
        --------------------------------
                    ABOUT
        --------------------------------

This program is a basic recursive descent parser written in TypeScript for CSC4101 at 
Louisiana State University. Refer to the documentation to view the EBNF grammar to see
how to use the parser. 

Github: https://github.com/boug1e
-Mason

    `;
}
/* ------------------------------------------------------------ */

function lexer(input: string): string[] {

    const tokens: string[] = [];
    const isLetter = (char: string): boolean => /[a-zA-Z_]/.test(char);
    const isDigit = (char: string): boolean => /[0-9]/.test(char);
    const isLogical = (char: string): boolean => /[><=!&|]/.test(char);

    let i : number = 0;
    while (i < input.length) {
        let char: string = input[i];
        if (char === " " || char === "\n") {
            i++;
            continue;
        }
        if (isLetter(char)) {
            let ident : string = "";
            while (i < input.length && isLetter(char) || isDigit(char)) {
                ident += char;
                i++;
                if (i < input.length) {
                    char = input[i];
                }
            }
            if (ident === "program") {
                tokens.push(tokens_types["PROGRAM"]);
            } else if (ident === "end_program") {
                tokens.push(tokens_types["END_PROGRAM"]);
            } else if (ident === "if") {
                tokens.push(tokens_types["IF"]);
            } else if (ident === "end_if") {
                tokens.push(tokens_types["END_IF"]);
            } else if (ident === "loop") {
                tokens.push(tokens_types["LOOP"]);
            } else if (ident === "end_loop") {
                tokens.push(tokens_types["END_LOOP"]);
            } else {
                tokens.push(tokens_types["IDENT"]);
            }  
            // console.log(ident);
            continue;
        }

        if (isDigit(char)) {
            let number : string = "";
            while (i < input.length && isDigit(char)) {
                number += char;
                i++;
                if (i < input.length) {
                    char = input[i];
                }
            }
            // console.log(number);
            tokens.push(tokens_types["INT_LIT"]);
            continue;
        }

        if (isLogical(char)) {
            let logical : string = "";
            while (i < input.length && isLogical(char)) {
                logical += char;
                i++;
                if (i < input.length) {
                    char = input[i];
                }
            }
            if (logical.length > 1) {
                switch (logical) {
                        case ">=": tokens.push(tokens_types["GREATER_EQUAL"]); break;
                        case "<=": tokens.push(tokens_types["LESS_EQUAL"]); break;
                        case "!=": tokens.push(tokens_types["NOT_EQUAL"]); break;
                        case "&&": tokens.push(tokens_types["AND"]); break;
                        case "||": tokens.push(tokens_types["OR"]); break;
                        case "==": tokens.push(tokens_types["EQUAL"]); break;
                        default: throw new Error(`Unexpected character: ${char}`);
                }
            } else if (logical.length === 1) {
                if (logical === ">") {
                    tokens.push(tokens_types["GREATER"]);
                } else if (logical === "<") {
                    tokens.push(tokens_types["LESS"]);
                } else if (logical === "=") {
                    tokens.push(tokens_types["ASSIGN"]);
                }
            } else {
                throw new Error(`Unexpected character: ${char}`);
            }
            // console.log(logical);
            continue;
        }

        switch (char) {
            case "(": tokens.push(tokens_types["LPAREN"]); break;
            case ")": tokens.push(tokens_types["RPAREN"]); break;
            case ";": tokens.push(tokens_types["SEMICOLON"]); break;
            case "+": tokens.push(tokens_types["PLUS"]); break;
            case "-": tokens.push(tokens_types["MINUS"]); break;
            case "*": tokens.push(tokens_types["MULT"]); break;
            case "%": tokens.push(tokens_types["MOD"]); break;
            case ":": tokens.push(tokens_types["COLON"]); break;
            case "/": 
                if (input[i+1] === "/") {
                    while (i < input.length && input[i] !== "\n") {
                        i++;
                    }
                } else {
                    tokens.push(tokens_types["DIV"]);
                }
                continue;
            default: throw new Error(`Unexpected character: ${char}`);
        }

        i++;
    }
    return tokens;
}

function lex(): string {
    token_index++;
    nextToken = tokens[token_index];
    return nextToken;
}

function parser(): string {
    var output = "";
    nextToken = tokens[0];
    program();
    function program(): void {
        output += "Enter <program>\n";
        console.log("Enter <program> " + nextToken);
        if (nextToken === tokens_types["PROGRAM"]) {
            lex();
            stmts();
            if (nextToken === tokens_types["END_PROGRAM"]) {
                lex();
            } else {
                throw new Error ("Program must end with 'end_program'.");
            }
        } else {
            throw new Error ("Program must begin with 'program'.");
        } 
        output += "Exit <program>\n";
        console.log("Exit <program> " + nextToken);
    }

    function stmts(): void {
        output += "Enter <stmts>\n";
        console.log("Enter <stmts> " + nextToken);
        // stmt();
        // if (nextToken !== tokens_types["END_PROGRAM"]) {
        //     stmts();
        // } else {
        //     throw new Error ("Missing semicolon ';' after statement.");
        // }
        while (nextToken === tokens_types["IF"] || nextToken === tokens_types["LOOP"] || nextToken === tokens_types["IDENT"]) {
            stmt();
        }

        if (nextToken === tokens_types["INT_LIT"]) {
            throw new Error ("Statements must start with an 'identifier', 'if', or 'loop'.");
        }

        output += "Exit <stmts>\n";
        console.log("Exit <stmts> " + nextToken);
    }

    function stmt(): void { 
        output += "Enter <stmt>\n";
        console.log("Enter <stmt> " + nextToken);
        if (nextToken === tokens_types["IF"]) {
            lex();
            condition();
        } else if (nextToken === tokens_types["LOOP"]) {
            lex();
            loop();
        } else if (nextToken === tokens_types["IDENT"]) {    
            variable();
            if (nextToken === tokens_types["ASSIGN"]) {
                lex();
                expr();
                if (nextToken === tokens_types["SEMICOLON"]) {
                    lex();
                } else {
                    throw new Error ("Expected semicolon ';' after assignment.");
                }
            } else {
                throw new Error ("Expected assign declaration '='.");
            }
        } else {
            throw new Error("Unexpected token: '" + nextToken + "'.");
        }
        output += "Exiting <stmt>\n";
        console.log("Exiting <stmt> " + nextToken);
    }

    function condition(): void {
        output += "Entering <condition>\n";
        console.log("Entering <condition> " + nextToken);
        if (nextToken === tokens_types["LPAREN"]) {
            lex();
            logic_expr();
            if (nextToken === tokens_types["RPAREN"]) {
                lex();
                stmts();
                if (nextToken === tokens_types["END_IF"]) {
                    lex();
                } else {
                    throw new Error ("Expected 'END_IF' to end if condition.");
                }
            } else {
                throw new Error ("Expected ')' after if condition.");
            }
        } else {
            throw new Error ("Expected '(' before if condition.");
        }
        output += "Exiting <condition>\n";
        console.log("Exiting <condition> " + nextToken);
    }

    function loop(): void {
        output += "Entering <loop>\n";
        console.log("Entering <loop> " + nextToken);
        if (nextToken === tokens_types["LPAREN"]) {
            lex();
            loop_cond();
            if (nextToken === tokens_types["RPAREN"]) {
                lex();
                stmts();
                if (nextToken === tokens_types["END_LOOP"]) {
                    lex();
                } else {
                    throw new Error ("Expected 'END_LOOP' to end loop.");
                }
            } else {
                throw new Error ("Expected ')' to close loop condition.");
            }
        } else {
            throw new Error ("Expected '(' to open loop condition.");
        }
        output += "Exiting <loop>\n";
        console.log("Exiting <loop> " + nextToken);
    }

    function loop_cond(): void {
        output += "Entering <loop_cond>\n";
        console.log("Entering <loop_cond> " + nextToken);
        variable();
        if (nextToken === tokens_types["ASSIGN"]) {
            lex();
            expr();
            if (nextToken === tokens_types["COLON"]) {
                lex();
                expr();
            } else {
                throw new Error ("Expected ':' for end of loop condition.");
            }
        } else {
            throw new Error ("Expected assign operation '=' within loop condition.");
        }
        output += "Exiting <loop_cond>\n";
        console.log("Exiting <loop_cond> " + nextToken);
    }

    function logic_expr(): void {
        output += "Entering <logic_exp>\n";
        console.log("Entering <logic_exp> " + nextToken);
        expr();
        if (nextToken === tokens_types["EQUAL"] || nextToken === tokens_types["NOT_EQUAL"] || nextToken === tokens_types["GREATER_EQUAL"] || nextToken === tokens_types["LESS_EQUAL"]
            || nextToken === tokens_types["GREATER"] || nextToken === tokens_types["LESS"]) {
            lex();
            expr();
            if (nextToken !== tokens_types["RPAREN"]) {
                bin_cond();
            }
        } else {
            throw new Error ("Expected logical expression. Ex: 'x > y'.");
        }
        output += "Exiting <logic_exp>\n";
        console.log("Exiting <logic_exp> " + nextToken);
    }

    function bin_cond(): void {
        output += "Entering <bin_cond>\n";
        console.log("Entering <bin_cond> " + nextToken);
        if (nextToken === tokens_types["AND"] || nextToken === tokens_types["OR"]) {
            lex();
            logic_expr();
        } else {
            throw new Error ("Expected binary expression '&& or ||' or closing parenthesis ')'.");
        }
        output += "Exiting <bin_cond>\n";
        console.log("Exiting <bin_cond> " + nextToken);
    }

    function expr(): void {
        output += "Entering <expr>\n";
        console.log("Entering <expr> " + nextToken);
        term();
        if (nextToken === tokens_types["PLUS"] || nextToken === tokens_types["MINUS"]) {
            lex();
            expr();
        }
        output += "Exiting <expr>\n";
        console.log("Exiting <expr> " + nextToken);
    }

    function term(): void {
        output += "Entering <term>\n";
        console.log("Entering <term> " + nextToken);
        factor();
        if (nextToken === tokens_types["MULT"] || nextToken === tokens_types["DIV"] || nextToken === tokens_types["MOD"]) {
            lex();
            term();
        }
        output += "Exiting <term>\n";
        console.log("Exiting <term> " + nextToken);
    }

    function factor(): void {
        output += "Entering <factor>\n";
        console.log("Entering <factor> " + nextToken);
        if (nextToken === tokens_types["IDENT"]) {
            variable();
        } else if (nextToken === tokens_types["INT_LIT"]) {
            lit();
        } else if (nextToken === tokens_types["LPAREN"]) {
            lex();
            expr();
            if (nextToken === tokens_types["RPAREN"]) {
                lex();
            } else {
                throw new Error ("Expected ending parenthesis ')' to expression.");
            }
        } else {
            throw new Error ("Expected a variable | integer | (expr).");
        }
        output += "Exiting <factor>\n";
        console.log("Exiting <factor> " + nextToken);
    }

    function variable(): void {
        output += "Enter <var>\n";
        console.log("Enter <var> " + nextToken);
        if (nextToken === tokens_types["IDENT"]) {
            lex();  
        } else {
            throw new Error ("Expected identifier in assignment '='.");
        }
        output += "Exiting <var>\n";
        console.log("Exiting <var> " + nextToken);
    }

    function lit(): void {
        output += "Entering <int_lit>\n";
        console.log("Entering <int_lit> " + nextToken);
        if (nextToken === tokens_types["INT_LIT"]) {
            lex();
        } else {
            throw new Error ("Expected a literal integer.");
        }
        output += "Exiting <int_lit>\n";
        console.log("Exiting <int_lit> " + nextToken);
    }

    return output;
}