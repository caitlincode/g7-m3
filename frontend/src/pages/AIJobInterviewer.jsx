import { useState } from "react";

const AIJobInterviewer = () => {
  const [role, setRole] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(
    "Tell me about yourself."
  );
  const [responses, setResponses] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startInterview = async () => {
    if (!role.trim()) {
      alert("Please specify a role to start the interview.");
      return;
    }
    setInterviewStarted(true);

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
      setError("Failed to start the interview.");
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
        throw new Error("Failed to generate the next question.");
      }

      const data = await response.json();

      // Check if the backend indicates that the interview has ended
      if (!data.question) {
        setFeedback("Interview complete. Thank you for your responses!");
        setInterviewStarted(false);
      } else {
        setResponses([
          ...responses,
          { question: currentQuestion, answer: userResponse },
        ]);
        setCurrentQuestion(data.question);
      }
    } catch (err) {
      console.error("Error generating next question:", err);
      setError("Failed to generate the next question.");
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
    } catch (err) {
      console.error("Error generating feedback:", err);
      setError("Failed to generate feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>AI Job Interviewer</h1>

      {!interviewStarted ? (
        <div>
          <label>
            Enter the Job Role:{" "}
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ padding: "5px", marginRight: "10px" }}
            />
          </label>
          <button onClick={startInterview} style={{ padding: "10px 20px" }}>
            Start Interview
          </button>
        </div>
      ) : feedback ? (
        <div>
          <h2>Feedback:</h2>
          <p>{feedback}</p>
        </div>
      ) : (
        <div>
          <h2>Interviewer:</h2>
          <p>{currentQuestion}</p>
          <textarea
            rows="4"
            cols="50"
            placeholder="Type your response here..."
            style={{ display: "block", margin: "10px 0", padding: "10px" }}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleResponse(e.target.value);
                e.target.value = "";
              }
            }}
          ></textarea>

          <button
            onClick={endInterview}
            style={{ padding: "10px 20px", marginTop: "10px" }}
            disabled={loading}
          >
            Finish Interview
          </button>

          <button
            onClick={() => handleResponse("")}
            style={{ padding: "10px 20px", marginTop: "10px" }}
            disabled={loading}
          >
            Next Question
          </button>
        </div>
      )}

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AIJobInterviewer;
