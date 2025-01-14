const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");

// import routes
const interviewerRoutes = require("./routes/interviewerRoutes");

const app = express();
const PORT = process.env.PORT;

// define routes
const apiRouter = express.Router();
apiRouter.use(interviewerRoutes);

// middleware
app.use(cors());
app.use(express.json());

// test endpoint
app.get("/", (req, res) => {
  res.send("AI Job Interviewer API - Server test successful");
});

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
