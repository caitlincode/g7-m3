const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");
// const dotenv = require("dotenv");
// dotenv.config();

const app = express();
const PORT = 3000; // will move to dotenv file

app.use(cors());

// Initialize Google Generative AI - API key will move
const genAI = new GoogleGenerativeAI("AIzaSyBC16h2iWOSrNSRWgkezrOo6ayTwZuDH7s");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("AI Job Interviewer API - Server test successful");
});

// Endpoint for starting the interview and generating the first question
app.post("/start-interview", (req, res) => {
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ error: "Role is required" });
  }
  const initialQuestion = "Tell me about yourself.";
  res.json({ question: initialQuestion });
});

// Endpoint for handling user responses and generating the next question
app.post("/next-question", async (req, res) => {
  const { role, userResponse } = req.body;

  if (!role || !userResponse) {
    return res
      .status(400)
      .json({ error: "Role and user response are required" });
  }

  try {
    const prompt = `
      Act as a job interviewer for the role of ${role}. 
      Based on the user's response "${userResponse}", generate the next interview question. 
      Do not repeat the same question and avoid hardcoded questions. 
      Focus on job-specific skills, experiences, and scenarios.
    `;

    const result = await model.generateContent(prompt);
    res.json({ question: result.response.text() });
  } catch (err) {
    console.error("Error generating next question:", err);
    res.status(500).json({ error: "Failed to generate the next question" });
  }
});

// Endpoint for ending the interview and generating feedback
app.post("/end-interview", async (req, res) => {
  const { role, responses } = req.body;

  if (!role || !responses || responses.length === 0) {
    return res.status(400).json({ error: "Role and responses are required" });
  }

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
    res.json({ feedback: result.response.text() });
  } catch (err) {
    console.error("Error generating feedback:", err);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
