/**
 * Application-wide constants
 */

// UI Timing
export const COPY_SUCCESS_DURATION = 2000; // milliseconds
export const TOAST_DURATION = 3000; // milliseconds
export const TYPEWRITER_SPEED = 12; // ms per character
export const PIPELINE_STEP_DURATION = 500; // ms per step

// Input Validation
export const MAX_MESSAGE_LENGTH = 2000; // characters

// Citation Display
export const EXCERPT_PREVIEW_LENGTH = 200; // characters

// Pipeline
export const PIPELINE_STEPS = ['Rewrite', 'Retrieve', 'Assess', 'Generate', 'Score'] as const;

// Layout
export const DRAWER_WIDTH = 480; // px
