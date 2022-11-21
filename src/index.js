import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

console.log(`React version: ${React.version}`);

// debugger;
const root = ReactDOM.createRoot(document.getElementById("root"), {});
root.render(<App></App>);
