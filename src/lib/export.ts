import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

export function downloadCsv<T>(rows: T[], filename: string) {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadPdf(title: string, head: string[], body: string[][], filename: string) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  autoTable(doc, {
    startY: 28,
    head: [head],
    body,
    styles: { fontSize: 9 },
  });
  doc.save(filename);
}
