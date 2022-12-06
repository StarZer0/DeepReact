import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from "./App";
// const App = () => <div>Hello World!</div>;

console.log(`React version: ${React.version}`);

const root = ReactDOM.createRoot(document.getElementById("root"), {});
const content = <div>Hello World!</div>;

root.render(content);
