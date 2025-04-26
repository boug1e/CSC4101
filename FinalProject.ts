enum tokens_types {
    PROGRAM, END_PROGRAM, STMTS, STMT, VAR, EXPR, CONDITION, IF, LOGIC_EXPR, END_IF, BINARY_EXPR, LOOP, 
    END_LOOP, IDENT, INT_LIT, ASSIGN, SEMICOLON, LPAREN, RPAREN, PLUS, 
    MINUS, MULT, DIV, EQUAL, NOT_EQUAL, LESS, GREATER, LESS_EQUAL, 
    GREATER_EQUAL, AND, OR, COMMENT, MOD, COLON
}

function tokenize(input: string): string[] {

    const tokens: string[] = [];
    const isLetter = (char: string): boolean => /[a-zA-Z_]/.test(char);
    const isDigit = (char: string): boolean => /[0-9]/.test(char);
    const isLogical = (char: string): boolean => /[><=!&|]/.test(char);
    const isComment = (char: string): boolean => /[/]/.test(char);
    

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
                tokens.push(tokens_types[tokens_types.PROGRAM]);
            } else if (ident === "end_program") {
                tokens.push(tokens_types[tokens_types.END_PROGRAM]);
            } else if (ident === "if") {
                tokens.push(tokens_types[tokens_types.IF]);
            } else if (ident === "end_if") {
                tokens.push(tokens_types[tokens_types.END_IF]);
            } else if (ident === "loop") {
                tokens.push(tokens_types[tokens_types.LOOP]);
            } else if (ident === "end_loop") {
                tokens.push(tokens_types[tokens_types.END_LOOP]);
            } else {
                tokens.push(tokens_types[tokens_types.IDENT]);
            }  
            console.log(ident);
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
            console.log(number);
            tokens.push(tokens_types[tokens_types.INT_LIT]);
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
                            case ">=": tokens.push(tokens_types[tokens_types.GREATER_EQUAL]); break;
                            case "<=": tokens.push(tokens_types[tokens_types.LESS_EQUAL]); break;
                            case "!=": tokens.push(tokens_types[tokens_types.NOT_EQUAL]); break;
                            case "&&": tokens.push(tokens_types[tokens_types.AND]); break;
                            case "||": tokens.push(tokens_types[tokens_types.OR]); break;
                            case "==": tokens.push(tokens_types[tokens_types.EQUAL]); break;
                            default: throw new Error(`Unexpected character: ${char}`);
                        }
                    }
                    char = input[i];
                }
                if (logical.length === 1) {
                    if (logical === ">") {
                        tokens.push(tokens_types[tokens_types.GREATER]);
                    } else if (logical === "<") {
                        tokens.push(tokens_types[tokens_types.LESS]);
                    } else if (logical === "=") {
                        tokens.push(tokens_types[tokens_types.ASSIGN]);
                    }
                }
            console.log(logical);
            continue;
        }

        // if (isComment(char) && isComment(input[i+1])) {
        //     while (i < input.length && input[i] !== "\n") {
        //         i++;
        //         // console.log(input[i]);
        //     }
        //     tokens.push(tokens_types[tokens_types.COMMENT]);
        //     // continue;
        // } else {
        //     tokens.push(tokens_types[tokens_types.DIV]);
        //     // throw new Error(`Comments must be //: ${char}`);
        // }

        switch (char) {
            case "(": tokens.push(tokens_types[tokens_types.LPAREN]); break;
            case ")": tokens.push(tokens_types[tokens_types.RPAREN]); break;
            case ";": tokens.push(tokens_types[tokens_types.SEMICOLON]); break;
            case "+": tokens.push(tokens_types[tokens_types.PLUS]); break;
            case "-": tokens.push(tokens_types[tokens_types.MINUS]); break;
            case "*": tokens.push(tokens_types[tokens_types.MULT]); break;
            case "%": tokens.push(tokens_types[tokens_types.MOD]); break;
            case ":": tokens.push(tokens_types[tokens_types.COLON]); break;
            case "/": 
                if (input[i+1] === "/") {
                    while (i < input.length && input[i] !== "\n") {
                        i++;
                        // console.log(input[i]);
                    }
                    tokens.push(tokens_types[tokens_types.COMMENT]);
                } else {
                    tokens.push(tokens_types[tokens_types.DIV]);
                }
                break;
            default: throw new Error(`Unexpected character: ${char}`);
        }
        console.log(char);
        i++;
    }
    return tokens;
}

console.log(tokenize(`
program 
value = 32;
mod1 = 45;
//Calculating performance
z = mod1 / value * (value % 7) + mod1;
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
end_program`));
