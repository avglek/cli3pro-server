import { Injectable } from '@angular/core';
import { DialogService } from './dialog.service';
import { ExcelService } from './excel.service';
import { ExcelData, ICursorData } from '../interfaces';
import { PdfService } from './pdf.service';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor(
    private dialogService: DialogService,
    private excelService: ExcelService,
    private pdfService: PdfService
  ) {}

  toExcelData(data: ICursorData, title: string = ''): ExcelData {
    return {
      cols: data.fields
        .filter((item) => item.visible === 'T')
        .map((item) => ({
          name: item.displayLabel || '',
          key: item.fieldName || '',
          type: item.dbTypeName,
          format: item.displayFormat,
          order: item.order || 0,
          size: item.displaySize || 0,
        })),
      rows: data.rows,
      title: title || '',
    };
  }

  async toExcel(data: ICursorData, title: string = '') {
    await this.excelService.toExcel(
      this.toExcelData(data, title),
      title || 'export'
    );
  }

  async toCsv(data: ICursorData, title: string = '') {
    await this.excelService.toExcel(
      this.toExcelData(data, title),
      title || 'export',
      true
    );
  }

  toPdf(data: ICursorData, title: string = '') {
    const excelData = this.toExcelData(data, title);
    this.pdfService.downloadGridPdf(excelData, title || 'export');
  }

  printPdf(data: ICursorData, title: string = '') {
    const excelData = this.toExcelData(data, title);
    this.pdfService.printGridPdf(excelData);
  }
}
