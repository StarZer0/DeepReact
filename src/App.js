import "./App.css";
import { createContext, useContext } from "react";

const ColorContext = createContext({ color: "red" });

function Color(props) {
  return (
    <ColorContext.Provider value={{ color: "red" }}>
      {props.children}
    </ColorContext.Provider>
  );
}

function ShowContext() {
  const { color } = useContext(ColorContext);
  return <div style={{ color }}>字体颜色</div>;
}

function ToggleButtons() {
  return (
    <>
      <button>红色</button>
      <button>黑色</button>
    </>
  );
}

export default function App() {
  return (
    <>
      <Color>
        <ShowContext></ShowContext>
      </Color>
    </>
  );
}
