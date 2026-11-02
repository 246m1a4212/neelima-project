/**
 * Pre-populated Sample Academic Records
 * Includes required Rahul Kumar (Roll 101) with OS Fail scenario
 * plus high-achieving and diverse department students for demonstration.
 */

export const SAMPLE_STUDENTS = [
  {
    id: 'std-101',
    name: 'Rahul Kumar',
    rollNumber: '101',
    registerNumber: '21CSE101',
    department: 'CSE',
    yearOfStudy: '3',
    semester: '3-1',
    createdAt: '2026-10-15T09:30:00Z',
    subjects: [
      { id: 's1', name: 'Mathematics', code: 'MA301', maxMarks: 100, minPassMarks: 40, marks: 85 },
      { id: 's2', name: 'Data Structures', code: 'CS302', maxMarks: 100, minPassMarks: 40, marks: 78 },
      { id: 's3', name: 'DBMS', code: 'CS303', maxMarks: 100, minPassMarks: 40, marks: 65 },
      { id: 's4', name: 'Operating Systems', code: 'CS304', maxMarks: 100, minPassMarks: 40, marks: 32 },
      { id: 's5', name: 'Computer Networks', code: 'CS305', maxMarks: 100, minPassMarks: 40, marks: 88 }
    ]
  },
  {
    id: 'std-102',
    name: 'Ananya Sharma',
    rollNumber: '102',
    registerNumber: '21CSE102',
    department: 'CSE',
    yearOfStudy: '3',
    semester: '3-1',
    createdAt: '2026-10-16T10:15:00Z',
    subjects: [
      { id: 's1', name: 'Mathematics', code: 'MA301', maxMarks: 100, minPassMarks: 40, marks: 95 },
      { id: 's2', name: 'Data Structures', code: 'CS302', maxMarks: 100, minPassMarks: 40, marks: 92 },
      { id: 's3', name: 'DBMS', code: 'CS303', maxMarks: 100, minPassMarks: 40, marks: 89 },
      { id: 's4', name: 'Operating Systems', code: 'CS304', maxMarks: 100, minPassMarks: 40, marks: 94 },
      { id: 's5', name: 'Computer Networks', code: 'CS305', maxMarks: 100, minPassMarks: 40, marks: 96 }
    ]
  },
  {
    id: 'std-103',
    name: 'Priya Patel',
    rollNumber: '103',
    registerNumber: '21IT103',
    department: 'IT',
    yearOfStudy: '3',
    semester: '3-1',
    createdAt: '2026-10-18T11:00:00Z',
    subjects: [
      { id: 's1', name: 'Web Engineering', code: 'IT301', maxMarks: 100, minPassMarks: 40, marks: 88 },
      { id: 's2', name: 'Cloud Computing', code: 'IT302', maxMarks: 100, minPassMarks: 40, marks: 84 },
      { id: 's3', name: 'Database Systems', code: 'IT303', maxMarks: 100, minPassMarks: 40, marks: 82 },
      { id: 's4', name: 'Information Security', code: 'IT304', maxMarks: 100, minPassMarks: 40, marks: 86 },
      { id: 's5', name: 'Software Testing', code: 'IT305', maxMarks: 100, minPassMarks: 40, marks: 80 }
    ]
  },
  {
    id: 'std-104',
    name: 'Vikram Singh',
    rollNumber: '104',
    registerNumber: '21ECE104',
    department: 'ECE',
    yearOfStudy: '3',
    semester: '3-1',
    createdAt: '2026-10-20T14:20:00Z',
    subjects: [
      { id: 's1', name: 'Digital Signal Processing', code: 'EC301', maxMarks: 100, minPassMarks: 40, marks: 74 },
      { id: 's2', name: 'Microcontrollers', code: 'EC302', maxMarks: 100, minPassMarks: 40, marks: 76 },
      { id: 's3', name: 'VLSI Design', code: 'EC303', maxMarks: 100, minPassMarks: 40, marks: 70 },
      { id: 's4', name: 'Antenna Wave Propagation', code: 'EC304', maxMarks: 100, minPassMarks: 40, marks: 72 },
      { id: 's5', name: 'Embedded Systems', code: 'EC305', maxMarks: 100, minPassMarks: 40, marks: 78 }
    ]
  },
  {
    id: 'std-105',
    name: 'Sneha Reddy',
    rollNumber: '105',
    registerNumber: '21MECH105',
    department: 'MECH',
    yearOfStudy: '2',
    semester: '2-2',
    createdAt: '2026-10-22T16:00:00Z',
    subjects: [
      { id: 's1', name: 'Thermodynamics', code: 'ME201', maxMarks: 100, minPassMarks: 40, marks: 66 },
      { id: 's2', name: 'Fluid Mechanics', code: 'ME202', maxMarks: 100, minPassMarks: 40, marks: 68 },
      { id: 's3', name: 'Kinematics of Machinery', code: 'ME203', maxMarks: 100, minPassMarks: 40, marks: 62 },
      { id: 's4', name: 'Manufacturing Processes', code: 'ME204', maxMarks: 100, minPassMarks: 40, marks: 64 },
      { id: 's5', name: 'Engineering Materials', code: 'ME205', maxMarks: 100, minPassMarks: 40, marks: 70 }
    ]
  },
  {
    id: 'std-106',
    name: 'Karthik Raj',
    rollNumber: '106',
    registerNumber: '21CSE106',
    department: 'CSE',
    yearOfStudy: '3',
    semester: '3-1',
    createdAt: '2026-10-25T11:45:00Z',
    subjects: [
      { id: 's1', name: 'Mathematics', code: 'MA301', maxMarks: 100, minPassMarks: 40, marks: 44 },
      { id: 's2', name: 'Data Structures', code: 'CS302', maxMarks: 100, minPassMarks: 40, marks: 48 },
      { id: 's3', name: 'DBMS', code: 'CS303', maxMarks: 100, minPassMarks: 40, marks: 45 },
      { id: 's4', name: 'Operating Systems', code: 'CS304', maxMarks: 100, minPassMarks: 40, marks: 42 },
      { id: 's5', name: 'Computer Networks', code: 'CS305', maxMarks: 100, minPassMarks: 40, marks: 46 }
    ]
  }
];

export const DEPARTMENT_OPTIONS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIDS'];
export const SEMESTER_OPTIONS = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];
export const YEAR_OPTIONS = ['1', '2', '3', '4'];
