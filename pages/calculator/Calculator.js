class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parsedInput: [],
            input: "0",
            history: [[0, 0]],
            inverse: false,
        };

        document.addEventListener("keypress", (source, event) => {
            let inputArea = document.getElementById("inputArea");
            if (document.activeElement != inputArea) {
                inputArea.focus();
                setTimeout(() => {
                    inputArea.setSelectionRange(inputArea.value.length, inputArea.value.length);
                });
            }
        });
    }

    #countOccurences(char, input = this.state.input) {
        let count = 0;

        for (let i = 0; i < input.length; i++) {
            if (input[i] == char) {
                count++;
            }
        }

        return count;
    }

    #allClear() {
        if (this.state.input.length > 1) {
            this.setState({
                input: this.state.input.substring(0, this.state.input.length - 2)
            });
        } else {
            this.setState({
                input: "0"
            });
        }
    };

    #updateInput(input) {
        let formatted = this.props.formatter.Format(this.state.input + input);
        document.getElementById("inputArea").innerText = formatted;

        this.setState({
            input: formatted
        });

        return true;
    };

    #evaluateInput() {
        let input = this.state.input;
        let openCount = this.#countOccurences("(");
        let closedCount = this.#countOccurences(")");
        while (openCount > closedCount) {
            input += ")";
            closedCount++;
        }

        input = input.replace("Ans", this.state.history[this.state.history.length - 1][1]);
        input = input.replace("Rnd", Math.random());
        let output = this.props.evaluator.Evaluate(this.props.parser.Parse(input));
        output = output.toString();
        this.setState({
            history: [...this.state.history, [input, output]],
            input: output,
        });
        document.getElementById("inputArea").innerText = output;
        setTimeout(() => {
            let history = document.getElementById("history");
            history.scrollTop = history.scrollHeight;
        }, 1);

        return output;
    };

    #inputKeyUp(event) {
        event.preventDefault();
        var sel = window.getSelection();
        var range = sel.getRangeAt(0);
        let selStart = range.startOffset;
        let selEnd = range.endOffset;
        event.target.innerHTML = event.target.innerHTML.replace("<br>", "");
        let text = event.target.innerText;

        if (text === undefined) {
            text = "";
        }

        if (event.key === "Enter") {
            this.setState({
                input: text,
            });

            event.target.innerText = this.#evaluateInput();
            range.setStart(event.target.firstChild, event.target.innerText.length);
            return;

        } else if (event.key === "Backspace" || event.key === "Delete") {
            if (text.length == 0) {
                this.setState({ input: "0" });
                event.target.innerText = "0";
                range.setStart(event.target.firstChild, event.target.innerText.length);
                return;
            }
        }

        let formatted = this.props.formatter.Format(text);
        let difference = text.length - formatted.length;
        this.setState({ input: formatted });
        event.target.innerText = formatted;

        if (selStart - difference > 0)
            range.setStart(event.target.firstChild, selStart - difference);
    }

    render() {
        let openCount = this.#countOccurences("(");
        let closedCount = this.#countOccurences(")");

        return (
            <div>
                <div className="gridContainer" id="calcGridContainer">
                    <div id="history">
                        {this.state.history.map((x) => (
                            <div key={'historyState' + this.state.history.indexOf(x)}>
                                {x[0]} = {x[1]}
                            </div>
                        ))}
                    </div>
                    <div id="inputWindow" onClick={() => document.getElementById("inputArea").focus()}
                    >
                        <span type="text"
                            id="inputArea"
                            contentEditable="true"
                            suppressContentEditableWarning="true"
                            onKeyUp={(event) => this.#inputKeyUp(event)}
                        >
                            0
                        </span>
                        <span style={{ color: "LightGrey" }}>
                            {openCount > closedCount ? ")" : ""}
                        </span>
                    </div>
                    <ButtonSection
                        inputHandler={(input) => this.#updateInput(input)}
                        inverse={this.state.inverse}
                        inverseHandler={() => { this.setState({ inverse: !this.state.inverse } )}}
                        clearHandler={() => this.#allClear()}
                        evaluateHandler={() => this.#evaluateInput()}
                    />
                </div>
            </div>
        );
    }
}