import express from "express";

import sendRates from "../controller/sendRates.js";
import rateLimitByPhone from "../middleware/rateLimiter.js";
const router = express.Router();

router.post("/sendRatesToWA", rateLimitByPhone(3, 5 * 60 * 1000), sendRates);

export default router;