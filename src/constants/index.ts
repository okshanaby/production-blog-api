// constants/index.ts
export const AUTH_CONSTANTS = {
  ACCESS_TOKEN_EXPIRES_IN: "1h",
  ACCESS_TOKEN_EXPIRES_MS: 60 * 60 * 1000, // 1 hour
  REFRESH_TOKEN_EXPIRES_IN: "7d",
  REFRESH_TOKEN_EXPIRES_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;
