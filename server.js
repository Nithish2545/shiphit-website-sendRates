import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import vendor from "./routes/routes.js";
const app = express();
const PORT = process.env.PORT || 8002;

app.use(
  cors({
    origin: "*", // Allows all origins, can be replaced with a specific domain
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(express.json());
app.use(helmet());
// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
app.use("/api/tracking/v1", vendor);

app.get("/", (req, res) => {
  console.log(new Date());
  res.send(
    "📦 AWB Tracking API | Status: Online | Last Updated: February 24, 2025"
  );
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});