import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  Edit, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Download
} from 'lucide-react';
import { calculateStudentResults } from '../utils/calculations';
import { getGradeColor } from '../utils/gradeCalculator';
import { DEPARTMENT_OPTIONS, SEMESTER_OPTIONS } from '../utils/sampleData';

export default function StudentTable({ 
  students = [], 
  onViewMemo, 
  onEditStudent, 
  onDeleteStudent,
  initialSearch = ''
}) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSem, setSelectedSem] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Filter students
  const filteredStudents = students.filter((std) => {
    const calc = calculateStudentResults(std.subjects);
    
    // Text search (name or roll number or register number)
    const query = search.trim().toLowerCase();
    const matchesSearch = 
      !query || 
      std.name.toLowerCase().includes(query) || 
      std.rollNumber.toLowerCase().includes(query) ||
      (std.registerNumber && std.registerNumber.toLowerCase().includes(query));

    // Department filter
    const matchesDept = selectedDept === 'ALL' || std.department === selectedDept;

    // Semester filter
    const matchesSem = selectedSem === 'ALL' || std.semester === selectedSem;

    // Status filter
    const matchesStatus = selectedStatus === 'ALL' || calc.status === selectedStatus;

    return matchesSearch && matchesDept && matchesSem && matchesStatus;
  });

  return (
    <div className="app-card">
      {/* Search and Filters Bar */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.85rem', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '1.25rem'
      }}>
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.45rem 0.85rem', minWidth: '260px', flex: '1 1 240px' }}>
          <Search size={16} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Search by student name or roll no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '0.875rem' }}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {/* Department Filter */}
          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENT_OPTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Semester Filter */}
          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
          >
            <option value="ALL">All Semesters</option>
            {SEMESTER_OPTIONS.map((s) => (
              <option key={s} value={s}>Sem {s}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">All Results (Pass/Fail)</option>
            <option value="PASS">Pass Only</option>
            <option value="FAIL">Fail Only</option>
          </select>

          {(search || selectedDept !== 'ALL' || selectedSem !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => {
                setSearch('');
                setSelectedDept('ALL');
                setSelectedSem('ALL');
                setSelectedStatus('ALL');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Responsive Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Dept & Sem</th>
              <th>Marks Obtained</th>
              <th>Percentage</th>
              <th>Grade</th>
              <th>Result Status</th>
              <th>Failed Subjects</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <AlertCircle size={36} style={{ margin: '0 auto 0.75rem auto', display: 'block', opacity: 0.5 }} />
                  <strong>No student records found</strong>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Try adjusting your search criteria or add new student records.
                  </p>
                </td>
              </tr>
            ) : (
              filteredStudents.map((std) => {
                const calc = calculateStudentResults(std.subjects);
                const isPass = calc.status === 'PASS';
                const gradeColor = getGradeColor(calc.grade);

                return (
                  <tr key={std.id} className={!isPass ? 'row-fail' : ''}>
                    {/* Roll Number */}
                    <td>
                      <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                        {std.rollNumber}
                      </strong>
                      {std.registerNumber && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {std.registerNumber}
                        </div>
                      )}
                    </td>

                    {/* Student Name */}
                    <td>
                      <span style={{ fontWeight: 600 }}>{std.name}</span>
                    </td>

                    {/* Department & Semester */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span className="dept-badge">{std.department}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Sem {std.semester}
                        </span>
                      </div>
                    </td>

                    {/* Marks Obtained / Max */}
                    <td>
                      <strong>{calc.totalObtained}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> / {calc.totalMax}</span>
                    </td>

                    {/* Percentage */}
                    <td>
                      <strong style={{ color: isPass ? 'var(--text-main)' : 'var(--danger)' }}>
                        {calc.percentage}%
                      </strong>
                    </td>

                    {/* Grade */}
                    <td>
                      <span 
                        className="grade-pill" 
                        style={{ 
                          background: isPass ? gradeColor : 'var(--danger)',
                          fontSize: '0.85rem',
                          padding: '0.15rem 0.6rem',
                          minWidth: '34px'
                        }}
                      >
                        {calc.grade}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`status-badge ${isPass ? 'pass' : 'fail'}`}>
                        {isPass ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        <span>{calc.status}</span>
                      </span>
                    </td>

                    {/* Failed Subjects Highlight */}
                    <td>
                      {calc.failedCount > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {calc.failedSubjects.map((fs, idx) => (
                            <span 
                              key={idx} 
                              style={{ 
                                background: 'var(--danger-bg)', 
                                color: 'var(--danger)', 
                                border: '1px solid var(--danger-border)', 
                                borderRadius: '4px', 
                                padding: '0.15rem 0.45rem', 
                                fontSize: '0.75rem', 
                                fontWeight: 600 
                              }}
                              title={`Obtained: ${fs.marks}/${fs.maxMarks} (Pass min: ${fs.minPassMarks})`}
                            >
                              {fs.name} ({fs.marks})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 500 }}>
                          All Passed ({calc.passedCount})
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ width: '32px', height: '32px' }}
                          onClick={() => onViewMemo(std)}
                          title="View Marks Memo"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ width: '32px', height: '32px' }}
                          onClick={() => onEditStudent(std)}
                          title="Edit Student Record"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                          onClick={() => onDeleteStudent(std)}
                          title="Delete Student"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <span>Showing {filteredStudents.length} of {students.length} student records</span>
      </div>
    </div>
  );
}
