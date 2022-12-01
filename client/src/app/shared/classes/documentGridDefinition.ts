import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ValueFormatterParams } from 'ag-grid-community';
import { ExcelData } from '../interfaces';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { dataFormatter } from '../utils/grid-utils';

const PDF_HEADER_COLOR = '#e8e8e8';
const PDF_INNER_BORDER_COLOR = '#b2b2b2';
const PDF_OUTER_BORDER_COLOR = '#888888';
const PDF_PAGE_ORITENTATION = 'landscape';
const PDF_WITH_TITLE = false;
const PDF_WITH_FOOTER = true;
const PDF_HEADER_HEIGHT = 25;
const PDF_ROW_HEIGHT = 15;
const PDF_ODD_BKG_COLOR = '#fcfcfc';
const PDF_EVEN_BKG_COLOR = '#ffffff';
const PDF_PAGE_SIZE = 'A4';
const PDF_PAGE_WIDTH = 700;
const PDF_FONT_SIZE = 8;

export class DocumentGridDefinition {
  data: ExcelData;
  document!: TDocumentDefinitions;
  pageSize: any | undefined;

  private headerArr: string[] = [];
  private subHeaderArr: string[] = [];

  constructor(data: ExcelData) {
    this.data = data;

    dayjs.extend(customParseFormat);

    this.init();
  }

  public getDocument(): TDocumentDefinitions {
    return this.document;
  }

  private init() {
    this.document = {
      footer: this.footer,
      header: this.title,
      pageSize: PDF_PAGE_SIZE,
      pageOrientation: PDF_PAGE_ORITENTATION,
      content: this.content(),
      defaultStyle: {
        font: 'Roboto',
        fontSize: PDF_FONT_SIZE,
      },
      styles: {
        myTable: {
          margin: [0, 0, 0, 0],
        },
        tableHeader: {
          bold: true,
          margin: [0, PDF_HEADER_HEIGHT / 3, 0, 0],
        },
        tableCell: {
          margin: [0, 15, 0, 0],
        },
      },
      pageMargins: [20, 30, 20, 30],
    };
  }

  private footer = (currentPage: number, pageCount: number): any[] => {
    return [
      {
        text: PDF_WITH_FOOTER
          ? `Страница ${currentPage.toString()} из ${pageCount}`
          : '',
        alignment: 'center',
        margin: [10, 5, 10, 30],
      },
    ];
  };

  private title = (): any[] => {
    return [
      {
        text: PDF_WITH_TITLE ? this.data.title || '' : '',
        alignment: 'center',
        fontSize: 15,
        bold: true,
        margin: [10, 20, 10, 20],
      },
    ];
  };

  private content(): any[] {
    const headerRowsNumber = this.columnGroupsToExport() ? 2 : 1;

    const widths = this.getExportedColumnsWidths();

    const parts = this.deliverToParts(widths);

    const heights = (rowIndex: number) => {
      return rowIndex < headerRowsNumber ? PDF_HEADER_HEIGHT : PDF_ROW_HEIGHT;
    };

    return parts.map((part, index) => {
      let rowsPart, headerPart, bodyPart, widthPart, lastPage;

      if (index + 1 < parts.length) {
        rowsPart = this.rowsFromData(part, parts[index + 1]);
        headerPart = this.headerRows(part, parts[index + 1]);
        bodyPart = [...headerPart, ...rowsPart];
        widthPart = widths.slice(part, parts[index + 1]);
      } else {
        rowsPart = this.rowsFromData(part);
        headerPart = this.headerRows(part);
        bodyPart = [...headerPart, ...rowsPart];
        widthPart = widths.slice(part, widths.length + 1);
        lastPage = true;
      }

      const contentPart = {
        style: 'myTable',
        table: {
          headerRows: headerRowsNumber,
          widths: widthPart,
          body: bodyPart,
          heights,
        },
        layout: {
          fillColor: this.fillColor,
          hLineWidth: this.hLineWidth,
          vLineWidth: this.vLineWidth,
          hLineColor: this.hLineColor,
          vLineColor: this.vLineColor,
        },
      };
      if (!lastPage) {
        Object.assign(contentPart, { pageBreak: 'after' });
      }
      return contentPart;
    });
  }

  private fillColor = (rowIndex: number, node: any) => {
    if (rowIndex < node.table.headerRows) {
      return PDF_HEADER_COLOR;
    }
    return rowIndex % 2 === 0 ? PDF_ODD_BKG_COLOR : PDF_EVEN_BKG_COLOR;
  };

  private hLineWidth = (i: number, node: any) => {
    return i === 0 || i === node.table.body.length ? 1 : 1;
  };

  private vLineWidth = (i: number, node: any) =>
    i === 0 || i === node.table.widths.length ? 1 : 1;

  private hLineColor = (i: number, node: any) =>
    i === 0 || i === node.table.body.length
      ? PDF_OUTER_BORDER_COLOR
      : PDF_INNER_BORDER_COLOR;

  private vLineColor = (i: number, node: any) =>
    i === 0 || i === node.table.widths.length
      ? PDF_OUTER_BORDER_COLOR
      : PDF_INNER_BORDER_COLOR;

  private columnGroupsToExport() {
    this.data.cols.map((col) => {
      const value = col.name || '';
      const arr = value.split('|');
      this.headerArr.push(arr[0]);
      this.subHeaderArr.push(arr[1]);
    });
    return !this.isEmpty(this.subHeaderArr);
  }

  private isEmpty(arr: string[]): boolean {
    return !(arr.filter((i) => i).length > 0);
  }

  private getExportedColumnsWidths() {
    return this.data.cols.map((col) => col.size * 5);
  }

  private rowsFromData(start: number = 0, end: number = 0): any[] {
    return this.data.rows.map((row) => {
      const fullRow = this.data.cols.map((col) => {
        let text;
        if (!(row[col.key] === null || row[col.key] === undefined)) {
          text = dataFormatter(
            <ValueFormatterParams>{ value: row[col.key] },
            col.format,
            col.type
          );
        } else {
          text = '';
        }

        return {
          text,
          styles: 'tableCell',
        };
      });

      if (end === 0) {
        end = fullRow.length + 1;
      }
      return fullRow.slice(start, end);
    });
  }

  private deliverToParts(widths: number[]): number[] {
    const parts: number[] = [0];
    let sum = 0;
    widths.forEach((i, index) => {
      sum = sum + i * 1.1;
      if (sum > PDF_PAGE_WIDTH) {
        parts.push(index - 1);
        sum = 0;
      }
    });

    return parts;
  }

  private headerRows(start: number, end: number = 0): any[] {
    const header = this.headerArr.slice(
      start,
      end === 0 ? this.headerArr.length + 1 : end
    );

    if (this.isEmpty(this.subHeaderArr)) {
      const headerPart = header.map((name) => ({
        text: name,
        style: 'tableHeader',
        alignment: 'center',
      }));
      return [headerPart];
    } else {
      const subHeader = this.subHeaderArr.slice(
        start,
        end === 0 ? this.subHeaderArr.length + 1 : end
      );

      //const group =

      const subHeaderPart = subHeader.map((name) => ({
        text: name,
        style: 'tableHeader',
        alignment: 'center',
      }));

      const group: any[] = [];
      let rowSpan: number = 1;
      let colSpan: number = 1;
      for (let i = 0; i < header.length; i++) {
        if (!subHeader[i]) {
          rowSpan = 2;
        } else {
          rowSpan = 1;
        }
        if (header[i] === header[i + 1]) {
          colSpan++;
        } else {
          const col = {
            text: header[i],
            style: 'tableHeader',
            alignment: 'center',
          };
          if (rowSpan > 1) {
            Object.assign(col, { rowSpan });
          }
          if (colSpan > 1) {
            Object.assign(col, { colSpan });
          }
          group.push(col);
          for (let k = 0; k < colSpan - 1; k++) {
            group.push({});
          }
          colSpan = 1;
        }
      }

      return [group, subHeaderPart];
    }
  }
}
