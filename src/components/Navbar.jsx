import React from 'react';
import { 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  PlusCircle, 
  GraduationCap,
  Bell
} from 'lucide-react';

export default function Navbar({ 
  theme, 
  toggleTheme, 
  isSidebarCollapsed, 
  setIsSidebarCollapsed, 
  searchQuery, 
  setSearchQuery,
  setActiveTab
}) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button 
          className="btn-icon" 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="navbar-search">
          <Search size={18} className="search-icon" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search student by name or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="btn-icon" 
              style={{ width: '24px', height: '24px', fontSize: '12px' }}
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <button 
          className="btn btn-primary"
          onClick={() => setActiveTab('add-student')}
        >
          <PlusCircle size={17} />
          <span>Add Student</span>
        </button>

        <button 
          className="btn-icon"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={19} color="#fbbf24" /> : <Moon size={19} color="#6366f1" />}
        </button>
      </div>
    </header>
  );
}
