/**
 * Core Academic Calculation Engine for Student Result Analyzer
 */

/**
 * Calculates academic statistics for a list of subjects
 * @param {Array<{name: string, code: string, maxMarks: number, minPassMarks: number, marks: number}>} subjects 
 * @param {Function} [gradeResolver] - Optional function to map percentage to a grade letter
 * @returns {Object} Complete calculation summary
 */
export function calculateStudentResults(subjects = [], gradeResolver = null) {
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return {
      totalObtained: 0,
      totalMax: 0,
      percentage: 0,
      averageMarks: 0,
      isPass: false,
      status: 'FAIL',
      passedCount: 0,
      failedCount: 0,
      failedSubjects: [],
      passedSubjects: [],
      grade: 'F',
      remarks: 'No subjects entered'
    };
  }

  let totalObtained = 0;
  let totalMax = 0;
  const failedSubjects = [];
  const passedSubjects = [];

  subjects.forEach((subj) => {
    const obtained = Number(subj.marks) || 0;
    const max = Number(subj.maxMarks) || 100;
    const minPass = Number(subj.minPassMarks) || 40;

    totalObtained += obtained;
    totalMax += max;

    const subjectPercentage = max > 0 ? Number(((obtained / max) * 100).toFixed(2)) : 0;
    const isSubjectPass = obtained >= minPass;

    const processedSubject = {
      ...subj,
      marks: obtained,
      maxMarks: max,
      minPassMarks: minPass,
      percentage: subjectPercentage,
      isPass: isSubjectPass
    };

    if (isSubjectPass) {
      passedSubjects.push(processedSubject);
    } else {
      failedSubjects.push(processedSubject);
    }
  });

  const subjectCount = subjects.length;
  const overallPercentage = totalMax > 0 ? Number(((totalObtained / totalMax) * 100).toFixed(2)) : 0;
  const averageMarks = subjectCount > 0 ? Number((totalObtained / subjectCount).toFixed(2)) : 0;

  // Passing rule: Must obtain minimum passing marks in EVERY subject
  const isPass = failedSubjects.length === 0 && subjectCount > 0;
  const status = isPass ? 'PASS' : 'FAIL';

  // Determine grade (if failed, grade is F unless passed)
  let grade = 'F';
  if (isPass) {
    if (typeof gradeResolver === 'function') {
      grade = gradeResolver(overallPercentage);
    } else {
      // Default standard scale
      if (overallPercentage >= 90) grade = 'O';
      else if (overallPercentage >= 80) grade = 'A+';
      else if (overallPercentage >= 70) grade = 'A';
      else if (overallPercentage >= 60) grade = 'B';
      else if (overallPercentage >= 50) grade = 'C';
      else if (overallPercentage >= 40) grade = 'D';
      else grade = 'F';
    }
  } else {
    grade = 'F'; // Guaranteed F if any subject failed
  }

  // Generate intelligent academic performance remarks
  let remarks = '';
  if (isPass) {
    if (overallPercentage >= 90) {
      remarks = 'Outstanding performance! Exemplary academic mastery across all subjects.';
    } else if (overallPercentage >= 80) {
      remarks = 'Excellent achievement! High-level conceptual clarity and consistency.';
    } else if (overallPercentage >= 70) {
      remarks = 'Very good academic performance. Demonstrates solid competency.';
    } else if (overallPercentage >= 60) {
      remarks = 'Good progress. Satisfactory understanding with room for advancement.';
    } else if (overallPercentage >= 50) {
      remarks = 'Average performance. Consistent effort recommended to enhance grades.';
    } else {
      remarks = 'Passed. Candidate met basic academic criteria. Intensive revision advised.';
    }
  } else {
    const failedNames = failedSubjects.map(s => s.name || s.code).join(', ');
    remarks = `Needs improvement. Remedial support and re-examination required in: ${failedNames}.`;
  }

  return {
    totalObtained,
    totalMax,
    percentage: overallPercentage,
    averageMarks,
    isPass,
    status,
    passedCount: passedSubjects.length,
    failedCount: failedSubjects.length,
    failedSubjects,
    passedSubjects,
    grade,
    remarks
  };
}

/**
 * Validates a single subject marks entry
 */
export function validateSubjectMarks(subject) {
  const errors = {};
  if (!subject.name || !subject.name.trim()) {
    errors.name = 'Subject name is required';
  }
  const max = Number(subject.maxMarks);
  const minPass = Number(subject.minPassMarks);
  const marks = Number(subject.marks);

  if (isNaN(max) || max <= 0) {
    errors.maxMarks = 'Max marks must be greater than 0';
  }
  if (isNaN(minPass) || minPass < 0) {
    errors.minPassMarks = 'Passing marks cannot be negative';
  }
  if (minPass > max) {
    errors.minPassMarks = 'Passing marks cannot exceed maximum marks';
  }
  if (isNaN(marks) || marks < 0) {
    errors.marks = 'Marks cannot be negative';
  }
  if (marks > max) {
    errors.marks = `Marks cannot exceed max marks (${max})`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
