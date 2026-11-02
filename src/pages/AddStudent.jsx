import React, { useState, useEffect } from 'react';
import { UserPlus, Save, RotateCcw, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import StudentForm from '../components/StudentForm';
import MarksEntry from '../components/MarksEntry';
import ResultCard from '../components/ResultCard';
import { calculateStudentResults } from '../utils/calculations';
import { saveStudent, updateStudent } from '../utils/storage';

export default function AddStudent({ 
  onSuccess, 
  editingStudent = null, 
  onCancelEdit,
  defaultMinPassMarks = 40,
  defaultMaxMarks = 100
}) {
  const isEditMode = Boolean(editingStudent);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    registerNumber: '',
    department: 'CSE',
    yearOfStudy: '3',
    semester: '3-1'
  });

  // Subjects state (initialized with 5 subjects by default)
  const [subjects, setSubjects] = useState([
    { id: 's1', name: 'Mathematics', code: 'MA301', maxMarks: defaultMaxMarks, minPassMarks: defaultMinPassMarks, marks: 85 },
    { id: 's2', name: 'Data Structures', code: 'CS302', maxMarks: defaultMaxMarks, minPassMarks: defaultMinPassMarks, marks: 78 },
    { id: 's3', name: 'DBMS', code: 'CS303', maxMarks: defaultMaxMarks, minPassMarks: defaultMinPassMarks, marks: 65 },
    { id: 's4', name: 'Operating Systems', code: 'CS304', maxMarks: defaultMaxMarks, minPassMarks: defaultMinPassMarks, marks: 32 },
    { id: 's5', name: 'Computer Networks', code: 'CS305', maxMarks: defaultMaxMarks, minPassMarks: defaultMinPassMarks, marks: 88 }
  ]);

  const [errors, setErrors] = useState({});

  // Populate data when in edit mode
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || '',
        rollNumber: editingStudent.rollNumber || '',
        registerNumber: editingStudent.registerNumber || '',
        department: editingStudent.department || 'CSE',
        yearOfStudy: editingStudent.yearOfStudy || '3',
        semester: editingStudent.semester || '3-1'
      });
      if (Array.isArray(editingStudent.subjects) && editingStudent.subjects.length > 0) {
        setSubjects(editingStudent.subjects);
      }
    }
  }, [editingStudent]);

  // Live calculation of current state
  const liveCalculation = calculateStudentResults(subjects);

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Student Name is required';
    if (!formData.rollNumber.trim()) errs.rollNumber = 'Roll Number is required';

    if (subjects.length === 0) {
      errs.subjects = 'Please add at least one subject';
    }

    // Check subjects
    let subjectError = null;
    subjects.forEach((s, idx) => {
      if (!s.name.trim()) {
        subjectError = `Subject #${idx + 1} must have a name`;
      }
      const obtained = Number(s.marks);
      const max = Number(s.maxMarks);
      const minPass = Number(s.minPassMarks);

      if (s.marks === '' || isNaN(obtained)) {
        subjectError = `Marks for ${s.name || `Subject #${idx + 1}`} cannot be empty`;
      } else if (obtained < 0) {
        subjectError = `Marks for ${s.name} cannot be negative`;
      } else if (obtained > max) {
        subjectError = `Marks for ${s.name} (${obtained}) cannot exceed maximum marks (${max})`;
      } else if (minPass > max) {
        subjectError = `Passing marks for ${s.name} cannot exceed maximum marks`;
      }
    });

    if (subjectError) errs.subjects = subjectError;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const studentPayload = {
        ...formData,
        subjects: subjects.map((s) => ({
          ...s,
          marks: Number(s.marks),
          maxMarks: Number(s.maxMarks),
          minPassMarks: Number(s.minPassMarks)
        }))
      };

      if (isEditMode) {
        updateStudent(editingStudent.id, studentPayload);
        onSuccess('Student record updated successfully!');
      } else {
        saveStudent(studentPayload);
        onSuccess('Student record added successfully!');
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        rollNumber: err.message
      }));
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      rollNumber: '',
      registerNumber: '',
      department: 'CSE',
      yearOfStudy: '3',
      semester: '3-1'
    });
    setSubjects([
      { id: 's1', name: 'Mathematics', code: 'MA301', maxMarks: 100, minPassMarks: 40, marks: '' },
      { id: 's2', name: 'Data Structures', code: 'CS302', maxMarks: 100, minPassMarks: 40, marks: '' },
      { id: 's3', name: 'DBMS', code: 'CS303', maxMarks: 100, minPassMarks: 40, marks: '' },
      { id: 's4', name: 'Operating Systems', code: 'CS304', maxMarks: 100, minPassMarks: 40, marks: '' },
      { id: 's5', name: 'Computer Networks', code: 'CS305', maxMarks: 100, minPassMarks: 40, marks: '' }
    ]);
    setErrors({});
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <UserPlus size={28} color="var(--primary)" />
            <span>{isEditMode ? 'Edit Student Record' : 'Add New Student Record'}</span>
          </h1>
          <p>
            {isEditMode 
              ? `Update academic records and subject marks for ${formData.name || 'Student'}`
              : 'Enter student information and subject marks to instantly generate results and save records'}
          </p>
        </div>

        {isEditMode && (
          <button className="btn btn-secondary" onClick={onCancelEdit}>
            <ArrowLeft size={16} />
            <span>Cancel Edit</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Column: Form & Subject Marks Entry */}
          <div>
            <StudentForm 
              formData={formData} 
              setFormData={setFormData} 
              errors={errors} 
            />

            <MarksEntry 
              subjects={subjects} 
              setSubjects={setSubjects} 
              errors={errors}
              defaultMinPassMarks={defaultMinPassMarks}
              defaultMaxMarks={defaultMaxMarks}
            />

            {/* Form Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.85rem' }}>
                <Save size={18} />
                <span>{isEditMode ? 'Update Student Record' : 'Save Student Record'}</span>
              </button>
              {!isEditMode && (
                <button type="button" className="btn btn-secondary" onClick={handleReset}>
                  <RotateCcw size={16} />
                  <span>Reset Form</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Reactive Result Preview */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} color="var(--primary)" />
                <span>Live Result Preview</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-calculating</span>
            </div>

            <ResultCard 
              calculation={liveCalculation} 
              studentName={formData.name || 'Student'} 
            />
          </div>
        </div>
      </form>
    </div>
  );
}
