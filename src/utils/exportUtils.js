/**
 * Export and Download Utilities
 * Generates CSV spreadsheets and PDF Marks Memos
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculateStudentResults } from './calculations';

/**
 * Exports all provided students to a CSV spreadsheet
 */
export function exportStudentsToCSV(students) {
  if (!students || students.length === 0) {
    alert('No student records available to export.');
    return;
  }

  const headers = [
    'Roll Number',
    'Student Name',
    'Register Number',
    'Department',
    'Year',
    'Semester',
    'Total Obtained',
    'Total Maximum',
    'Percentage (%)',
    'Grade',
    'Status',
    'Failed Subjects Count',
    'Failed Subject Names',
    'Remarks'
  ];

  const rows = students.map((std) => {
    const calc = calculateStudentResults(std.subjects);
    const failedNames = calc.failedSubjects.map(s => s.name).join('; ');
    return [
      `"${std.rollNumber}"`,
      `"${std.name}"`,
      `"${std.registerNumber || 'N/A'}"`,
      `"${std.department}"`,
      `"${std.yearOfStudy}"`,
      `"${std.semester}"`,
      calc.totalObtained,
      calc.totalMax,
      calc.percentage,
      `"${calc.grade}"`,
      `"${calc.status}"`,
      calc.failedCount,
      `"${failedNames}"`,
      `"${calc.remarks.replace(/"/g, '""')}"`
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Student_Results_Batch_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads an attractive Student Marks Memo PDF
 */
export function generateStudentPDF(student, calculation, institution = 'Apex Institute of Technology & Engineering') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [37, 99, 235]; // Royal Blue
  const darkColor = [30, 41, 59]; // Slate 800
  const passColor = [16, 185, 129]; // Emerald
  const failColor = [239, 68, 68]; // Crimson Red

  // Header Banner
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 26, 'F');

  // Institution Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(institution.toUpperCase(), 105, 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('ACADEMIC MARKS MEMORANDUM & RESULT ASSESSMENT', 105, 19, { align: 'center' });

  // Student Details Panel
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 32, 182, 34, 3, 3, 'FD');

  doc.setTextColor(...darkColor);
  doc.setFontSize(9);

  // Column 1
  doc.setFont('helvetica', 'bold');
  doc.text('Student Name:', 20, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(student.name || 'N/A', 52, 40);

  doc.setFont('helvetica', 'bold');
  doc.text('Roll Number:', 20, 48);
  doc.setFont('helvetica', 'normal');
  doc.text(student.rollNumber || 'N/A', 52, 48);

  doc.setFont('helvetica', 'bold');
  doc.text('Register No:', 20, 56);
  doc.setFont('helvetica', 'normal');
  doc.text(student.registerNumber || 'N/A', 52, 56);

  // Column 2
  doc.setFont('helvetica', 'bold');
  doc.text('Department:', 110, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(student.department || 'N/A', 140, 40);

  doc.setFont('helvetica', 'bold');
  doc.text('Year of Study:', 110, 48);
  doc.setFont('helvetica', 'normal');
  doc.text(`Year ${student.yearOfStudy || 'N/A'}`, 140, 48);

  doc.setFont('helvetica', 'bold');
  doc.text('Semester:', 110, 56);
  doc.setFont('helvetica', 'normal');
  doc.text(student.semester || 'N/A', 140, 56);

  // Subject Table
  const tableData = (student.subjects || []).map((s, index) => {
    const obtained = Number(s.marks) || 0;
    const max = Number(s.maxMarks) || 100;
    const minPass = Number(s.minPassMarks) || 40;
    const isPass = obtained >= minPass;
    const pct = max > 0 ? ((obtained / max) * 100).toFixed(1) : '0';

    return [
      (index + 1).toString(),
      s.code || `SUB${index + 1}`,
      s.name,
      max.toString(),
      minPass.toString(),
      obtained.toString(),
      `${pct}%`,
      isPass ? 'PASS' : 'FAIL'
    ];
  });

  autoTable(doc, {
    startY: 72,
    head: [['S.No', 'Code', 'Subject Name', 'Max', 'Min Pass', 'Obtained', 'Percent', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 8.5
    },
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 3,
      halign: 'center'
    },
    columnStyles: {
      2: { halign: 'left' } // Subject name left-aligned
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 7) {
        if (data.cell.raw === 'FAIL') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [16, 185, 129];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 8;

  // Calculation Summary Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, finalY, 182, 38, 3, 3, 'FD');

  // Stats Grid
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);

  doc.text('Total Maximum Marks:', 20, finalY + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(calculation.totalMax.toString(), 68, finalY + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('Total Marks Obtained:', 20, finalY + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(calculation.totalObtained.toString(), 68, finalY + 16);

  doc.setFont('helvetica', 'bold');
  doc.text('Overall Percentage:', 20, finalY + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(`${calculation.percentage}%`, 68, finalY + 24);

  doc.setFont('helvetica', 'bold');
  doc.text('Average Marks:', 20, finalY + 32);
  doc.setFont('helvetica', 'normal');
  doc.text(calculation.averageMarks.toString(), 68, finalY + 32);

  // Grade & Status in right column
  doc.setFont('helvetica', 'bold');
  doc.text('Assigned Grade:', 105, finalY + 8);
  doc.setFontSize(11);
  doc.setTextColor(37, 99, 235);
  doc.text(calculation.grade, 145, finalY + 8);

  doc.setFontSize(8.5);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Final Result Status:', 105, finalY + 18);

  const isOverallPass = calculation.status === 'PASS';
  doc.setFillColor(...(isOverallPass ? [220, 252, 231] : [254, 226, 226]));
  doc.setDrawColor(...(isOverallPass ? passColor : failColor));
  doc.roundedRect(144, finalY + 13, 26, 7, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(...(isOverallPass ? passColor : failColor));
  doc.text(calculation.status, 157, finalY + 18, { align: 'center' });

  // Subject breakdown info
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`Subjects Passed: ${calculation.passedCount}  |  Subjects Failed: ${calculation.failedCount}`, 105, finalY + 30);

  // Remarks Panel
  const remarksY = finalY + 44;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, remarksY, 182, 14, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Performance Remarks:', 18, remarksY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const splitRemarks = doc.splitTextToSize(calculation.remarks, 172);
  doc.text(splitRemarks, 18, remarksY + 10);

  // Footer Signatures & Date
  const footerY = 265;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Date of Result Generation: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, footerY);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.line(14, footerY + 12, 60, footerY + 12);
  doc.text('Faculty Advisor / Class In-charge', 14, footerY + 16);

  doc.line(150, footerY + 12, 196, footerY + 12);
  doc.text('Controller of Examinations', 150, footerY + 16);

  // Save the PDF
  doc.save(`MarksMemo_${student.rollNumber}_${student.name.replace(/\s+/g, '_')}.pdf`);
}
