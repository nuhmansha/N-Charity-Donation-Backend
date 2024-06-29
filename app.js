const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const dbConnection = require("./config/dbconnection");
const authRouter = require("./router/authRouter");

const app = express();
const port = process.env.PORT || 3002;

// Middleware to parse JSON and URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", authRouter);

// Connect to the database and start the server
dbConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
