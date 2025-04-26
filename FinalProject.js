var tokens_types;
(function (tokens_types) {
    tokens_types[tokens_types["PROGRAM"] = 0] = "PROGRAM";
    tokens_types[tokens_types["END_PROGRAM"] = 1] = "END_PROGRAM";
    tokens_types[tokens_types["STMTS"] = 2] = "STMTS";
    tokens_types[tokens_types["STMT"] = 3] = "STMT";
    tokens_types[tokens_types["VAR"] = 4] = "VAR";
    tokens_types[tokens_types["EXPR"] = 5] = "EXPR";
    tokens_types[tokens_types["CONDITION"] = 6] = "CONDITION";
    tokens_types[tokens_types["IF"] = 7] = "IF";
    tokens_types[tokens_types["LOGIC_EXPR"] = 8] = "LOGIC_EXPR";
    tokens_types[tokens_types["END_IF"] = 9] = "END_IF";
    tokens_types[tokens_types["BINARY_EXPR"] = 10] = "BINARY_EXPR";
    tokens_types[tokens_types["LOOP"] = 11] = "LOOP";
    tokens_types[tokens_types["END_LOOP"] = 12] = "END_LOOP";
    tokens_types[tokens_types["IDENT"] = 13] = "IDENT";
    tokens_types[tokens_types["INT_LIT"] = 14] = "INT_LIT";
    tokens_types[tokens_types["ASSIGN"] = 15] = "ASSIGN";
    tokens_types[tokens_types["SEMICOLON"] = 16] = "SEMICOLON";
    tokens_types[tokens_types["LPAREN"] = 17] = "LPAREN";
    tokens_types[tokens_types["RPAREN"] = 18] = "RPAREN";
    tokens_types[tokens_types["PLUS"] = 19] = "PLUS";
    tokens_types[tokens_types["MINUS"] = 20] = "MINUS";
    tokens_types[tokens_types["MULT"] = 21] = "MULT";
    tokens_types[tokens_types["DIV"] = 22] = "DIV";
    tokens_types[tokens_types["EQUAL"] = 23] = "EQUAL";
    tokens_types[tokens_types["NOT_EQUAL"] = 24] = "NOT_EQUAL";
    tokens_types[tokens_types["LESS"] = 25] = "LESS";
    tokens_types[tokens_types["GREATER"] = 26] = "GREATER";
    tokens_types[tokens_types["LESS_EQUAL"] = 27] = "LESS_EQUAL";
    tokens_types[tokens_types["GREATER_EQUAL"] = 28] = "GREATER_EQUAL";
    tokens_types[tokens_types["AND"] = 29] = "AND";
    tokens_types[tokens_types["OR"] = 30] = "OR";
})(tokens_types || (tokens_types = {}));
function tokenize(input) {
    var tokens = [];
    var isLetter = function (char) { return /[a-zA-Z]/.test(char); };
    var isDigit = function (char) { return /[0-9]/.test(char); };
    var i = 0;
    while (i < input.length) {
        var char = input[i];
        if (char === " ") {
            i++;
            continue;
        }
        if (isLetter(char)) {
            var ident = "";
            while (i < input.length && isLetter(char)) {
                ident += char;
                i++;
                if (i < input.length) {
                    char = input[i];
                }
            }
            if (ident === "PROGRAM") {
                tokens.push(tokens_types[tokens_types.PROGRAM]);
            }
            else if (ident === "END_PROGRAM") {
                tokens.push(tokens_types[tokens_types.END_PROGRAM]);
            }
            else {
                tokens.push(tokens_types[tokens_types.IDENT]);
            }
            console.log(ident);
            continue;
        }
        if (isDigit(char)) {
            var number = "";
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
        switch (char) {
            case "(":
                tokens.push(tokens_types[tokens_types.LPAREN]);
                break;
            case ")":
                tokens.push(tokens_types[tokens_types.RPAREN]);
                break;
            case ";":
                tokens.push(tokens_types[tokens_types.SEMICOLON]);
                break;
            case "+":
                tokens.push(tokens_types[tokens_types.PLUS]);
                break;
            case "-":
                tokens.push(tokens_types[tokens_types.MINUS]);
                break;
            case "*":
                tokens.push(tokens_types[tokens_types.MULT]);
                break;
            case "/":
                tokens.push(tokens_types[tokens_types.DIV]);
                break;
            case "=":
                tokens.push(tokens_types[tokens_types.EQUAL]);
                break;
            case "!=":
                tokens.push(tokens_types[tokens_types.NOT_EQUAL]);
                break;
            case "<":
                tokens.push(tokens_types[tokens_types.LESS]);
                break;
            case ">":
                tokens.push(tokens_types[tokens_types.GREATER]);
                break;
            case "<=":
                tokens.push(tokens_types[tokens_types.LESS_EQUAL]);
                break;
            case ">=":
                tokens.push(tokens_types[tokens_types.GREATER_EQUAL]);
                break;
            case "&&":
                tokens.push(tokens_types[tokens_types.AND]);
                break;
            case "||":
                tokens.push(tokens_types[tokens_types.OR]);
                break;
            default: throw new Error("Unexpected character: ".concat(char));
        }
        console.log(char);
        i++;
    }
    return tokens;
}
console.log(tokenize("program a = 32; end_program"));
// console.log("Hello world");
