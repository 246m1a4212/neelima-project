import React from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Percent, 
  TrendingUp, 
  ArrowRight,
  UserPlus,
  FileSpreadsheet,
  Award
} from 'lucide-react';
import { calculateStudentResults } from '../utils/calculations';
import AnalysisCharts from './AnalysisCharts';

export default function Dashboard({ 
  students = [], 
  setActiveTab, 
  onViewMemo, 
  onExportCSV,
  isDark = false 
}) {
  // Aggregate calculations
  const totalStudents = students.length;
  
  let passedCount = 0;
  let failedCount = 0;
  let sumPercentage = 0;
  let totalSubjectEntries = 0;

  students.forEach((s) => {
    const calc = calculateStudentResults(s.subjects);
    if (calc.status === 'PASS') passedCount++;
    else failedCount++;
    sumPercentage += calc.percentage;
    totalSubjectEntries += (s.subjects ? s.subjects.length : 0);
  });

  const overallPassPercentage = totalStudents > 0 
    ? Number(((passedCount / totalStudents) * 100).toFixed(1)) 
    : 0;

  const averageStudentPercentage = totalStudents > 0 
    ? Number((sumPercentage / totalStudents).toFixed(1)) 
    : 0;

  // Recent 4 students
  const recentStudents = [...students].slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
      <div className="summary-banner">
        <div className="summary-banner-content">
          <h2>Student Result Analyzer & Academic Intelligence</h2>
          <p>
            Real-time marks computation, automated pass/fail determinations, custom grade scales, and institutional analytics for faculty and students.
          </p>
        </div>
        <div className="summary-banner-actions">
          <button className="btn btn-secondary" onClick={() => setActiveTab('add-student')}>
            <UserPlus size={16} />
            <span>Add Student</span>
          </button>
          <button className="btn btn-secondary" onClick={onExportCSV}>
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="stats-grid">
        {/* Total Students */}
        <div className="stat-card blue">
          <div className="stat-icon-wrapper">
            <Users size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Students</span>
            <span className="stat-value">{totalStudents}</span>
            <span className="stat-subtext">Active Enrolled Records</span>
          </div>
        </div>

        {/* Total Subjects Evaluated */}
        <div className="stat-card purple">
          <div className="stat-icon-wrapper">
            <BookOpen size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Subjects</span>
            <span className="stat-value">{totalSubjectEntries}</span>
            <span className="stat-subtext">Subject Marks Logged</span>
          </div>
        </div>

        {/* Passed Students */}
        <div className="stat-card green">
          <div className="stat-icon-wrapper">
            <CheckCircle2 size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Passed Students</span>
            <span className="stat-value" style={{ color: 'var(--success)' }}>
              {passedCount}
            </span>
            <span className="stat-subtext">Cleared All Subjects</span>
          </div>
        </div>

        {/* Failed Students */}
        <div className="stat-card red">
          <div className="stat-icon-wrapper">
            <XCircle size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Failed Students</span>
            <span className="stat-value" style={{ color: 'var(--danger)' }}>
              {failedCount}
            </span>
            <span className="stat-subtext">Arrears in &ge;1 Subject</span>
          </div>
        </div>

        {/* Overall Pass Percentage */}
        <div className="stat-card green">
          <div className="stat-icon-wrapper">
            <Percent size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pass Percentage</span>
            <span className="stat-value">{overallPassPercentage}%</span>
            <span className="stat-subtext">Batch Clearance Rate</span>
          </div>
        </div>

        {/* Average Student Percentage */}
        <div className="stat-card amber">
          <div className="stat-icon-wrapper">
            <TrendingUp size={26} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Batch Average</span>
            <span className="stat-value">{averageStudentPercentage}%</span>
            <span className="stat-subtext">Mean Academic Score</span>
          </div>
        </div>
      </div>

      {/* Pass vs Fail Progress Ribbon */}
      <div className="pass-fail-ribbon">
        <div className="ribbon-header">
          <div className="ribbon-title">
            <Award size={18} color="var(--primary)" />
            <span>Academic Clearance Ratio Overview</span>
          </div>
          <div className="ribbon-meta">
            {passedCount} Passed &bull; {failedCount} Failed &bull; Total {totalStudents} Students
          </div>
        </div>

        <div className="ribbon-bar">
          <div 
            className="ribbon-fill-pass" 
            style={{ width: `${overallPassPercentage}%` }}
            title={`Passed: ${overallPassPercentage}%`}
          />
          <div 
            className="ribbon-fill-fail" 
            style={{ width: `${100 - overallPassPercentage}%` }}
            title={`Failed: ${(100 - overallPassPercentage).toFixed(1)}%`}
          />
        </div>

        <div className="ribbon-legend">
          <div>
            <span className="legend-dot pass"></span>
            <span>Passed All Subjects ({overallPassPercentage}%)</span>
          </div>
          <div>
            <span className="legend-dot fail"></span>
            <span>Failed One or More Subjects ({(100 - overallPassPercentage).toFixed(1)}%)</span>
          </div>
        </div>
      </div>

      {/* Graphical Representations of Academic Performance */}
      <AnalysisCharts students={students} isDark={isDark} />

      {/* Recent Results Preview */}
      <div className="app-card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h2 className="card-title">
            <Award size={20} color="var(--primary)" />
            <span>Recent Student Evaluations</span>
          </h2>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '0.825rem', padding: '0.35rem 0.75rem' }}
            onClick={() => setActiveTab('records')}
          >
            <span>View All Records</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Department</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Marks Memo</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((std) => {
                const calc = calculateStudentResults(std.subjects);
                const isPass = calc.status === 'PASS';
                return (
                  <tr key={std.id}>
                    <td><strong>{std.rollNumber}</strong></td>
                    <td>{std.name}</td>
                    <td><span className="dept-badge">{std.department}</span></td>
                    <td><strong>{calc.percentage}%</strong></td>
                    <td><span className="grade-pill" style={{ fontSize: '0.8rem', padding: '0.1rem 0.5rem' }}>{calc.grade}</span></td>
                    <td>
                      <span className={`status-badge ${isPass ? 'pass' : 'fail'}`}>
                        {calc.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.775rem' }}
                        onClick={() => onViewMemo(std)}
                      >
                        View Memo
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
