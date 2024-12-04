import { useState, useRef } from "react"; 
import "./AIJobInterviewer.css";

const AIJobInterviewer = () => {
  // State variables for interview process
  const [role, setRole] = useState(""); // Job role input by user
  const [interviewStarted, setInterviewStarted] = useState(false); // Tracks if the interview has started
  const [currentQuestion, setCurrentQuestion] = useState(""); // Current interview question
  const [responses, setResponses] = useState([]); // Stores user responses to questions
  const [feedback, setFeedback] = useState(""); // Feedback after the interview ends
  const [loading, setLoading] = useState(false); // Loading state for API requests
  const [error, setError] = useState(null); // Error messages
  const [sessionId, setSessionId] = useState(null); // Session ID for the interview

  const responseInputRef = useRef(null); // Ref for the response input field

  // Function to start the interview
  const startInterview = async () => {
    if (!role.trim()) {
      alert("Please specify a role to start the interview.");
      return;
    }

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
      setSessionId(data.sessionId);
      setCurrentQuestion(data.question);
      setInterviewStarted(true);
    } catch (err) {
      console.error("Error starting interview:", err);
      setError("Failed to start the interview.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user's response to a question
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
        body: JSON.stringify({ sessionId, userResponse }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the next question.");
      }

      const data = await response.json();

      if (data.complete) {
        await endInterview(); // Automatically end interview if complete
      } else {
        setResponses([
          ...responses,
          { question: currentQuestion, answer: userResponse },
        ]);
        setCurrentQuestion(data.question);

        if (responseInputRef.current) {
          responseInputRef.current.value = ""; // Clear input field
        }
      }
    } catch (err) {
      console.error("Error fetching the next question:", err);
      setError("Failed to fetch the next question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to end the interview and get feedback
  const endInterview = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/end-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, responses }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate feedback.");
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (err) {
      console.error("Error ending the interview:", err);
      setError("Failed to generate feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interviewer-container">
      {/* Header Section */}
      <header className="interviewer-header">
        <img
          src="src/assets/images/interview.png"
          alt="AI Interviewer Logo"
          className="interviewer-logo"
        />
        <h1>AI Job Interviewer</h1>
      </header>

      {/* Main Content */}
      {!interviewStarted && !feedback ? (
        <div className="role-selection">
          <label htmlFor="role" className="role-label">
            Enter the Job Role:
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="role-input"
            placeholder="e.g., Software Engineer"
          />
          <button
            onClick={startInterview}
            className="start-button"
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
          <div className="button-group">
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
        </div>
      )}

      {/* Error Message Display */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AIJobInterviewer;
