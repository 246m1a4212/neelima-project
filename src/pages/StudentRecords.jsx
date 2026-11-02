import React from 'react';
import { Users, UserPlus, FileSpreadsheet } from 'lucide-react';
import StudentTable from '../components/StudentTable';

export default function StudentRecords({ 
  students = [], 
  setActiveTab, 
  onViewMemo, 
  onEditStudent, 
  onDeleteStudent,
  onExportCSV,
  searchQuery
}) {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Users size={28} color="var(--primary)" />
            <span>Student Academic Records Management</span>
          </h1>
          <p>Search, filter, edit, delete, and inspect student marks records with automated pass/fail results</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onExportCSV}>
            <FileSpreadsheet size={16} />
            <span>Export to CSV</span>
          </button>
          <button className="btn btn-primary" onClick={() => setActiveTab('add-student')}>
            <UserPlus size={16} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      <StudentTable
        students={students}
        onViewMemo={onViewMemo}
        onEditStudent={onEditStudent}
        onDeleteStudent={onDeleteStudent}
        initialSearch={searchQuery}
      />
    </div>
  );
}
