import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Edit3, 
  Calculator, 
  BarChart3, 
  Users, 
  Download, 
  Settings, 
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed,
  studentCount
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-student', label: 'Add Student', icon: UserPlus },
    { id: 'marks-entry', label: 'Marks Entry', icon: Edit3 },
    { id: 'calculate', label: 'Calculate Results', icon: Calculator },
    { id: 'analysis', label: 'Result Analysis', icon: BarChart3 },
    { id: 'records', label: 'Student Records', icon: Users, badge: studentCount },
    { id: 'reports', label: 'Download Reports', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon-box">
            <GraduationCap size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-title">ResultAnalyzer</span>
            <span className="brand-sub">Academic Portal</span>
          </div>
        </div>

        <button 
          className="btn-icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          style={{ width: '32px', height: '32px' }}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} className="nav-icon" />
              <span className="nav-text">{item.label}</span>
              {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span 
                  style={{
                    marginLeft: 'auto',
                    background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--primary-light)',
                    color: isActive ? '#ffffff' : 'var(--primary)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            <span>v1.0.0 &bull; React & Vite</span>
          </div>
        )}
      </div>
    </aside>
  );
}
