import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

  // Initialize Google Generative AI
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBC16h2iWOSrNSRWgkezrOo6ayTwZuDH7s"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Start the interview
  const startInterview = () => {
    if (!role.trim()) {
      alert("Please specify a role to start the interview.");
      return;
    }
    setInterviewStarted(true);
  };

  // Handle user responses and generate the next question
  const handleResponse = async (userResponse) => {
    setLoading(true);
    setError(null);

    try {
      const prompt = `       
      Act as a job interviewer for the role of ${role}. 
        Based on the user's response "${userResponse}", generate the next interview question. 
        Do not repeat the same question and avoid hardcoded questions. Focus on job-specific skills, experiences, and scenarios.
        Make sure to move on from each topic within one question.
        `;

      const result = await model.generateContent(prompt);

      // Save the user's response and display the next question
      setResponses([
        ...responses,
        { question: currentQuestion, answer: userResponse },
      ]);
      setCurrentQuestion(result.response.text());
    } catch (err) {
      console.error("Error generating next question:", err);
      setError("Failed to generate the next question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // End the interview and generate feedback
  const endInterview = async () => {
    setLoading(true);
    setError(null);

    try {
      const allResponses = responses
        .map((r) => `Question: ${r.question}\nAnswer: ${r.answer}`)
        .join("\n");

      const feedbackPrompt = `
        Act as a job interviewer for the role of ${role}.
        Here are the user's responses:\n${allResponses}.
        Provide feedback on how well the user answered the questions and suggest how they can improve their responses.
      `;

      const result = await model.generateContent(feedbackPrompt);
      setFeedback(result.response.text());
    } catch (err) {
      console.error("Error generating feedback:", err);
      setError("Failed to generate feedback. Please try again.");
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
                e.target.value = ""; // Clear the input
              }
            }}
          ></textarea>

          <button
            onClick={() => endInterview()}
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
