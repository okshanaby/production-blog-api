// constants/index.ts
export const AUTH_CONSTANTS = {
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  ACCESS_TOKEN_EXPIRES_MS: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  REFRESH_TOKEN_EXPIRES_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;