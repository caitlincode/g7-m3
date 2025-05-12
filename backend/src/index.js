const express = require("express");
const cors = require("cors");
const interviewerRoutes = require("./routes/interviewerRoutes");
require("dotenv").config();

const app = express();

// define routes
const apiRouter = express.Router();

apiRouter.use(interviewerRoutes);

// middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/interviewer", interviewerRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
