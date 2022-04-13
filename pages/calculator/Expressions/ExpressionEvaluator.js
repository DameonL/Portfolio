class ExpressionEvaluator {
    #operators = [];

    constructor(operators) {
        this.#operators = operators;
    }

    Evaluate(statement) {
        for (let i = 0; i < statement.length; i++) {
            if (Array.isArray(statement[i])) {
                statement[i] = this.Evaluate(statement[i]);
            }
        }

        let operators = [];
        for (let i = 0; i < statement.length; i++) {
            if (statement[i] instanceof Function) {
                operators.push({
                    index: i,
                    operation: statement[i]
                });
            } else if (statement[i] instanceof MathFunction) {
                statement[i].innerExpression = this.Evaluate(statement[i].innerExpression);
                statement[i] = statement[i].Evaluate();
            }
        }

        operators.sort((a, b) => {
            let getPriority = (item) => {
                for (let i = 0; i < this.#operators.length; i++) {
                    if (this.#operators[i].includes(item.operation)) {
                        return i;
                    }
                }
            };

            let aPriority = getPriority(a);
            let bPriority = getPriority(b);
            if (aPriority < bPriority) {
                return -1;
            } else if (aPriority > bPriority) {
                return 1;
            } else if (aPriority == bPriority) {
                return a.index < b.index ? -1 : 1;
            }
        });

        let output = 0;
        for (let i = 0; i < operators.length; i++) {
            let index = statement.indexOf(operators[i].operation);
            let leftStart = index - 1;
            let left = statement[leftStart];
            let rightStart = index + 1;
            let right = statement[rightStart];
            output = operators[i].operation(left, right);
            statement.splice(leftStart, 3, output);
        }

        return statement;
    };
}