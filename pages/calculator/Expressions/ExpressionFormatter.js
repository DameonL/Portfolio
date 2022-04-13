class ExpressionFormatter {
    #isNumeric = null;
    #operators = [];
    #symbols = ["√", "%"]

    constructor(numericFunction, operators) {
        this.#isNumeric = numericFunction;
        this.#operators = operators;
    }

    #GetLastNumber = (input, startPosition) => {
        let lastNumber = "";
        for (let i = startPosition; i >= 0 && this.#isNumeric(input[i]); i--) {
            lastNumber = input[i] + lastNumber;
        }
        return lastNumber;
    };

    Format(input) {
        let formatted = "";
        for (let i = 0; i < input.length; i++) {
            let lastChar = input[i - 1];
            let currentChar = input[i];
            let nextChar = input[i + 1];
            let currentNumber = this.#GetLastNumber(input, i);
    
            if (currentChar == "." && lastChar == ".") continue;
    
            if ((currentChar == ".") && !this.#isNumeric(lastChar)) {
                formatted += "0" + currentChar;
                continue;
            }

            if (
                (!this.#isNumeric(lastChar)) &&
                (currentChar == "0") &&
                (nextChar != ".")
            )
                continue;
    
            if (lastChar == "√" && (!this.#isNumeric(currentChar) && currentChar != "(")) continue;
    
            if (currentChar == "%" && (!this.#isNumeric(lastChar) && currentChar != "(")) continue;

            if (currentChar == "(" && nextChar == ")") {
                i++;
                continue;
            }

            formatted += currentChar;
        }
    
        return formatted;
    };
}