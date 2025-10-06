// constants/index.ts
export const AUTH_CONSTANTS = {
  ACCESS_TOKEN_EXPIRES_IN: "7h",
  ACCESS_TOKEN_EXPIRES_MS: 7 * 60 * 60 * 1000, // 7 hours
  REFRESH_TOKEN_EXPIRES_IN: "7d",
  REFRESH_TOKEN_EXPIRES_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

export const PAGINATION_CONSTANTS = {
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0,
} as const;

export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
} as const;

export const VALIDATION_CONSTANTS = {
  ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "a", "ul", "ol", "li", "br"] as string[],
  ALLOWED_ATTRIBUTES: { a: ["href", "target"] } as Record<string, string[]>,
} as const;
