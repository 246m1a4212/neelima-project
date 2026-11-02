# Student Result Analyzer 🎓📊

A modern, responsive, and full-featured academic marks calculation and pass/fail result analysis web application built using **React JS**, **Vite**, **CSS3**, **Lucide React**, and **Recharts**.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)

---

## ✨ Features

- **Dashboard**: Batch overview with KPI cards for Total Students, Total Subjects, Passed Students, Failed Students, Clearance Percentage, and Batch Mean Percentage.
- **Pass or Fail Analysis**:
  - Automatically assesses each subject against its minimum passing marks.
  - If a student fails in even one subject, their overall status is **FAIL** (highlighted in red with a list of failed subjects).
  - If all subjects are cleared, status is **PASS** (highlighted in emerald green).
- **Marks & Grade Computation**:
  - Automatically calculates Total Obtained, Total Maximum Marks, Overall Percentage, and Average Marks.
  - Grade System: **O** (90–100%), **A+** (80–89%), **A** (70–79%), **B** (60–69%), **C** (50–59%), **D** (40–49%), and **F** (<40%).
- **Interactive Recharts Visualizations**:
  - Pass vs Fail Donut Chart
  - Academic Grade Distribution Column Chart
  - Subject-Wise Marks Comparison Bar Chart
  - Department Pass Rate Comparison Chart
- **Dynamic Subject Management**:
  - Add or remove subjects dynamically on the fly.
  - Quick presets for CSE, ECE, and IT curriculums.
  - Validates marks to prevent negative values or scores exceeding maximum marks.
- **Official Marks Memorandum (PDF & Print)**:
  - Generate and download vector-quality Marks Memo PDFs via `jsPDF` and `jspdf-autotable`.
  - Browser print stylesheets for clean paper printing.
  - Batch export to CSV spreadsheet.
- **Student Records Management**:
  - Search by Student Name or Roll Number.
  - Filter by Department (`CSE`, `IT`, `ECE`, `MECH`, etc.), Semester, and Pass/Fail status.
  - Edit student details and delete records with modal confirmation.
- **Configurable Settings**:
  - Customize grading scale boundaries and grade letters.
  - Customize institution name for reports.
  - Local Storage synchronization for offline persistence and demo resets.
- **Theme**: Dark and Light mode toggle with glassmorphism design.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: CSS3, Modern CSS Tokens, Glassmorphism
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **PDF Generation**: jsPDF, jspdf-autotable
- **Storage**: Browser Local Storage

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd "neelima project of fsd"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000/
   ```

### Production Build

To build the project for production:
```bash
npm run build
```
The optimized bundle will be created in the `dist/` directory.

---

## 👤 Author

Developed for Academic Project Demonstration.
- Email: `246m1a4207@bvcr.edu.in`
