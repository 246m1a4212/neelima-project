import React from 'react';
import { Plus, Trash2, BookOpen, AlertCircle, Sparkles, RotateCcw } from 'lucide-react';

export default function MarksEntry({ 
  subjects, 
  setSubjects, 
  errors = {}, 
  defaultMinPassMarks = 40,
  defaultMaxMarks = 100 
}) {
  const handleSubjectChange = (id, field, value) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return { ...s, [field]: value };
        }
        return s;
      })
    );
  };

  const addSubject = () => {
    const newId = 'subj-' + Date.now();
    const count = subjects.length + 1;
    setSubjects((prev) => [
      ...prev,
      {
        id: newId,
        name: `Subject ${count}`,
        code: `SUB${count}`,
        maxMarks: defaultMaxMarks,
        minPassMarks: defaultMinPassMarks,
        marks: ''
      }
    ]);
  };

  const removeSubject = (id) => {
    if (subjects.length <= 1) {
      alert('At least one subject must be present.');
      return;
    }
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const resetAllMarks = () => {
    setSubjects((prev) =>
      prev.map((s) => ({
        ...s,
        marks: ''
      }))
    );
  };

  const loadPreset = (type) => {
    if (type === 'CSE') {
      setSubjects([
        { id: 'p1', name: 'Mathematics', code: 'MA301', maxMarks: 100, minPassMarks: 40, marks: 85 },
        { id: 'p2', name: 'Data Structures', code: 'CS302', maxMarks: 100, minPassMarks: 40, marks: 78 },
        { id: 'p3', name: 'DBMS', code: 'CS303', maxMarks: 100, minPassMarks: 40, marks: 65 },
        { id: 'p4', name: 'Operating Systems', code: 'CS304', maxMarks: 100, minPassMarks: 40, marks: 32 },
        { id: 'p5', name: 'Computer Networks', code: 'CS305', maxMarks: 100, minPassMarks: 40, marks: 88 }
      ]);
    } else if (type === 'ECE') {
      setSubjects([
        { id: 'p1', name: 'Digital Signal Processing', code: 'EC301', maxMarks: 100, minPassMarks: 40, marks: 75 },
        { id: 'p2', name: 'Microcontrollers', code: 'EC302', maxMarks: 100, minPassMarks: 40, marks: 70 },
        { id: 'p3', name: 'VLSI Design', code: 'EC303', maxMarks: 100, minPassMarks: 40, marks: 68 },
        { id: 'p4', name: 'Antenna Wave Propagation', code: 'EC304', maxMarks: 100, minPassMarks: 40, marks: 62 },
        { id: 'p5', name: 'Embedded Systems', code: 'EC305', maxMarks: 100, minPassMarks: 40, marks: 80 }
      ]);
    } else if (type === 'IT') {
      setSubjects([
        { id: 'p1', name: 'Web Engineering', code: 'IT301', maxMarks: 100, minPassMarks: 40, marks: 84 },
        { id: 'p2', name: 'Cloud Computing', code: 'IT302', maxMarks: 100, minPassMarks: 40, marks: 82 },
        { id: 'p3', name: 'Information Security', code: 'IT303', maxMarks: 100, minPassMarks: 40, marks: 79 },
        { id: 'p4', name: 'Software Testing', code: 'IT304', maxMarks: 100, minPassMarks: 40, marks: 72 },
        { id: 'p5', name: 'Data Mining', code: 'IT305', maxMarks: 100, minPassMarks: 40, marks: 80 }
      ]);
    }
  };

  return (
    <div className="app-card">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 className="card-title">
          <BookOpen size={20} color="var(--primary)" />
          <span>Subject-Wise Marks Entry</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            ({subjects.length} subjects)
          </span>
        </h2>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Load Preset:</span>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              onClick={() => loadPreset('CSE')}
              title="Load CSE Sample Subjects (Rahul Kumar scenario)"
            >
              CSE (Rahul)
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              onClick={() => loadPreset('ECE')}
            >
              ECE
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              onClick={() => loadPreset('IT')}
            >
              IT
            </button>
          </div>

          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            onClick={resetAllMarks}
            title="Clear all entered marks"
          >
            <RotateCcw size={14} />
            <span>Reset Marks</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary" 
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
            onClick={addSubject}
          >
            <Plus size={15} />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Dynamic Subjects List */}
      <div className="subjects-list">
        {subjects.map((subj, index) => {
          const obtained = Number(subj.marks);
          const max = Number(subj.maxMarks) || 100;
          const minPass = Number(subj.minPassMarks) || 40;
          const hasEnteredMarks = subj.marks !== '' && !isNaN(obtained);
          const isFailed = hasEnteredMarks && obtained < minPass;
          const isExceeded = hasEnteredMarks && (obtained > max || obtained < 0);

          return (
            <div 
              key={subj.id || index} 
              className={`subject-entry-card ${isFailed ? 'is-failed' : ''}`}
            >
              <div className="subject-row-grid">
                {/* Subject Name */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>
                    <span>Subject #{index + 1} Name</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Mathematics"
                    value={subj.name}
                    onChange={(e) => handleSubjectChange(subj.id, 'name', e.target.value)}
                  />
                </div>

                {/* Subject Code */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>
                    <span>Code</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. MA301"
                    value={subj.code}
                    onChange={(e) => handleSubjectChange(subj.id, 'code', e.target.value)}
                  />
                </div>

                {/* Maximum Marks */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>
                    <span>Max Marks</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    className="form-control"
                    value={subj.maxMarks}
                    onChange={(e) => handleSubjectChange(subj.id, 'maxMarks', e.target.value)}
                  />
                </div>

                {/* Minimum Passing Marks */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>
                    <span>Min Pass</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={subj.maxMarks}
                    className="form-control"
                    value={subj.minPassMarks}
                    onChange={(e) => handleSubjectChange(subj.id, 'minPassMarks', e.target.value)}
                  />
                </div>

                {/* Obtained Marks */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>
                    <span>Obtained Marks <span style={{ color: 'var(--danger)' }}>*</span></span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={subj.maxMarks}
                    className={`form-control ${isFailed || isExceeded ? 'has-error' : ''}`}
                    placeholder="Marks"
                    value={subj.marks}
                    onChange={(e) => handleSubjectChange(subj.id, 'marks', e.target.value)}
                  />
                </div>

                {/* Actions & Subject Status Chip */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '4px' }}>
                  {hasEnteredMarks && (
                    <span 
                      className={`status-badge ${isFailed ? 'fail' : 'pass'}`}
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                    >
                      {isFailed ? 'FAIL' : 'PASS'}
                    </span>
                  )}

                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => removeSubject(subj.id)}
                    title="Remove this subject"
                    style={{ color: 'var(--danger)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Inline warning for exceeded marks or fail condition */}
              {isExceeded && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertCircle size={14} />
                  <span>Obtained marks cannot exceed maximum marks ({max}) or be negative.</span>
                </div>
              )}
              {isFailed && !isExceeded && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertCircle size={14} />
                  <span>Marks ({obtained}) are below minimum pass mark ({minPass}). This subject is marked FAIL.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {errors.subjects && (
        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-sm)', color: 'var(--danger-text)', fontSize: '0.85rem' }}>
          {errors.subjects}
        </div>
      )}
    </div>
  );
}
