import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/routes.js";
const app = express();
const PORT = process.env.PORT || 8080;


const allowedOrigins = ["https://shiphit.in", "https://www.shiphit.in"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(

app.use(express.json());
app.use(helmet());

app.use("/api/tracking/v1", router);

app.get("/", (req, res) => {
  res.send(
    "📦 AWB Tracking API | Status: Online | Last Updated: july 18, 2025"
  );
});

app.listen(PORT, () => {
  console.log(`Server is listening on port 13-09-2025 ${PORT}`);
});
