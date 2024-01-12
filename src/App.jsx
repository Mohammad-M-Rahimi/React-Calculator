import React, { useReducer } from "react";
import "./style/CalculStyle.css";
import ButtonHandle from "./Handler/ButtonHandle";
import OperationHandle from "./Handler/OperationHandle";
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operaiton",
  DELETE_DIGIT: "delete-digit",
  CLEAR: "clear",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (
        payload.digit === "." &&
        state.currentOperand &&
        state.currentOperand.includes(".")
      ) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation,
      };

    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "÷":
      computation = prev / current;
      break;
    case "*":
      computation = prev * current;
      break;
  }
  return computation.toString();
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <>
      <div className="calculator-grid">
        <div className="output">
          {/* showing the last operated numbers */}
          <div className="previous-operand">
            {previousOperand}
            {operation}
          </div>
          {/* showing the current operated numbers */}
          <div className="current-operand">{currentOperand}</div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <ButtonHandle digit="1" dispatch={dispatch} />
        <ButtonHandle digit="2" dispatch={dispatch} />
        <ButtonHandle digit="3" dispatch={dispatch} />
        <ButtonHandle digit="4" dispatch={dispatch} />
        <ButtonHandle digit="5" dispatch={dispatch} />
        <ButtonHandle digit="6" dispatch={dispatch} />
        <ButtonHandle digit="7" dispatch={dispatch} />
        <ButtonHandle digit="8" dispatch={dispatch} />
        <ButtonHandle digit="9" dispatch={dispatch} />
        <ButtonHandle digit="0" dispatch={dispatch} />
        <ButtonHandle digit="." dispatch={dispatch} />
        <OperationHandle operation="÷" dispatch={dispatch} />
        <OperationHandle operation="+" dispatch={dispatch} />
        <OperationHandle operation="-" dispatch={dispatch} />
        <OperationHandle operation="*" dispatch={dispatch} />
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
          C{" "}
        </button>
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </>
  );
}

export default App;
