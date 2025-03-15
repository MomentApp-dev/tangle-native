export const DEFAULT_MOMENT_METADATA = {
  createdAt: '',
  going: 0,
  interested: 0,
  notGoing: 0,
  views: 0,
} as const;

// Ensure type safety
export type MomentMetadata = typeof DEFAULT_MOMENT_METADATA; 