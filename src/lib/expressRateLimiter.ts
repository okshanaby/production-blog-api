import rateLimit from "express-rate-limit";

const expressRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute time window for request limit
  limit: 5, // Limit each IP to 60 requests per `windowMs`
  message: {
    success: false,
    message: "Too many requests, please try again later.",
    error: "Too many requests",
  },
  legacyHeaders: false, // Disable deprecated `X-RateLimit-*` headers
  standardHeaders: "draft-8", // use latest standard headers
});

export default expressRateLimiter;
