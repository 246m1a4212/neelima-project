/**
 * Storage Utility for persisting and managing student records in Local Storage
 */
import { SAMPLE_STUDENTS } from './sampleData';
import { DEFAULT_GRADING_SCALE } from './gradeCalculator';

const STORAGE_KEYS = {
  STUDENTS: 'student_analyzer_records_v1',
  SETTINGS: 'student_analyzer_settings_v1',
  THEME: 'student_analyzer_theme_v1'
};

const DEFAULT_SETTINGS = {
  institutionName: 'Apex Institute of Technology & Engineering',
  defaultMinPassMarks: 40,
  defaultMaxMarks: 100,
  gradingScale: DEFAULT_GRADING_SCALE
};

/**
 * Retrieves all stored students. Initializes with sample records on first run.
 */
export function getStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(SAMPLE_STUDENTS));
      return SAMPLE_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SAMPLE_STUDENTS;
  } catch (err) {
    console.error('Error reading students from localStorage:', err);
    return SAMPLE_STUDENTS;
  }
}

/**
 * Saves a new student record
 */
export function saveStudent(studentData) {
  const students = getStudents();
  
  // Check for duplicate roll number
  const duplicate = students.find(
    s => s.rollNumber.trim().toLowerCase() === studentData.rollNumber.trim().toLowerCase()
  );
  if (duplicate) {
    throw new Error(`A student with Roll Number "${studentData.rollNumber}" already exists.`);
  }

  const newStudent = {
    ...studentData,
    id: 'std-' + Date.now(),
    createdAt: new Date().toISOString()
  };

  const updated = [newStudent, ...students];
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
  return newStudent;
}

/**
 * Updates an existing student record
 */
export function updateStudent(id, studentData) {
  const students = getStudents();
  
  // Check if roll number collides with another student
  const duplicate = students.find(
    s => s.id !== id && s.rollNumber.trim().toLowerCase() === studentData.rollNumber.trim().toLowerCase()
  );
  if (duplicate) {
    throw new Error(`Another student with Roll Number "${studentData.rollNumber}" already exists.`);
  }

  const index = students.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Student record not found.');
  }

  const updatedStudent = {
    ...students[index],
    ...studentData,
    id,
    updatedAt: new Date().toISOString()
  };

  students[index] = updatedStudent;
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  return updatedStudent;
}

/**
 * Deletes a student by ID
 */
export function deleteStudent(id) {
  const students = getStudents();
  const filtered = students.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));
  return filtered;
}

/**
 * Gets a single student by ID
 */
export function getStudentById(id) {
  const students = getStudents();
  return students.find(s => s.id === id) || null;
}

/**
 * Resets storage back to default sample records
 */
export function resetToSampleData() {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(SAMPLE_STUDENTS));
  return SAMPLE_STUDENTS;
}

/**
 * Clears all student records
 */
export function clearAllStudents() {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([]));
  return [];
}

/**
 * Retrieves application settings
 */
export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Saves application settings
 */
export function saveSettings(settings) {
  const current = getSettings();
  const merged = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
  return merged;
}

/**
 * Gets current theme
 */
export function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
}

/**
 * Sets current theme
 */
export function setStoredTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}
