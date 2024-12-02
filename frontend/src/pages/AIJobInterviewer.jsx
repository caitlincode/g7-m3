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

  // Start the interview
  const startInterview = async () => {
    if (!role.trim()) {
      alert("Please specify a role to start the interview.");
      return;
    }
    setInterviewStarted(true);

    try {
      const response = await fetch("http://localhost:5000/start-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await response.json();
      setCurrentQuestion(data.question);
    } catch (err) {
      console.error("Error starting interview:", err);
      setError("Failed to start the interview.");
    }
  };

  // Handle user responses and generate the next question
  const handleResponse = async (userResponse) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/next-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, userResponse }),
      });
      const data = await response.json();
      setResponses([
        ...responses,
        { question: currentQuestion, answer: userResponse },
      ]);
      setCurrentQuestion(data.question);
    } catch (err) {
      console.error("Error generating next question:", err);
      setError("Failed to generate the next question.");
    } finally {
      setLoading(false);
    }
  };

  // End the interview and generate feedback
  const endInterview = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/end-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, responses }),
      });
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
