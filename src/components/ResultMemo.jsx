import React from 'react';
import { Download, Printer, X, GraduationCap, Award, CheckCircle, XCircle } from 'lucide-react';
import { calculateStudentResults } from '../utils/calculations';
import { getGradeColor } from '../utils/gradeCalculator';
import { generateStudentPDF } from '../utils/exportUtils';

export default function ResultMemo({ 
  student, 
  institution = 'Apex Institute of Technology & Engineering',
  onClose 
}) {
  if (!student) return null;

  const calculation = calculateStudentResults(student.subjects);
  const isPass = calculation.status === 'PASS';
  const gradeColor = getGradeColor(calculation.grade);
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    generateStudentPDF(student, calculation, institution);
  };

  return (
    <div className="modal-backdrop no-print-backdrop">
      <div className="modal-content" style={{ maxWidth: '850px' }}>
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Academic Marks Memorandum</h3>
          </div>
          <button className="btn-icon" onClick={onClose} title="Close Memo">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ background: '#f8fafc', padding: '1.5rem' }}>
          {/* Printable Memo Sheet Container */}
          <div className="marks-memo-sheet" id="printable-memo">
            {/* Watermark */}
            <div className="memo-watermark">{calculation.status}</div>

            {/* Institution Header */}
            <div className="memo-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <GraduationCap size={28} color="#2563eb" />
                <h1 className="memo-institution">{institution}</h1>
              </div>
              <p className="memo-subhead">Autonomous Institution &bull; Accredited with 'A+' Grade by NAAC &bull; Approved by AICTE</p>
              <div className="memo-doc-title">OFFICIAL GRADE REPORT & MARKS MEMORANDUM</div>
            </div>

            {/* Student Metadata Box */}
            <div style={{ 
              background: '#f1f5f9', 
              border: '1px solid #cbd5e1', 
              borderRadius: '8px', 
              padding: '1rem 1.25rem', 
              marginBottom: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.65rem 1.5rem',
              fontSize: '0.875rem'
            }}>
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Student Name: </span>
                <strong style={{ color: '#0f172a' }}>{student.name}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Department: </span>
                <strong style={{ color: '#0f172a' }}>{student.department}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Roll Number: </span>
                <strong style={{ color: '#0f172a' }}>{student.rollNumber}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Year & Semester: </span>
                <strong style={{ color: '#0f172a' }}>Year {student.yearOfStudy} (Sem {student.semester})</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Register Number: </span>
                <strong style={{ color: '#0f172a' }}>{student.registerNumber || 'N/A'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Examination Date: </span>
                <strong style={{ color: '#0f172a' }}>{today}</strong>
              </div>
            </div>

            {/* Subject-Wise Marks Breakdown Table */}
            <div style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#2563eb', color: '#ffffff' }}>
                    <th style={{ padding: '0.65rem', border: '1px solid #1d4ed8', textAlign: 'center' }}>S.No</th>
                    <th style={{ padding: '0.65rem', border: '1px solid #1d4ed8', textAlign: 'center' }}>Code</th>
                    <th style={{ padding: '0.65rem', border: '1px solid #1d4ed8', textAlign: 'left' }}>Subject Title</th>
                    <th style={{ padding: '0.65rem', border: '1px solid #1d4ed8', textAlign: 'center' }}>Max Marks</th>
                    <th style={{ padding: '0.65rem', border: '1px solid #1d4ed8', textAlign: 'center' }}>Min Pass</th>
                    <th style={{ padding: '0.65rem', border: '1px solid #1d4ed8', textAlign: 'center' }}>Obtained</th>
                    <th style={{ padding: '0.65rem', border: '1px solid #1d4ed8', textAlign: 'center' }}>%</th>
                    <th style={{ padding: '0.65rem', border: '1px solid #1d4ed8', textAlign: 'center' }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {student.subjects.map((sub, idx) => {
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
                        <td style={{ padding: '0.6rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ padding: '0.6rem', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 600 }}>
                          {sub.code || `SUB${idx + 1}`}
                        </td>
                        <td style={{ padding: '0.6rem', border: '1px solid #cbd5e1', textAlign: 'left' }}>
                          <strong>{sub.name}</strong>
                        </td>
                        <td style={{ padding: '0.6rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>{max}</td>
                        <td style={{ padding: '0.6rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>{minPass}</td>
                        <td style={{ 
                          padding: '0.6rem', 
                          border: '1px solid #cbd5e1', 
                          textAlign: 'center',
                          fontWeight: 700,
                          color: subPass ? '#0f172a' : '#dc2626'
                        }}>
                          {obtained}
                        </td>
                        <td style={{ padding: '0.6rem', border: '1px solid #cbd5e1', textAlign: 'center' }}>{subPct}%</td>
                        <td style={{ 
                          padding: '0.6rem', 
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

            {/* Calculations and Final Assessment Summary */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '0.75rem', 
              background: '#f8fafc', 
              border: '1px solid #cbd5e1', 
              borderRadius: '8px', 
              padding: '1rem',
              marginBottom: '1.25rem',
              textAlign: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Marks</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {calculation.totalObtained} / {calculation.totalMax}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Percentage</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isPass ? '#2563eb' : '#dc2626' }}>
                  {calculation.percentage}%
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Grade</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: gradeColor }}>
                  {calculation.grade}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Final Result</span>
                <div style={{ 
                  fontSize: '1.15rem', 
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
              padding: '0.75rem 1rem', 
              borderRadius: '4px',
              fontSize: '0.825rem',
              color: '#334155',
              marginBottom: '2rem'
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
              fontSize: '0.8rem',
              color: '#475569'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '180px', borderTop: '1px solid #94a3b8', marginBottom: '0.35rem' }}></div>
                <span>Class In-charge / Advisor</span>
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
        </div>

        <div className="modal-footer no-print">
          <button type="button" className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Sheet</span>
          </button>
          <button type="button" className="btn btn-primary" onClick={handleDownload}>
            <Download size={16} />
            <span>Download PDF</span>
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
