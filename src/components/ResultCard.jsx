import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  Percent, 
  FileText, 
  Download, 
  Printer, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getGradeColor } from '../utils/gradeCalculator';

export default function ResultCard({ 
  calculation, 
  studentName = 'Student', 
  onViewMemo, 
  onDownloadPDF 
}) {
  const isPass = calculation.status === 'PASS';
  const gradeColor = getGradeColor(calculation.grade);

  useEffect(() => {
    // Trigger celebratory confetti if Outstanding grade achieved and passed
    if (isPass && calculation.grade === 'O') {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback if canvas is unavailable
      }
    }
  }, [calculation.grade, isPass]);

  return (
    <div className="result-card animate-fade-in">
      {/* Pass / Fail Banner */}
      <div className={`result-card-banner ${isPass ? 'pass' : 'fail'}`}>
        <div className="banner-status-box">
          {isPass ? (
            <CheckCircle2 size={48} strokeWidth={2.5} />
          ) : (
            <XCircle size={48} strokeWidth={2.5} />
          )}
          <div>
            <div className="banner-status-badge">{calculation.status}</div>
            <div className="banner-sub">
              {isPass 
                ? 'Academic Assessment Criteria Successfully Cleared' 
                : 'Failed to meet minimum passing marks criteria in 1 or more subjects'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Assigned Grade</span>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
              <span 
                className="grade-pill" 
                style={{ 
                  background: isPass ? gradeColor : 'var(--danger)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                }}
              >
                {calculation.grade}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Numerical Metrics Summary */}
      <div className="result-metrics-grid">
        <div className="result-metric-item">
          <span className="label">Total Marks Obtained</span>
          <span className="val" style={{ color: isPass ? 'var(--text-main)' : 'var(--danger)' }}>
            {calculation.totalObtained}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              /{calculation.totalMax}
            </span>
          </span>
        </div>

        <div className="result-metric-item">
          <span className="label">Overall Percentage</span>
          <span className="val" style={{ color: isPass ? 'var(--primary)' : 'var(--danger)' }}>
            {calculation.percentage}%
          </span>
        </div>

        <div className="result-metric-item">
          <span className="label">Average Marks</span>
          <span className="val">{calculation.averageMarks}</span>
        </div>

        <div className="result-metric-item">
          <span className="label">Subjects Passed / Failed</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
            <span className="status-badge pass" style={{ fontSize: '0.85rem' }}>
              {calculation.passedCount} Passed
            </span>
            <span className="status-badge fail" style={{ fontSize: '0.85rem' }}>
              {calculation.failedCount} Failed
            </span>
          </div>
        </div>
      </div>

      {/* Failed Subjects Highlight Box if any failed */}
      {calculation.failedCount > 0 && (
        <div className="failed-subjects-box">
          <div className="failed-subjects-header">
            <AlertTriangle size={18} />
            <span>
              Failed Subjects ({calculation.failedCount}): Action Required
            </span>
          </div>
          <div className="failed-tags-list">
            {calculation.failedSubjects.map((sub, idx) => (
              <span key={idx} className="failed-tag">
                <strong>{sub.name}</strong> ({sub.marks}/{sub.maxMarks} &bull; Min Pass: {sub.minPassMarks})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Performance Assessment Remarks */}
      <div className="remarks-box">
        <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
          Academic Assessment & Remarks:
        </strong>
        <span>{calculation.remarks}</span>
      </div>

      {/* Quick Action Footer */}
      {(onViewMemo || onDownloadPDF) && (
        <div style={{ padding: '1rem 2rem', background: 'var(--bg-card-subtle)', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
          {onViewMemo && (
            <button type="button" className="btn btn-secondary" onClick={onViewMemo}>
              <FileText size={16} />
              <span>View Marks Memo</span>
            </button>
          )}
          {onDownloadPDF && (
            <button type="button" className="btn btn-primary" onClick={onDownloadPDF}>
              <Download size={16} />
              <span>Download PDF Memo</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
