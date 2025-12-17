'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Column {
    header: string;
    accessorKey: string;
}

interface DownloadPdfButtonProps {
    title: string;
    columns: Column[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    fileName?: string;
}

export default function DownloadPdfButton({ title, columns, data, fileName = 'reporte' }: DownloadPdfButtonProps) {
    const handleDownload = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text(title, 14, 22);
        doc.setFontSize(10);
        doc.text(`Generado el: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);

        // Prepare table data
        const tableData = data.map((row) =>
            columns.map((col) => {
                // Handle nested properties (e.g., doctor.nombre)
                const keys = col.accessorKey.split('.');
                let value = row;
                for (const key of keys) {
                    value = value ? value[key] : '';
                }
                return value || '';
            })
        );

        // Add table
        autoTable(doc, {
            head: [columns.map((col) => col.header)],
            body: tableData,
            startY: 40,
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [6, 182, 212], // Cyan-500
                textColor: 255,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
        });

        doc.save(`${fileName}.pdf`);
    };

    return (
        <button
            onClick={handleDownload}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
            </svg>
            Descargar PDF
        </button>
    );
}
