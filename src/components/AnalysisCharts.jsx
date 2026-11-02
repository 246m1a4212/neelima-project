import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { calculateStudentResults } from '../utils/calculations';
import { getGradeColor } from '../utils/gradeCalculator';

export default function AnalysisCharts({ students = [], isDark = false }) {
  if (!students || students.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No academic records available to analyze. Add student records to generate graphical insights.
      </div>
    );
  }

  // 1. Pass vs Fail Analysis Data
  let passCount = 0;
  let failCount = 0;
  students.forEach((s) => {
    const calc = calculateStudentResults(s.subjects);
    if (calc.status === 'PASS') passCount++;
    else failCount++;
  });

  const passFailData = [
    { name: 'Passed', value: passCount, color: '#10b981' },
    { name: 'Failed', value: failCount, color: '#ef4444' }
  ];

  // 2. Grade Distribution Data
  const gradeCounts = { 'O': 0, 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
  students.forEach((s) => {
    const calc = calculateStudentResults(s.subjects);
    if (gradeCounts[calc.grade] !== undefined) {
      gradeCounts[calc.grade]++;
    } else {
      gradeCounts['F']++;
    }
  });

  const gradeDistributionData = Object.keys(gradeCounts).map((grade) => ({
    grade,
    count: gradeCounts[grade],
    color: getGradeColor(grade)
  }));

  // 3. Subject-wise Average Marks Comparison
  // Aggregate marks for all unique subjects across students
  const subjectMap = {};
  students.forEach((s) => {
    (s.subjects || []).forEach((sub) => {
      const name = sub.name || sub.code;
      if (!subjectMap[name]) {
        subjectMap[name] = { totalObtained: 0, totalMax: 0, count: 0, failCount: 0 };
      }
      const obtained = Number(sub.marks) || 0;
      const max = Number(sub.maxMarks) || 100;
      const minPass = Number(sub.minPassMarks) || 40;
      subjectMap[name].totalObtained += obtained;
      subjectMap[name].totalMax += max;
      subjectMap[name].count += 1;
      if (obtained < minPass) {
        subjectMap[name].failCount += 1;
      }
    });
  });

  const subjectPerformanceData = Object.keys(subjectMap).map((name) => {
    const item = subjectMap[name];
    const avgScore = item.count > 0 ? Number((item.totalObtained / item.count).toFixed(1)) : 0;
    return {
      subject: name.length > 14 ? name.substring(0, 14) + '...' : name,
      fullSubject: name,
      averageMarks: avgScore,
      failedStudents: item.failCount,
      totalAssessed: item.count
    };
  });

  // 4. Department-wise Performance Data
  const deptMap = {};
  students.forEach((s) => {
    const dept = s.department || 'General';
    if (!deptMap[dept]) {
      deptMap[dept] = { total: 0, pass: 0, totalPercentage: 0 };
    }
    const calc = calculateStudentResults(s.subjects);
    deptMap[dept].total += 1;
    if (calc.status === 'PASS') deptMap[dept].pass += 1;
    deptMap[dept].totalPercentage += calc.percentage;
  });

  const departmentPerformanceData = Object.keys(deptMap).map((dept) => {
    const d = deptMap[dept];
    const passRate = d.total > 0 ? Number(((d.pass / d.total) * 100).toFixed(1)) : 0;
    const avgPct = d.total > 0 ? Number((d.totalPercentage / d.total).toFixed(1)) : 0;
    return {
      department: dept,
      passRate,
      averagePercentage: avgPct,
      totalStudents: d.total
    };
  });

  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';

  return (
    <div className="charts-grid">
      {/* Chart 1: Pass vs Fail Analysis (Donut Chart) */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <h3 className="chart-title">Pass vs Fail Result Analysis</h3>
            <span className="chart-subtitle">Overall Academic Clearance Ratio</span>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: passCount > 0 ? 'var(--success)' : 'var(--danger)' }}>
            {students.length > 0 ? ((passCount / students.length) * 100).toFixed(1) : 0}% Pass Rate
          </span>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={passFailData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {passFailData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val, name) => [`${val} Students`, name]}
                contentStyle={{ background: isDark ? '#151e32' : '#ffffff', borderColor: isDark ? '#1e293b' : '#e2e8f0', borderRadius: '8px' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Grade Distribution Breakdown */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <h3 className="chart-title">Academic Grade Distribution</h3>
            <span className="chart-subtitle">Frequency of Grades (O through F)</span>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeDistributionData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="grade" stroke={axisColor} />
              <YAxis allowDecimals={false} stroke={axisColor} />
              <Tooltip 
                formatter={(val) => [`${val} Students`, 'Count']}
                contentStyle={{ background: isDark ? '#151e32' : '#ffffff', borderColor: isDark ? '#1e293b' : '#e2e8f0', borderRadius: '8px' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {gradeDistributionData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Subject-wise Marks Comparison */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <h3 className="chart-title">Subject-Wise Marks Comparison</h3>
            <span className="chart-subtitle">Average marks scored across all evaluated subjects</span>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectPerformanceData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis 
                dataKey="subject" 
                stroke={axisColor} 
                angle={-25} 
                textAnchor="end" 
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis domain={[0, 100]} stroke={axisColor} />
              <Tooltip 
                formatter={(val, name, item) => [
                  `${val} / 100 (Avg)`, 
                  item.payload.fullSubject
                ]}
                contentStyle={{ background: isDark ? '#151e32' : '#ffffff', borderColor: isDark ? '#1e293b' : '#e2e8f0', borderRadius: '8px' }}
              />
              <Bar dataKey="averageMarks" name="Average Marks" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Department-wise Pass Percentage Comparison */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <h3 className="chart-title">Department Performance Analysis</h3>
            <span className="chart-subtitle">Comparative Pass Rates and Average Percentages</span>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentPerformanceData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="department" stroke={axisColor} />
              <YAxis domain={[0, 100]} stroke={axisColor} unit="%" />
              <Tooltip 
                formatter={(val, name) => [`${val}%`, name]}
                contentStyle={{ background: isDark ? '#151e32' : '#ffffff', borderColor: isDark ? '#1e293b' : '#e2e8f0', borderRadius: '8px' }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Bar dataKey="passRate" name="Pass Rate (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="averagePercentage" name="Avg Percentage (%)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
