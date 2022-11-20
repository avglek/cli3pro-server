import { Injectable } from '@angular/core';
import { defer, Observable, Subject } from 'rxjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import { dataFormatter } from '../utils/grid-utils';
import { ValueFormatterParams } from 'ag-grid-community';

export interface ExcelData {
  cols: ExcelCol[];
  rows: any[];
  title: string;
}

export interface ExcelCol {
  name: string;
  key: string;
  size?: number;
  type?: string;
  format?: string | null;
  order: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  async toExcel(data: ExcelData, fileName: string) {
    console.log('excel data', data);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(data.title.slice(0, 30), {
      headerFooter: { firstHeader: data.title, firstFooter: '' },
    });

    const fontSize = 14;
    worksheet.columns = data.cols
      .sort((a, b) => a.order - b.order)
      .map((col) => {
        let len;
        if (col.size) {
          len = col.size > col.name.length ? col.size : col.name.length + 2;
        } else {
          len = col.name.length + 2;
        }

        len = (len * fontSize) / 11;
        return {
          header: col.name,
          key: col.key,
          width: len,
          style: { font: { size: fontSize } },
        };
      });
    data.rows.forEach((row) => {
      const newRow = data.cols
        .sort((a, b) => a.order - b.order)
        .map((col) => {
          //const colType = col.type;
          const colValue = row[col.key];
          if (col.type === 'DATE') {
            if (row[col.key]) {
              return dataFormatter(
                <ValueFormatterParams>{ value: row[col.key] },
                col.format,
                col.type
              );
            } else {
              return '';
            }
          }
          //return colType === 'r8' ? Number.parseInt(colValue) : colValue;
          return colValue;
        });
      worksheet.addRow(newRow);
    });

    const rowTitle = worksheet.getRow(1);
    rowTitle.alignment = { vertical: 'middle', horizontal: 'center' };
    rowTitle.height = 32;
    rowTitle.font = { bold: true, size: fontSize };

    const countCols = worksheet.actualColumnCount;

    for (let i = 0; i < countCols; i++) {
      const cols = worksheet.getColumn(i + 1);
      cols.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], { type: 'application/octet-stream' }),
      `${fileName}.xlsx`
    );
  }
}
