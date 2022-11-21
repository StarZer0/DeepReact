import "./App.css";
import { useState } from "react";

export default function App() {
  const [word, setWord] = useState("world");
  const handleClick = () => {
    setWord(word === "world" ? "word" : "world");
  };
  return <div onClick={handleClick}>Hello {word}!</div>;
}
