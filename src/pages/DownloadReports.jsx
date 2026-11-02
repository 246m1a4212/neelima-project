import React, { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  UserCheck, 
  GraduationCap, 
  CheckCircle2, 
  XCircle,
  Award
} from 'lucide-react';
import { calculateStudentResults } from '../utils/calculations';
import { generateStudentPDF, exportStudentsToCSV } from '../utils/exportUtils';
import { getGradeColor } from '../utils/gradeCalculator';

export default function DownloadReports({ 
  students = [], 
  institution = 'Apex Institute of Technology & Engineering' 
}) {
  const [selectedStudentId, setSelectedStudentId] = useState(
    students.length > 0 ? students[0].id : ''
  );

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const calculation = selectedStudent ? calculateStudentResults(selectedStudent.subjects) : null;
  const isPass = calculation ? calculation.status === 'PASS' : false;
  const gradeColor = calculation ? getGradeColor(calculation.grade) : '#3b82f6';

  const handleDownloadPDF = () => {
    if (!selectedStudent || !calculation) return;
    generateStudentPDF(selectedStudent, calculation, institution);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportStudentsToCSV(students);
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header no-print">
        <div className="page-title-group">
          <h1>
            <Download size={28} color="var(--primary)" />
            <span>Academic Reports & Marks Memo Generation</span>
          </h1>
          <p>Download official PDF marks memos, generate printable grade sheets, and export batch datasets to CSV</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <FileSpreadsheet size={16} />
            <span>Export Batch to CSV</span>
          </button>
        </div>
      </div>

      {/* Student Selector Card */}
      <div className="app-card no-print" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 300px' }}>
            <UserCheck size={20} color="var(--primary)" />
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                Select Student for Marks Memo:
              </label>
              <select
                className="form-control"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.rollNumber} - {s.name} ({s.department} Sem {s.semester})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={handlePrint}>
              <Printer size={16} />
              <span>Print Memo</span>
            </button>
            <button className="btn btn-primary" onClick={handleDownloadPDF}>
              <Download size={16} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Marks Memo Sheet */}
      {selectedStudent && calculation && (
        <div className="marks-memo-sheet">
          {/* Watermark */}
          <div className="memo-watermark">{calculation.status}</div>

          {/* Header */}
          <div className="memo-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
              <GraduationCap size={32} color="#2563eb" />
              <h1 className="memo-institution">{institution}</h1>
            </div>
            <p className="memo-subhead">Autonomous Institution &bull; Accredited with 'A+' Grade by NAAC &bull; Approved by AICTE</p>
            <div className="memo-doc-title">OFFICIAL GRADE REPORT & MARKS MEMORANDUM</div>
          </div>

          {/* Student Info Box */}
          <div style={{ 
            background: '#f1f5f9', 
            border: '1px solid #cbd5e1', 
            borderRadius: '8px', 
            padding: '1.25rem 1.5rem', 
            marginBottom: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem 2rem',
            fontSize: '0.9rem'
          }}>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Student Name: </span>
              <strong style={{ color: '#0f172a' }}>{selectedStudent.name}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Department: </span>
              <strong style={{ color: '#0f172a' }}>{selectedStudent.department}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Roll Number: </span>
              <strong style={{ color: '#0f172a' }}>{selectedStudent.rollNumber}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Year & Semester: </span>
              <strong style={{ color: '#0f172a' }}>Year {selectedStudent.yearOfStudy} (Semester {selectedStudent.semester})</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Register Number: </span>
              <strong style={{ color: '#0f172a' }}>{selectedStudent.registerNumber || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Date of Evaluation: </span>
              <strong style={{ color: '#0f172a' }}>
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </strong>
            </div>
          </div>

          {/* Subject Table */}
          <div style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#2563eb', color: '#ffffff' }}>
                  <th style={{ padding: '0.75rem', border: '1px solid #1d4ed8', textAlign: 'center' }}>S.No</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #1d4ed8', textAlign: 'center' }}>Subject Code</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #1d4ed8', textAlign: 'left' }}>Subject Title</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #1d4ed8', textAlign: 'center' }}>Maximum Marks</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #1d4ed8', textAlign: 'center' }}>Min Pass</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #1d4ed8', textAlign: 'center' }}>Marks Obtained</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #1d4ed8', textAlign: 'center' }}>Percentage</th>
                  <th style={{ padding: '0.75rem', border: '1px solid #1d4ed8', textAlign: 'center' }}>Result</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudent.subjects.map((sub, idx) => {
                  const obtained = Number(sub.marks) || 0;
                  const max = Number(sub.maxMarks) || 100;
                  const minPass = Number(sub.minPassMarks) || 40;
                  const subPass = obtained >= minPass;
                  const subPct = max > 0 ? ((obtained / max) * 100).toFixed(1) : 0;

                  return (
                    <tr 
                      key={sub.id || idx}
                      style={{ 
                        background: subPass ? '#ffffff' : '#fef2f2',
                        color: '#1e293b'
                      }}
                    >
                      <td style={{ padding: '0.65rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ padding: '0.65rem', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 600 }}>
                        {sub.code || `SUB${idx + 1}`}
                      </td>
                      <td style={{ padding: '0.65rem', border: '1px solid #cbd5e1', textAlign: 'left' }}>
                        <strong>{sub.name}</strong>
                      </td>
                      <td style={{ padding: '0.65rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>{max}</td>
                      <td style={{ padding: '0.65rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>{minPass}</td>
                      <td style={{ 
                        padding: '0.65rem', 
                        border: '1px solid #cbd5e1', 
                        textAlign: 'center',
                        fontWeight: 700,
                        color: subPass ? '#0f172a' : '#dc2626'
                      }}>
                        {obtained}
                      </td>
                      <td style={{ padding: '0.65rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>{subPct}%</td>
                      <td style={{ 
                        padding: '0.65rem', 
                        border: '1px solid #cbd5e1', 
                        textAlign: 'center',
                        fontWeight: 700,
                        color: subPass ? '#10b981' : '#dc2626'
                      }}>
                        {subPass ? 'PASS' : 'FAIL'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Assessment Summary Box */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '1rem', 
            background: '#f8fafc', 
            border: '1px solid #cbd5e1', 
            borderRadius: '8px', 
            padding: '1.25rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Marks</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                {calculation.totalObtained} / {calculation.totalMax}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Percentage</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: isPass ? '#2563eb' : '#dc2626' }}>
                {calculation.percentage}%
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Grade</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: gradeColor }}>
                {calculation.grade}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Final Result</span>
              <div style={{ 
                fontSize: '1.35rem', 
                fontWeight: 900, 
                color: isPass ? '#10b981' : '#dc2626' 
              }}>
                {calculation.status}
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div style={{ 
            background: '#f1f5f9', 
            borderLeft: '4px solid #2563eb', 
            padding: '0.85rem 1.25rem', 
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: '#334155',
            marginBottom: '2.5rem'
          }}>
            <strong>Evaluation Remarks: </strong>
            <span>{calculation.remarks}</span>
          </div>

          {/* Signatures */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginTop: '3.5rem',
            paddingTop: '1rem',
            fontSize: '0.825rem',
            color: '#475569'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '180px', borderTop: '1px solid #94a3b8', marginBottom: '0.35rem' }}></div>
              <span>Class In-charge / Faculty Advisor</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '180px', borderTop: '1px solid #94a3b8', marginBottom: '0.35rem' }}></div>
              <span>Head of Department</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '180px', borderTop: '1px solid #94a3b8', marginBottom: '0.35rem' }}></div>
              <span>Controller of Examinations</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
