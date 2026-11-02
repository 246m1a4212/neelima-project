/**
 * Grade Calculation Utility
 * Default and configurable grading scales
 */

export const DEFAULT_GRADING_SCALE = [
  { grade: 'O', label: 'Outstanding', min: 90, max: 100, gpa: 10.0, color: '#10b981' },
  { grade: 'A+', label: 'Excellent', min: 80, max: 89.99, gpa: 9.0, color: '#3b82f6' },
  { grade: 'A', label: 'Very Good', min: 70, max: 79.99, gpa: 8.0, color: '#6366f1' },
  { grade: 'B', label: 'Good', min: 60, max: 69.99, gpa: 7.0, color: '#8b5cf6' },
  { grade: 'C', label: 'Above Average', min: 50, max: 59.99, gpa: 6.0, color: '#f59e0b' },
  { grade: 'D', label: 'Pass', min: 40, max: 49.99, gpa: 5.0, color: '#ec4899' },
  { grade: 'F', label: 'Fail', min: 0, max: 39.99, gpa: 0.0, color: '#ef4444' },
];

/**
 * Calculates grade from percentage based on active grading scale
 * @param {number} percentage 
 * @param {Array} scale 
 * @returns {string} Grade letter
 */
export function calculateGrade(percentage, scale = DEFAULT_GRADING_SCALE) {
  const num = Math.round(Number(percentage) * 100) / 100;
  if (isNaN(num)) return 'F';

  const activeScale = Array.isArray(scale) && scale.length > 0 ? scale : DEFAULT_GRADING_SCALE;

  for (const item of activeScale) {
    if (num >= item.min && num <= (item.max ?? 100)) {
      return item.grade;
    }
  }

  if (num >= 90) return 'O';
  if (num < 40) return 'F';
  return 'F';
}

/**
 * Returns color token for a grade
 */
export function getGradeColor(grade) {
  switch (grade) {
    case 'O':
      return '#10b981'; // Emerald
    case 'A+':
      return '#2563eb'; // Royal Blue
    case 'A':
      return '#6366f1'; // Indigo
    case 'B':
      return '#8b5cf6'; // Violet
    case 'C':
      return '#f59e0b'; // Amber
    case 'D':
      return '#ec4899'; // Pink
    case 'F':
      return '#ef4444'; // Red
    default:
      return '#6b7280';
  }
}

/**
 * Returns human-readable descriptor for a grade
 */
export function getGradeLabel(grade) {
  const found = DEFAULT_GRADING_SCALE.find(g => g.grade === grade);
  return found ? found.label : 'N/A';
}
