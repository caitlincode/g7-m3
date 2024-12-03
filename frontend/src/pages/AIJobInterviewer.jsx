import { useState, useRef } from "react";
import "./AIJobInterviewer.css";

const AIJobInterviewer = () => {
  const [role, setRole] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [responses, setResponses] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const responseInputRef = useRef(null);

  const startInterview = async () => {
    if (!role.trim()) {
      alert("Please specify a role to start the interview.");
      return;
    }
    setInterviewStarted(true);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/start-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error("Failed to start the interview.");
      }

      const data = await response.json();
      setCurrentQuestion(data.question);
    } catch (err) {
      console.error("Error starting interview:", err);
      setError("Failed to start the interview. Please try again.");
      setInterviewStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (userResponse) => {
    if (!userResponse.trim()) {
      alert("Please provide a valid response.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/next-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, userResponse }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the next question.");
      }

      const data = await response.json();

      if (data.question === "Interview complete. Thank you!") {
        setFeedback(data.feedback || "Interview complete. Thank you for your responses!");
        setInterviewStarted(false);
      } else {
        setResponses([
          ...responses,
          { question: currentQuestion, answer: userResponse },
        ]);
        setCurrentQuestion(data.question);

        // Clear input field
        if (responseInputRef.current) {
          responseInputRef.current.value = "";
        }
      }
    } catch (err) {
      console.error("Error fetching the next question:", err);
      setError("Failed to fetch the next question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/end-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, responses }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate feedback.");
      }

      const data = await response.json();
      setFeedback(data.feedback);
      setInterviewStarted(false);
    } catch (err) {
      console.error("Error ending the interview:", err);
      setError("Failed to generate feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interviewer-container">
      <header className="interviewer-header">
        <img
          src="src/assets/images/interview.png"
          alt="AI Interviewer Logo"
          className="interviewer-logo"
        />
        <h1>AI Job Interviewer</h1>
      </header>

      {!interviewStarted ? (
        <div className="interview-start">
          <h2>Welcome</h2><br></br>
          <p>Prepare for your next job interview with AI assistance.</p>
          <label className="role-input-label">
            Enter the Job Role:
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="role-input"
            />
          </label>
          <button
            className="start-button"
            onClick={startInterview}
            disabled={loading}
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </div>
      ) : feedback ? (
        <div className="feedback-section">
          <h2>Feedback</h2>
          <p>{feedback}</p>
        </div>
      ) : (
        <div className="interview-session">
          <h2>Interviewer</h2>
          <p className="question">{currentQuestion}</p>
          <textarea
            ref={responseInputRef}
            className="response-input"
            placeholder="Type your response here..."
            disabled={loading}
          ></textarea>
          <button
            className="next-button"
            onClick={() => handleResponse(responseInputRef.current.value)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Next Question"}
          </button>
          <button
            className="finish-button"
            onClick={endInterview}
            disabled={loading}
          >
            Finish Interview
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AIJobInterviewer;
