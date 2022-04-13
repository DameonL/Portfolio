class MathFunction {
    callback = null;
    innerExpression = null;

    constructor(callback, innerExpression) {
        this.callback = callback;
        this.innerExpression = innerExpression;
    }

    Evaluate() {
        return this.callback(this.innerExpression);
    }
}