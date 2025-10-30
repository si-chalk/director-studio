/**
 * Timeline Layout Constants
 * 
 * These constants control the visual layout of the timeline view.
 * Keep these in sync with the CSS in StoryboardViewerEmbedded.css
 * 
 * IMPORTANT: When implementing shot duration editing:
 * - Scene label widths will automatically recalculate when shot durations change
 * - The calculateSceneWidth() function recalculates based on current shot durations
 * - Ensure that shot duration updates trigger a re-render of TimelineView
 * - The React component will automatically update scene widths via the inline style
 */

/**
 * Gap between shots in pixels
 * Used in: .shots-grid { gap: 4px; }
 */
export const SHOT_GAP_PX = 4;

/**
 * Pixels per second for shot duration calculation
 * Formula: width = durationSeconds * PIXELS_PER_SECOND
 */
export const PIXELS_PER_SECOND = 40;

/**
 * Minimum shot width in pixels
 */
export const MIN_SHOT_WIDTH_PX = 40;

/**
 * Calculate the width of a shot card based on its duration
 * @param durationMs Duration in milliseconds
 * @returns Width in pixels
 */
export const calculateShotWidth = (durationMs: number): number => {
  const durationSeconds = durationMs / 1000;
  return Math.max(durationSeconds * PIXELS_PER_SECOND, MIN_SHOT_WIDTH_PX);
};

/**
 * Calculate the total width of a scene (including all shots and gaps)
 * @param shotDurations Array of shot durations in milliseconds
 * @returns Total width in pixels
 */
export const calculateSceneWidth = (shotDurations: number[]): number => {
  // Calculate individual shot widths
  const shotWidths = shotDurations.map(calculateShotWidth);
  
  // Sum all shot widths
  const totalShotWidth = shotWidths.reduce((sum, width) => sum + width, 0);
  
  // Add gaps between shots (n-1 gaps for n shots)
  const totalGaps = (shotDurations.length - 1) * SHOT_GAP_PX;
  
  return totalShotWidth + totalGaps;
};

