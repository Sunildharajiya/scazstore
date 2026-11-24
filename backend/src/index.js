import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { mongoConnect } from "./db/mongodb_connection.js";
import { mainRouter } from "./router/main.router.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/h", (_req, res) => {
  res.status(200).json({ success: true, message: "ScazStore API is running." });
});

app.use("/api", mainRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

const startServer = async () => {
  try {
    await mongoConnect();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`ScazStore API listening on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
