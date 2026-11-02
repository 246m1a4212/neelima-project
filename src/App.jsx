import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import AddStudent from './pages/AddStudent';
import CalculateResults from './pages/CalculateResults';
import ResultAnalysis from './pages/ResultAnalysis';
import StudentRecords from './pages/StudentRecords';
import DownloadReports from './pages/DownloadReports';
import Settings from './pages/Settings';
import ResultMemo from './components/ResultMemo';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';

import { 
  getStudents, 
  deleteStudent, 
  resetToSampleData, 
  clearAllStudents, 
  getSettings, 
  saveSettings,
  getStoredTheme,
  setStoredTheme
} from './utils/storage';
import { exportStudentsToCSV } from './utils/exportUtils';

import './styles/App.css';
import './styles/Dashboard.css';
import './styles/Components.css';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(getStoredTheme);

  // Layout state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data state
  const [students, setStudents] = useState(getStudents);
  const [settings, setSettingsState] = useState(getSettings);

  // Modals state
  const [memoStudent, setMemoStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setStoredTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Handlers
  const handleStudentAddedOrUpdated = (msg) => {
    setStudents(getStudents());
    setEditingStudent(null);
    setActiveTab('records');
    showToast(msg, 'success');
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setActiveTab('add-student');
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteStudent(deleteTarget.id);
    setStudents(getStudents());
    showToast(`Deleted student record ${deleteTarget.name}`, 'info');
    setDeleteTarget(null);
  };

  const handleExportCSV = () => {
    exportStudentsToCSV(students);
    showToast('Batch records exported to CSV', 'success');
  };

  const handleSaveSettings = (newSettings) => {
    const saved = saveSettings(newSettings);
    setSettingsState(saved);
    showToast('Settings saved successfully', 'success');
  };

  const handleResetSampleData = () => {
    const res = resetToSampleData();
    setStudents(res);
    showToast('Reloaded sample student records', 'info');
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all student records? This cannot be undone.')) {
      clearAllStudents();
      setStudents([]);
      showToast('All student records cleared', 'error');
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (editingStudent && tab !== 'add-student') {
            setEditingStudent(null);
          }
          setActiveTab(tab);
        }}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        studentCount={students.length}
      />

      {/* Main Wrapper */}
      <div className={`main-content-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Navbar */}
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (q && activeTab !== 'records') {
              setActiveTab('records');
            }
          }}
          setActiveTab={setActiveTab}
        />

        {/* Dynamic Pages */}
        <main>
          {activeTab === 'dashboard' && (
            <Home
              students={students}
              setActiveTab={setActiveTab}
              onViewMemo={(s) => setMemoStudent(s)}
              onExportCSV={handleExportCSV}
              isDark={theme === 'dark'}
            />
          )}

          {activeTab === 'add-student' && (
            <AddStudent
              onSuccess={handleStudentAddedOrUpdated}
              editingStudent={editingStudent}
              onCancelEdit={() => {
                setEditingStudent(null);
                setActiveTab('records');
              }}
              defaultMinPassMarks={settings.defaultMinPassMarks}
              defaultMaxMarks={settings.defaultMaxMarks}
            />
          )}

          {activeTab === 'marks-entry' && (
            <CalculateResults
              students={students}
              onViewMemo={(s) => setMemoStudent(s)}
              defaultMinPassMarks={settings.defaultMinPassMarks}
              defaultMaxMarks={settings.defaultMaxMarks}
            />
          )}

          {activeTab === 'calculate' && (
            <CalculateResults
              students={students}
              onViewMemo={(s) => setMemoStudent(s)}
              defaultMinPassMarks={settings.defaultMinPassMarks}
              defaultMaxMarks={settings.defaultMaxMarks}
            />
          )}

          {activeTab === 'analysis' && (
            <ResultAnalysis
              students={students}
              onViewMemo={(s) => setMemoStudent(s)}
              isDark={theme === 'dark'}
            />
          )}

          {activeTab === 'records' && (
            <StudentRecords
              students={students}
              setActiveTab={setActiveTab}
              onViewMemo={(s) => setMemoStudent(s)}
              onEditStudent={handleEditStudent}
              onDeleteStudent={(s) => setDeleteTarget(s)}
              onExportCSV={handleExportCSV}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'reports' && (
            <DownloadReports
              students={students}
              institution={settings.institutionName}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onResetSampleData={handleResetSampleData}
              onClearAllData={handleClearAllData}
            />
          )}
        </main>
      </div>

      {/* Marks Memo Modal */}
      {memoStudent && (
        <ResultMemo
          student={memoStudent}
          institution={settings.institutionName}
          onClose={() => setMemoStudent(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Student Record"
        message={deleteTarget ? `Are you sure you want to permanently delete the academic record for ${deleteTarget.name} (Roll No: ${deleteTarget.rollNumber})? This action cannot be undone.` : ''}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
