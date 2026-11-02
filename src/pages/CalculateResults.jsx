import React, { useState } from 'react';
import { Calculator, Sparkles, BookOpen, UserCheck, RotateCcw } from 'lucide-react';
import MarksEntry from '../components/MarksEntry';
import ResultCard from '../components/ResultCard';
import { calculateStudentResults } from '../utils/calculations';

export default function CalculateResults({ 
  students = [], 
  onViewMemo, 
  defaultMinPassMarks = 40,
  defaultMaxMarks = 100 
}) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentName, setStudentName] = useState('Rahul Kumar (Demonstration)');

  const [subjects, setSubjects] = useState([
    { id: 'c1', name: 'Mathematics', code: 'MA301', maxMarks: 100, minPassMarks: 40, marks: 85 },
    { id: 'c2', name: 'Data Structures', code: 'CS302', maxMarks: 100, minPassMarks: 40, marks: 78 },
    { id: 'c3', name: 'DBMS', code: 'CS303', maxMarks: 100, minPassMarks: 40, marks: 65 },
    { id: 'c4', name: 'Operating Systems', code: 'CS304', maxMarks: 100, minPassMarks: 40, marks: 32 },
    { id: 'c5', name: 'Computer Networks', code: 'CS305', maxMarks: 100, minPassMarks: 40, marks: 88 }
  ]);

  const handleSelectStudent = (e) => {
    const id = e.target.value;
    setSelectedStudentId(id);
    if (!id) {
      setStudentName('Ad-Hoc Evaluation');
      return;
    }
    const found = students.find((s) => s.id === id);
    if (found) {
      setStudentName(found.name);
      if (Array.isArray(found.subjects)) {
        setSubjects(JSON.parse(JSON.stringify(found.subjects)));
      }
    }
  };

  const handleReset = () => {
    setSelectedStudentId('');
    setStudentName('Ad-Hoc Student');
    setSubjects([
      { id: 'c1', name: 'Mathematics', code: 'MA301', maxMarks: 100, minPassMarks: 40, marks: 75 },
      { id: 'c2', name: 'Data Structures', code: 'CS302', maxMarks: 100, minPassMarks: 40, marks: 60 },
      { id: 'c3', name: 'DBMS', code: 'CS303', maxMarks: 100, minPassMarks: 40, marks: 55 },
      { id: 'c4', name: 'Operating Systems', code: 'CS304', maxMarks: 100, minPassMarks: 40, marks: 45 },
      { id: 'c5', name: 'Computer Networks', code: 'CS305', maxMarks: 100, minPassMarks: 40, marks: 80 }
    ]);
  };

  const calculation = calculateStudentResults(subjects);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Calculator size={28} color="var(--primary)" />
            <span>Interactive Marks & Pass/Fail Calculator</span>
          </h1>
          <p>
            Instantly test, calculate, and analyze subject marks, pass/fail conditions, percentage, and assigned grades in real-time
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <UserCheck size={16} color="var(--text-muted)" />
          <select 
            className="form-control" 
            style={{ width: 'auto', padding: '0.45rem 0.85rem' }}
            value={selectedStudentId}
            onChange={handleSelectStudent}
          >
            <option value="">-- Load an Enrolled Student --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.rollNumber} - {s.name} ({s.department})
              </option>
            ))}
          </select>

          <button className="btn btn-secondary" onClick={handleReset} title="Reset calculator">
            <RotateCcw size={15} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <MarksEntry
            subjects={subjects}
            setSubjects={setSubjects}
            defaultMinPassMarks={defaultMinPassMarks}
            defaultMaxMarks={defaultMaxMarks}
          />
        </div>

        <div style={{ position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--primary)" />
              <span>Calculated Result Analysis</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{studentName}</span>
          </div>

          <ResultCard
            calculation={calculation}
            studentName={studentName}
            onViewMemo={selectedStudentId ? () => {
              const std = students.find((s) => s.id === selectedStudentId);
              if (std) onViewMemo(std);
            } : null}
          />
        </div>
      </div>
    </div>
  );
}
