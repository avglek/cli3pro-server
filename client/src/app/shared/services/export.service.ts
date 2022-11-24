import { Injectable } from '@angular/core';
import { DialogService } from './dialog.service';
import { ExcelData, ExcelService } from './excel.service';
import { ICursorData} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor(
    private dialogService: DialogService,
    private excelService: ExcelService
  ) {}

  toExcel(data: ICursorData, title?: string) {
    const excelData: ExcelData = {
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
    this.excelService.toExcel(excelData, title || 'export');
  }
  toCsv(data: any) {
    console.log('to Csv:', data);
  }
  toPdf(data: any) {
    console.log('to pdf:', data);
  }
}
