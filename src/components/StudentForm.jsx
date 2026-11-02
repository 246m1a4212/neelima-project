import React from 'react';
import { User, Hash, Bookmark, BookOpen, Calendar, GraduationCap } from 'lucide-react';
import { DEPARTMENT_OPTIONS, SEMESTER_OPTIONS, YEAR_OPTIONS } from '../utils/sampleData';

export default function StudentForm({ formData, setFormData, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="app-card">
      <div className="card-header">
        <h2 className="card-title">
          <User size={20} color="var(--primary)" />
          <span>Student Information</span>
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>* Required fields</span>
      </div>

      <div className="form-grid">
        {/* Student Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="studentName">
            <span>Student Name <span className="required">*</span></span>
          </label>
          <input
            id="studentName"
            name="name"
            type="text"
            className={`form-control ${errors.name ? 'has-error' : ''}`}
            placeholder="e.g. Rahul Kumar"
            value={formData.name || ''}
            onChange={handleChange}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        {/* Roll Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="rollNumber">
            <span>Roll Number <span className="required">*</span></span>
          </label>
          <input
            id="rollNumber"
            name="rollNumber"
            type="text"
            className={`form-control ${errors.rollNumber ? 'has-error' : ''}`}
            placeholder="e.g. 101"
            value={formData.rollNumber || ''}
            onChange={handleChange}
          />
          {errors.rollNumber && <span className="form-error">{errors.rollNumber}</span>}
        </div>

        {/* Register Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="registerNumber">
            <span>Register Number</span>
          </label>
          <input
            id="registerNumber"
            name="registerNumber"
            type="text"
            className="form-control"
            placeholder="e.g. 21CSE101"
            value={formData.registerNumber || ''}
            onChange={handleChange}
          />
        </div>

        {/* Department */}
        <div className="form-group">
          <label className="form-label" htmlFor="department">
            <span>Department <span className="required">*</span></span>
          </label>
          <select
            id="department"
            name="department"
            className="form-control"
            value={formData.department || 'CSE'}
            onChange={handleChange}
          >
            {DEPARTMENT_OPTIONS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Year of Study */}
        <div className="form-group">
          <label className="form-label" htmlFor="yearOfStudy">
            <span>Year of Study</span>
          </label>
          <select
            id="yearOfStudy"
            name="yearOfStudy"
            className="form-control"
            value={formData.yearOfStudy || '3'}
            onChange={handleChange}
          >
            {YEAR_OPTIONS.map((yr) => (
              <option key={yr} value={yr}>Year {yr}</option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div className="form-group">
          <label className="form-label" htmlFor="semester">
            <span>Semester</span>
          </label>
          <select
            id="semester"
            name="semester"
            className="form-control"
            value={formData.semester || '3-1'}
            onChange={handleChange}
          >
            {SEMESTER_OPTIONS.map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
