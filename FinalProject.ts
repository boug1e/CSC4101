const tokens_types = {
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


export function lexer(input: string): string[] {

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
                tokens.push(tokens_types.PROGRAM);
            } else if (ident === "end_program") {
                tokens.push(tokens_types.END_PROGRAM);
            } else if (ident === "if") {
                tokens.push(tokens_types.IF);
            } else if (ident === "end_if") {
                tokens.push(tokens_types.END_IF);
            } else if (ident === "loop") {
                tokens.push(tokens_types.LOOP);
            } else if (ident === "end_loop") {
                tokens.push(tokens_types.END_LOOP);
            } else {
                tokens.push(tokens_types.IDENT);
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
            tokens.push(tokens_types.INT_LIT);
            continue;
        }

        if (isLogical(char)) {
            let logical : string = "";
            while (i < input.length && isLogical(char)) {
                logical += char;
                i++;
                if (i < input.length)
                    if (logical.length > 1) {
                        switch (logical) {
                            case ">=": tokens.push(tokens_types.GREATER_EQUAL); break;
                            case "<=": tokens.push(tokens_types.LESS_EQUAL); break;
                            case "!=": tokens.push(tokens_types.NOT_EQUAL); break;
                            case "&&": tokens.push(tokens_types.AND); break;
                            case "||": tokens.push(tokens_types.OR); break;
                            case "==": tokens.push(tokens_types.EQUAL); break;
                            default: throw new Error(`Unexpected character: ${char}`);
                        }
                    }
                    char = input[i];
                }
                if (logical.length === 1) {
                    if (logical === ">") {
                        tokens.push(tokens_types.GREATER);
                    } else if (logical === "<") {
                        tokens.push(tokens_types.LESS);
                    } else if (logical === "=") {
                        tokens.push(tokens_types.ASSIGN);
                    }
                }
            // console.log(logical);
            continue;
        }

        switch (char) {
            case "(": tokens.push(tokens_types.LPAREN); break;
            case ")": tokens.push(tokens_types.RPAREN); break;
            case ";": tokens.push(tokens_types.SEMICOLON); break;
            case "+": tokens.push(tokens_types.PLUS); break;
            case "-": tokens.push(tokens_types.MINUS); break;
            case "*": tokens.push(tokens_types.MULT); break;
            case "%": tokens.push(tokens_types.MOD); break;
            case ":": tokens.push(tokens_types.COLON); break;
            case "/": 
                if (input[i+1] === "/") {
                    while (i < input.length && input[i] !== "\n") {
                        i++;
                    }
                } else {
                    tokens.push(tokens_types.DIV);
                }
                break;
            default: throw new Error(`Unexpected character: ${char}`);
        }
        // console.log(char);
        i++;
    }
    return tokens;
}

const tokens: string[] = lexer(`
program 
value = 32;
mod1 = 45;
//Calculating performance
z = mod1 / (value * (value % 7) + mod1);
loop (i = 0 : value)
z = z + mod1;
end_loop
if (z >= 50 && value <= 60)
newValue = 50 / mod1;
x = mod1;
if (y < 5)
y = x + 5;
end_if
end_if
end_program`);


console.log(tokens);

var token_index: number = 0;
var nextToken: string;
export function lex(): string {
    token_index++;
    nextToken = tokens[token_index];
    return nextToken;
}

export function parser(): void {
    nextToken = tokens[0];
    program();
    function program(): void {
        console.log("Enter <program>" + " " + nextToken);
        if (nextToken === tokens_types.PROGRAM) {
            lex();
            stmts();
            if (nextToken === tokens_types.END_PROGRAM) {
                lex();
            } else {
                throw new Error ("Program must end with end_program");
            }
        } else {
            throw new Error ("Program must begin with program");
        } 
        console.log("Exit <program>" + " " + nextToken);
    }

    function stmts(): void {
        console.log("Enter <stmts>" + " " + nextToken);
        stmt();
        if (nextToken === tokens_types.SEMICOLON) {
            lex();
            if (nextToken !== tokens_types.END_PROGRAM) {
                stmts();
            }
        } else if (nextToken === tokens_types.END_IF || nextToken === tokens_types.END_LOOP) {
            // Don't consume END_IF or END_LOOP - let condition() and loop() handle these
            console.log("Exit <stmts>" + " " + nextToken);
            return;
        } else if (nextToken === tokens_types.END_PROGRAM) {
            // Don't consume END_PROGRAM - let program() handle it
            console.log("Exit <stmts>" + " " + nextToken);
            return;
        } else {
            throw new Error ("Missing semicolon ';' after statement.");
        }
        console.log("Exit <stmts>" + " " + nextToken);
    }

    function stmt(): void { 
        console.log("Enter <stmt>" + " " + nextToken);
        if (nextToken === tokens_types.END_IF || nextToken === tokens_types.END_LOOP || nextToken === tokens_types.END_PROGRAM) {
            // Don't process END_IF, END_LOOP, or END_PROGRAM as regular statements
            console.log("Exiting <stmt>" + " " + nextToken);
            return;
        } else if (nextToken === tokens_types.IF) {
            lex();
            condition();
        } else if (nextToken === tokens_types.LOOP) {
            lex();
            loop();
        } else if (nextToken === tokens_types.IDENT) {    
            variable();
            if (nextToken === tokens_types.ASSIGN) {
                lex();
                expr();
            } else {
                throw new Error ("Expected assign declaration '='.");
            }
        } else {
            throw new Error("Unexpected token: " + nextToken);
        }
        console.log("Exiting <stmt>" + " " + nextToken);
    }

    function variable(): void {
        console.log("Enter <var>" + " " + nextToken);
        if (nextToken === tokens_types.IDENT) {
            lex();  
        } else {
            throw new Error ("Expected identifier in assignment");
        }
        console.log("Exiting <var>" + " " + nextToken);
    }

    function expr(): void {
        console.log("Entering <expr>" + " " + nextToken);
        term();
        if (nextToken === tokens_types.PLUS || nextToken === tokens_types.MINUS) {
            lex();
            term();
        }
        console.log("Exiting <expr>" + " " + nextToken);
    }

    function condition(): void {
        console.log("Entering <condition>" + " " + nextToken);
        if (nextToken === tokens_types.LPAREN) {
            lex();
            logic_expr();
            if (nextToken === tokens_types.RPAREN) {
                lex();
                stmts();
                if (nextToken === tokens_types.END_IF) {
                    lex();
                    // Continue parsing statements after the if block
                    if (nextToken !== tokens_types.END_PROGRAM && 
                        nextToken !== tokens_types.END_IF) {
                        stmts();
                    }
                } else {
                    throw new Error ("Expected 'END_IF' to end condition.");
                }
            } else {
                throw new Error ("Expected ')' after condition.");
            }
        } else {
            throw new Error ("Expected '(' before condition.");
        }
        console.log("Exiting <condition>" + " " + nextToken);
    }

    function loop(): void {
        console.log("Entering <loop>" + " " + nextToken);
        if (nextToken === tokens_types.LPAREN) {
            lex();
            loop_cond();
            if (nextToken === tokens_types.RPAREN) {
                lex();
                stmts();
                if (nextToken === tokens_types.END_LOOP) {
                    lex();
                    // Continue parsing statements after the loop
                    if (nextToken !== tokens_types.END_PROGRAM && 
                        nextToken !== tokens_types.END_IF) {
                        stmts();
                    }
                } else {
                    throw new Error ("Expected 'END_LOOP' to end loop.");
                }
            } else {
                throw new Error ("Expected ')' to close loop condition.");
            }
        } else {
            Error ("Expected '(' to open loop condition");
        }
        console.log("Exiting <loop>" + " " + nextToken);
    }

    function loop_cond(): void {
        console.log("Entering <loop_cond>" + " " + nextToken);
        variable();
        if (nextToken === tokens_types.ASSIGN) {
            lex();
            term();
            if (nextToken === tokens_types.COLON) {
                lex();
                term();
            } else {
                throw new Error ("Expected ':' for end condition.");
            }
        } else {
            throw new Error ("Expected assign operation '='.");
        }
        console.log("Exiting <loop_cond>" + " " + nextToken);
    }

    function logic_expr(): void {
        console.log("Entering <logic_exp>" + " " + nextToken);
        term();
        if (nextToken === tokens_types.EQUAL || nextToken === tokens_types.NOT_EQUAL || nextToken === tokens_types.GREATER_EQUAL || nextToken === tokens_types.LESS_EQUAL
            || nextToken === tokens_types.GREATER || nextToken === tokens_types.LESS) {
            lex();
            term();
            if (nextToken !== tokens_types.RPAREN) {
                bin_cond();
            }
        } else {
            throw new Error ("Expected conditional statement.");
        }
        console.log("Exiting <logic_exp>" + " " + nextToken);
    }

    function bin_cond() {
        console.log("Entering <bin_cond>" + " " + nextToken);
        if (nextToken === tokens_types.AND || nextToken === tokens_types.OR) {
            lex();
            logic_expr();
        } else {
            throw new Error ("Expected binary expression '&& or ||'.");
        }
        console.log("Exiting <bin_cond>" + " " + nextToken);
    }

    function term(): void {
        console.log("Entering <term>" + " " + nextToken);
        factor();
        if (nextToken === tokens_types.MULT || nextToken === tokens_types.DIV || nextToken === tokens_types.MOD) {
            lex();
            term();
        }
        console.log("Exiting <term>" + " " + nextToken);
    }

    function factor(): void {
        console.log("Entering <factor>" + " " + nextToken);
        if (nextToken === tokens_types.IDENT) {
            variable();
        } else if (nextToken === tokens_types.INT_LIT) {
            lit();
        } else if (nextToken === tokens_types.LPAREN) {
            lex();
            expr();
            if (nextToken === tokens_types.RPAREN) {
                lex();
            } else {
                throw new Error ("Expected ending parenthesis ')'.");
            }
        } else {
            throw new Error ("Expected variable | integer | (expr).");
        }
        console.log("Exiting <factor>" + " " + nextToken);
    }

    function lit(): void {
        console.log("Entering <int_lit>" + " " + nextToken);
        if (nextToken === tokens_types.INT_LIT) {
            lex();
        } else {
            throw new Error ("Expected a literal integer.");
        }
        console.log("Exiting <int_lit>" + " " + nextToken);
    }

}

parser();
