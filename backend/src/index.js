// imports
const express = require("express");

// example:     const API1Route = require("./routes/API1Route");

// init router
const apiRouter = express.Router();

apiRouter.get("/test", (req, res) => {
  res.send("/api/test route loaded successfully");
});

// add route(s) to API here after importing
// apiRouter.use("#e.g. API1Route");

// init server
const app = express();

// middleware
app.use(express.json());

// rest api - every endpoint will start with /api
app.use("/api", apiRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
