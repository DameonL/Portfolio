class ButtonSection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="gridContainer">
                <div className="gridContainer" id="topButtonGridContainer">
                    <button onClick={() => this.props.inputHandler("Rad(")}>Rad</button>
                    <button onClick={() => this.props.inputHandler("Deg(")}>Deg</button>
                    <button onClick={() => this.props.inputHandler("!")}></button>
                    {["(", ")", "%"].map((x) => (
                        <button className="numberButton" key={x} onClick={() => this.props.inputHandler(x)}>
                            {x}
                        </button>
                    ))}
                    <button onClick={() => this.props.clearHandler()}>AC</button>
                </div>
                <div className="gridContainer" id="leftButtonGridContainer">
                    <button onClick={() => this.props.inverseHandler()}>Inv</button>

                    {
                        (!this.props.inverse)
                            ? <button onClick={() => this.props.inputHandler("sin(")}>sin</button>
                            : <button onClick={() => this.props.inputHandler("arcsin(")}>sin<sup>-1</sup></button>
                    }
                    
                    {
                        (!this.props.inverse)
                            ? <button onClick={() => this.props.inputHandler("ln(")}>ln</button>
                            : <button onClick={() => this.props.inputHandler("e^")}>e<sup>x</sup></button>
                    }

                    <button onClick={() => this.props.inputHandler("π")}>π</button>

                    {
                        (!this.props.inverse)
                            ? <button onClick={() => this.props.inputHandler("cos(")}>cos</button>
                            : <button onClick={() => this.props.inputHandler("arccos(")}>cos<sup>-1</sup></button>
                    }

                    {
                        (!this.props.inverse)
                            ? <button onClick={() => this.props.inputHandler("log(")}>log</button>
                            : <button onClick={() => this.props.inputHandler("10^")}>10<sup>x</sup></button>
                    }

                    <button onClick={() => this.props.inputHandler("e")}>e</button>

                    {
                        (!this.props.inverse)
                            ? <button onClick={() => this.props.inputHandler("tan(")}>tan</button>
                            : <button onClick={() => this.props.inputHandler("arctan(")}>tan<sup>-1</sup></button>
                    }

                    <button onClick={() => this.props.inputHandler("√")}>√</button>

                    {
                        (!this.props.inverse)
                            ? <button onClick={() => this.props.inputHandler("Ans")}>Ans</button>
                            : <button onClick={() => this.props.inputHandler("Rnd")}>Rnd</button>
                    }

                    <button onClick={() => this.props.inputHandler("e")}>EXP</button>
                    <button onClick={() => this.props.inputHandler("^")}>
                        X<sup>y</sup>
                    </button>
                </div>
                <div className="gridContainer" id="numberButtonGridContainer">
                    {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0, "."].map((x) => (
                        <button className="numberButton" key={x} onClick={() => this.props.inputHandler(x)}>
                            {x}
                        </button>
                    ))}
                    <button onClick={() => this.props.evaluateHandler()}>=</button>
                </div>
                <div className="gridContainer" id="rightButtonGridContainer">
                    <button onClick={() => this.props.inputHandler("/")}>/</button>
                    <button onClick={() => this.props.inputHandler("*")}>*</button>
                    <button onClick={() => this.props.inputHandler("-")}>-</button>
                    <button onClick={() => this.props.inputHandler("+")}>+</button>
                </div>
            </div>
        );
    }
}