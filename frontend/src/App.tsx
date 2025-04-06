import { useState } from "react";
import "./App.css";
import RecommendationPage from "./RecommendationPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <RecommendationPage />
    </>
  );
}

export default App;
