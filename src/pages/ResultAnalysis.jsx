import React, { useState } from 'react';
import { 
  BarChart3, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Filter, 
  FileText 
} from 'lucide-react';
import AnalysisCharts from '../components/AnalysisCharts';
import { calculateStudentResults } from '../utils/calculations';
import { getGradeColor } from '../utils/gradeCalculator';
import { DEPARTMENT_OPTIONS, SEMESTER_OPTIONS } from '../utils/sampleData';

export default function ResultAnalysis({ students = [], onViewMemo, isDark = false }) {
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSem, setSelectedSem] = useState('ALL');

  // Filter students based on selection
  const filteredStudents = students.filter((s) => {
    const matchesDept = selectedDept === 'ALL' || s.department === selectedDept;
    const matchesSem = selectedSem === 'ALL' || s.semester === selectedSem;
    return matchesDept && matchesSem;
  });

  // Calculate stats for filtered students
  let totalPass = 0;
  let totalFail = 0;
  let highestPercentage = 0;
  let topStudent = null;
  let lowestPercentage = 100;
  let totalPercentageSum = 0;

  const processedStudents = filteredStudents.map((s) => {
    const calc = calculateStudentResults(s.subjects);
    if (calc.status === 'PASS') {
      totalPass++;
    } else {
      totalFail++;
    }
    totalPercentageSum += calc.percentage;

    if (calc.percentage > highestPercentage) {
      highestPercentage = calc.percentage;
      topStudent = { ...s, calc };
    }
    if (calc.percentage < lowestPercentage) {
      lowestPercentage = calc.percentage;
    }

    return { ...s, calc };
  });

  const avgPercentage = filteredStudents.length > 0 
    ? Number((totalPercentageSum / filteredStudents.length).toFixed(1)) 
    : 0;
  const passRate = filteredStudents.length > 0 
    ? Number(((totalPass / filteredStudents.length) * 100).toFixed(1)) 
    : 0;

  // Top Achievers (sorted descending)
  const topAchievers = [...processedStudents]
    .filter((s) => s.calc.status === 'PASS')
    .sort((a, b) => b.calc.percentage - a.calc.percentage)
    .slice(0, 5);

  // Remedial Attention (Students with failures)
  const remedialStudents = [...processedStudents]
    .filter((s) => s.calc.status === 'FAIL')
    .sort((a, b) => b.calc.failedCount - a.calc.failedCount);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <BarChart3 size={28} color="var(--primary)" />
            <span>Academic Performance & Result Analysis</span>
          </h1>
          <p>Multi-dimensional analysis of student results, pass/fail trends, subject metrics, and grade distributions</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select 
            className="form-control" 
            style={{ width: 'auto', padding: '0.45rem 0.85rem' }}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENT_OPTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select 
            className="form-control" 
            style={{ width: 'auto', padding: '0.45rem 0.85rem' }}
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
          >
            <option value="ALL">All Semesters</option>
            {SEMESTER_OPTIONS.map((s) => (
              <option key={s} value={s}>Sem {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Analytics Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon-wrapper">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Assessed Batch</span>
            <span className="stat-value">{filteredStudents.length}</span>
            <span className="stat-subtext">Students in filter</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon-wrapper">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pass Rate</span>
            <span className="stat-value" style={{ color: 'var(--success)' }}>{passRate}%</span>
            <span className="stat-subtext">{totalPass} passed / {totalFail} failed</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon-wrapper">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Top Score</span>
            <span className="stat-value">{highestPercentage}%</span>
            <span className="stat-subtext">{topStudent ? topStudent.name : 'N/A'}</span>
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-icon-wrapper">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{avgPercentage}%</span>
            <span className="stat-subtext">Class mean</span>
          </div>
        </div>
      </div>

      {/* Interactive Charts Suite */}
      <AnalysisCharts students={filteredStudents} isDark={isDark} />

      {/* Two Column Layout: Top Performers & Remedial Students */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* Top Performers Card */}
        <div className="app-card">
          <div className="card-header">
            <h2 className="card-title">
              <Award size={20} color="var(--primary)" />
              <span>Top Academic Performers</span>
            </h2>
            <span className="dept-badge">Ranked</span>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student Name</th>
                  <th>Dept</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th style={{ textAlign: 'right' }}>Memo</th>
                </tr>
              </thead>
              <tbody>
                {topAchievers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No passing students in current filter.
                    </td>
                  </tr>
                ) : (
                  topAchievers.map((std, idx) => (
                    <tr key={std.id}>
                      <td>
                        <span style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          background: idx === 0 ? '#fbbf24' : idx === 1 ? '#cbd5e1' : '#b45309',
                          color: '#ffffff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 800
                        }}>
                          {idx + 1}
                        </span>
                      </td>
                      <td>
                        <strong>{std.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Roll {std.rollNumber}</div>
                      </td>
                      <td><span className="dept-badge">{std.department}</span></td>
                      <td><strong style={{ color: 'var(--primary)' }}>{std.calc.percentage}%</strong></td>
                      <td>
                        <span className="grade-pill" style={{ fontSize: '0.8rem', padding: '0.1rem 0.5rem', background: getGradeColor(std.calc.grade) }}>
                          {std.calc.grade}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn-icon" 
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => onViewMemo(std)}
                          title="View Marks Memo"
                        >
                          <FileText size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Remedial Intervention Needed Card */}
        <div className="app-card">
          <div className="card-header">
            <h2 className="card-title">
              <AlertTriangle size={20} color="var(--danger)" />
              <span>Remedial Attention Required (Failed)</span>
            </h2>
            <span className="status-badge fail">{remedialStudents.length} Students</span>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Failed Subjects</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {remedialStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--success)', padding: '2rem' }}>
                      <CheckCircle2 size={24} style={{ display: 'block', margin: '0 auto 0.5rem auto' }} />
                      <strong>Outstanding! Zero failures in this filter selection.</strong>
                    </td>
                  </tr>
                ) : (
                  remedialStudents.map((std) => (
                    <tr key={std.id} className="row-fail">
                      <td><strong>{std.rollNumber}</strong></td>
                      <td>
                        <strong>{std.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{std.department} Sem {std.semester}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {std.calc.failedSubjects.map((fs, i) => (
                            <span 
                              key={i} 
                              style={{ 
                                background: 'var(--danger-bg)', 
                                color: 'var(--danger)', 
                                border: '1px solid var(--danger-border)', 
                                padding: '0.1rem 0.4rem', 
                                borderRadius: '4px', 
                                fontSize: '0.75rem', 
                                fontWeight: 600 
                              }}
                            >
                              {fs.name}: {fs.marks}/{fs.maxMarks}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className="status-badge fail">FAIL</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn-icon" 
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => onViewMemo(std)}
                          title="View Marks Memo"
                        >
                          <FileText size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
