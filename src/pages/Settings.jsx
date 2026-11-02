import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  RotateCcw, 
  Trash2, 
  Building, 
  Award, 
  Sliders, 
  CheckCircle2,
  Database
} from 'lucide-react';
import { DEFAULT_GRADING_SCALE } from '../utils/gradeCalculator';

export default function Settings({ 
  settings, 
  onSaveSettings, 
  onResetSampleData, 
  onClearAllData 
}) {
  const [formData, setFormData] = useState({
    institutionName: settings.institutionName || 'Apex Institute of Technology & Engineering',
    defaultMinPassMarks: settings.defaultMinPassMarks ?? 40,
    defaultMaxMarks: settings.defaultMaxMarks ?? 100,
    gradingScale: settings.gradingScale ? JSON.parse(JSON.stringify(settings.gradingScale)) : DEFAULT_GRADING_SCALE
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleScaleChange = (index, field, value) => {
    const updated = [...formData.gradingScale];
    updated[index] = { ...updated[index], [field]: Number(value) || value };
    setFormData((prev) => ({ ...prev, gradingScale: updated }));
  };

  const handleResetGradingScale = () => {
    setFormData((prev) => ({
      ...prev,
      gradingScale: JSON.parse(JSON.stringify(DEFAULT_GRADING_SCALE))
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <SettingsIcon size={28} color="var(--primary)" />
            <span>Academic Configuration & Settings</span>
          </h1>
          <p>Configure institution details, customizable grading scales, default passing thresholds, and storage</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 1: Institution Details */}
        <div className="app-card">
          <div className="card-header">
            <h2 className="card-title">
              <Building size={20} color="var(--primary)" />
              <span>Institution & Assessment Defaults</span>
            </h2>
          </div>

          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">
                <span>College / Institution Name (Displays on Marks Memo & PDF)</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                placeholder="e.g. Apex Institute of Technology & Engineering"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Default Passing Marks</span>
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                className="form-control"
                value={formData.defaultMinPassMarks}
                onChange={(e) => setFormData({ ...formData, defaultMinPassMarks: Number(e.target.value) })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Default minimum required marks to pass a subject</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Default Maximum Marks</span>
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                className="form-control"
                value={formData.defaultMaxMarks}
                onChange={(e) => setFormData({ ...formData, defaultMaxMarks: Number(e.target.value) })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standard maximum marks per subject</span>
            </div>
          </div>
        </div>

        {/* Section 2: Configurable Grading System */}
        <div className="app-card">
          <div className="card-header">
            <h2 className="card-title">
              <Award size={20} color="var(--primary)" />
              <span>Configurable Academic Grading System</span>
            </h2>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              onClick={handleResetGradingScale}
            >
              <RotateCcw size={14} />
              <span>Reset to Standard Grading</span>
            </button>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Adjust the minimum percentage boundary for each grade letter. The application recalculates all student grades in real-time.
          </p>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Grade Letter</th>
                  <th>Descriptor / Classification</th>
                  <th>Min Percentage (%)</th>
                  <th>Max Percentage (%)</th>
                  <th>Grade Points (GPA)</th>
                </tr>
              </thead>
              <tbody>
                {formData.gradingScale.map((item, idx) => (
                  <tr key={item.grade}>
                    <td>
                      <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: item.color }}>
                        {item.grade}
                      </strong>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                        value={item.label}
                        onChange={(e) => handleScaleChange(idx, 'label', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-control"
                        style={{ width: '100px', padding: '0.35rem 0.65rem' }}
                        value={item.min}
                        onChange={(e) => handleScaleChange(idx, 'min', e.target.value)}
                      />
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {item.max !== undefined ? `${item.max}%` : '100%'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{item.gpa}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Changes Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            <Save size={18} />
            <span>Save Configuration</span>
          </button>
          {savedSuccess && (
            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} />
              <span>Settings successfully updated!</span>
            </span>
          )}
        </div>
      </form>

      {/* Section 3: Data Management & Reset Options */}
      <div className="app-card" style={{ borderColor: 'var(--border-color)' }}>
        <div className="card-header">
          <h2 className="card-title">
            <Database size={20} color="var(--primary)" />
            <span>Data Storage & Demo Reset</span>
          </h2>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Manage your browser Local Storage records. You can reload the sample batch containing the Rahul Kumar CSE pass/fail scenario anytime.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onResetSampleData}
          >
            <RotateCcw size={16} />
            <span>Reload Sample Academic Records</span>
          </button>

          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={onClearAllData}
          >
            <Trash2 size={16} />
            <span>Clear All Student Records</span>
          </button>
        </div>
      </div>
    </div>
  );
}
