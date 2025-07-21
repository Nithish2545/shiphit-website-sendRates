const rateLimitMap = new Map(); // for phone numbers
const ipRateLimitMap = new Map(); // for IP addresses

const rateLimitByPhoneAndIP = ({
  phoneLimit = 3,
  ipLimit = 6,
  windowMs = 5 * 60 * 1000, // 5 minutes
} = {}) => {
  return (req, res, next) => {
    const phone = req.body.phoneNumber;
    const ip =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const currentTime = Date.now();

    // --- IP RATE LIMIT ---
    const ipData = ipRateLimitMap.get(ip) || {
      count: 0,
      lastRequestTime: currentTime,
    };

    if (currentTime - ipData.lastRequestTime > windowMs) {
      ipData.count = 0;
      ipData.lastRequestTime = currentTime;
    }

    ipData.count += 1;

    if (ipData.count > ipLimit) {
      return res.status(429).json({
        error:
          "Too many requests from this IP. Please wait and try again later.",
      });
    }

    ipRateLimitMap.set(ip, ipData);

    // --- PHONE NUMBER RATE LIMIT ---
    if (!phone) {
      return res
        .status(400)
        .json({ error: "Phone number is required for rate limiting." });
    }

    const phoneData = rateLimitMap.get(phone) || {
      count: 0,
      lastRequestTime: currentTime,
    };

    if (currentTime - phoneData.lastRequestTime > windowMs) {
      phoneData.count = 0;
      phoneData.lastRequestTime = currentTime;
    }

    phoneData.count += 1;

    if (phoneData.count > phoneLimit) {
      return res.status(429).json({
        error: "Too many requests. Please wait and try again after 5 minutes!",
      });
    }

    rateLimitMap.set(phone, phoneData);

    next();
  };
};

export default rateLimitByPhoneAndIP;
