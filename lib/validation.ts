/**
 * Centralized input limits and validation for API routes.
 */

export const LIMITS = {
  HUMANIZE_TEXT_MAX_CHARS: 50_000,
  GENERATE_PROMPT_MAX_CHARS: 10_000,
  DETECT_TEXT_MAX_CHARS: 20_000,
  SUPPORT_MESSAGE_MAX_CHARS: 5_000,
  SUPPORT_REASON_MAX_CHARS: 200,
  USERNAME_MAX_LENGTH: 50,
  PROFILE_EMAIL_MAX_LENGTH: 254,
} as const;

export const HUMANIZE_LEVELS = ["basic", "intermediate", "advanced"] as const;
export type HumanizeLevel = (typeof HUMANIZE_LEVELS)[number];

export function isHumanizeLevel(s: unknown): s is HumanizeLevel {
  return typeof s === "string" && HUMANIZE_LEVELS.includes(s as HumanizeLevel);
}

/** Escape SQL LIKE wildcards % and _ for safe use in LIKE patterns. */
export function escapeLikePattern(value: string): string {
  return value.replace(/[%_\\]/g, "\\$&");
}
