import React from 'react';
import Dashboard from '../components/Dashboard';

export default function Home({ students, setActiveTab, onViewMemo, onExportCSV, isDark }) {
  return (
    <div className="page-container">
      <Dashboard
        students={students}
        setActiveTab={setActiveTab}
        onViewMemo={onViewMemo}
        onExportCSV={onExportCSV}
        isDark={isDark}
      />
    </div>
  );
}
