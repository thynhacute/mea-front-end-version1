import * as React from 'react';

import * as XLSX from 'xlsx';

interface CTAExportXLSXTableProps {
  fileName: string;
  children?: React.ReactNode;
  data: any[];
}

const CTAExportXLSXCustom: React.FC<CTAExportXLSXTableProps> = ({ fileName, children, data }) => {
  const exportToXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const json = XLSX.utils.sheet_to_json(ws, { header: 1, skipHidden: true }) as any[][];

    const newJson = XLSX.utils.sheet_to_json(ws, { header: json[0], skipHidden: false }) as any[][];

    const ws2 = XLSX.utils.json_to_sheet(newJson as any[][], {
      skipHeader: true,
    });

    // set column width 20
    ws2['!cols'] = [];
    for (let i = 0; i < json[0].length; i++) {
      ws2['!cols'].push({ width: 20 });
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws2, 'Sheet 1');

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <div className="cursor-pointer" onClick={exportToXLSX}>
      {children}
    </div>
  );
};

export default CTAExportXLSXCustom;
