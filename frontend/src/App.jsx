import "./App.css";
import { Routes, Route } from "react-router-dom";
import AIJobInterviewer from "./pages/AIJobInterviewer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AIJobInterviewer />} />
    </Routes>
  );
}

export default App;
