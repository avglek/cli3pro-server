import { Injectable } from '@angular/core';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { dataFormatter } from '../utils/grid-utils';
import { ValueFormatterParams } from 'ag-grid-community';
import { checkFileName, checkWorkSheetName } from '../utils/str-utils';

export interface ExcelData {
  cols: ExcelCol[];
  rows: any[];
  title: string;
}

export interface ExcelCol {
  name: string;
  key: string;
  size: number;
  type?: string;
  format?: string | null;
  order: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  get fontSize(): number {
    return this._fontSize;
  }

  set fontSize(value: number) {
    this._fontSize = value;
  }

  private worksheet!: ExcelJS.Worksheet;
  private workbook!: ExcelJS.Workbook;

  private _fontSize!: number;

  constructor() {}

  async toExcel(data: ExcelData, fileName: string) {
    this.workbook = new ExcelJS.Workbook();
    this._fontSize = 14;
    this.worksheet = this.workbook.addWorksheet(
      checkWorkSheetName(data.title.slice(0, 30)),
      {
        headerFooter: {
          firstHeader: checkWorkSheetName(data.title),
          firstFooter: '',
        },
      }
    );

    this.worksheet.columns = data.cols
      .sort((a, b) => a.order - b.order)
      .map((col) => {
        let len;
        if (col.size) {
          len = col.size > col.name.length ? col.size : col.name.length + 2;
        } else {
          len = col.name.length + 2;
        }

        len = (len * this._fontSize) / 11;
        return {
          header: col.name,
          key: col.key,
          width: len,
          style: { font: { size: this._fontSize } },
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
      this.worksheet.addRow(newRow);
    });

    this.formatBody();
    this.formatHeader();

    this.worksheet.views = [{ showGridLines: false }];

    const buffer = await this.workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], { type: 'application/octet-stream' }),
      `${checkFileName(fileName)}.xlsx`
    );
  }
  private isEmptyArray(arr: string[]): boolean {
    const filtr = arr.filter((el) => !!el);
    return !(filtr.length > 0);
  }

  private formatHeader() {
    const rowTitle = this.worksheet.getRow(1);

    const row1: string[] = [];
    const row2: string[] = [];

    rowTitle.eachCell((cell) => {
      const value = <string>cell.value?.valueOf() || '';
      const arr = value.split('|');
      row1.push(arr[0]);
      row2.push(arr[1]);
    });

    if (!this.isEmptyArray(row2)) {
      this.worksheet.spliceRows(1, 1);
      this.worksheet.insertRow(1, row1);
      this.worksheet.insertRow(2, row2);

      const r1: string[] = [];
      this.worksheet.getRow(1).eachCell((cell) => {
        r1.push(<string>cell.value);
      });

      const r2: string[] = [];
      this.worksheet.getRow(2).eachCell((cell) => {
        r2.push(<string>cell.value);
      });

      const countCols = this.worksheet.actualColumnCount;
      let mergeCol: number[] = [];

      for (let i = 0; i < countCols; i++) {
        if (!this.worksheet.getCell(2, i + 1).value) {
          this.worksheet.mergeCells(1, i + 1, 2, i + 1);
        }
        if (i < countCols) {
          const cellA = this.worksheet.getCell(1, i + 1);
          const cellB = this.worksheet.getCell(1, i + 2);
          if (cellA.value === cellB.value) {
            mergeCol.push(i + 1);
          } else {
            if (!cellA.isMerged) {
              this.worksheet.mergeCells(1, mergeCol[0], 1, i + 1);
              mergeCol = [];
            }
          }
        }
      }

      const rowSubTitle = this.worksheet.getRow(2);
      rowSubTitle.alignment = { vertical: 'middle', horizontal: 'center' };
      rowSubTitle.height = 32;
      rowSubTitle.font = { bold: true, size: this._fontSize };
      rowSubTitle.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }

    rowTitle.alignment = { vertical: 'middle', horizontal: 'center' };
    rowTitle.height = 32;
    rowTitle.font = { bold: true, size: this._fontSize };
    rowTitle.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  }

  private formatBody() {
    const countCols = this.worksheet.actualColumnCount;

    for (let i = 0; i < countCols; i++) {
      const cols = this.worksheet.getColumn(i + 1);
      cols.eachCell((cell) => {
        cell.alignment = { wrapText: true, ...cell.alignment };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }
  }
}
