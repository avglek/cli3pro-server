import { Injectable } from '@angular/core';
import { DialogService } from './dialog.service';
import { ExportDialogComponent } from '../../components/dialogs/export-dialog/export-dialog.component';
import { ExcelData, ExcelService } from './excel.service';
import { ICursorData, IData } from '../interfaces';

/***************
 *           data={{
 *             title: data.title,
 *             rows: data.data.outdata[0].value.filterRows,
 *             col: data.data.outdata[0].value.columns,
 *           }}
 * {
 *     "P_DOC": {
 *         "fields": [
 *             {
 *                 "fieldName": "code",
 *                 "docId": 0,
 *                 "fieldKind": 0,
 *                 "displayLabel": "Группа",
 *                 "displaySize": 7,
 *                 "controlType": 0,
 *                 "defaultValue": null,
 *                 "itemList": null,
 *                 "readonly": "F",
 *                 "lookupTable": null,
 *                 "visible": "T",
 *                 "lookupKeyfields": "CODE",
 *                 "required": "F",
 *                 "lookupTableorder": null,
 *                 "lookupResultfield": null,
 *                 "displayFormat": null,
 *                 "footerFunc": null,
 *                 "frozeColumn": "F",
 *                 "keyField": null,
 *                 "moveDlg": "T",
 *                 "lookupDisplayfields": null,
 *                 "nciTable": null,
 *                 "disableSort": "F",
 *                 "options": null,
 *                 "editMask": null,
 *                 "dlgClass": null,
 *                 "calcClass": null,
 *                 "groupedFields": null,
 *                 "validClass": null,
 *                 "lookupMasterfield": null,
 *                 "funcClass": null,
 *                 "titleHint": null,
 *                 "paramVisible": "T",
 *                 "order": 2,
 *                 "dbTypeName": "CHAR",
 *                 "meta": {
 *                     "name": "CODE",
 *                     "fetchType": 2001,
 *                     "dbType": 2003,
 *                     "dbTypeName": "CHAR",
 *                     "nullable": true,
 *                     "byteSize": 4
 *                 }
 *             }

 *         ],
 *         "rows": [
 *             {
 *                 "nv": "96690730",
 *                 "subgr": "КН  ",
 *                 "code": "0017",
 *                 "msso": "ЯРОСЛАВЛЬ-ГЛ",
 *                 "ksso": "31000",
 *                 "mopv": "ПВТП",
 *                 "kopv": "82",
 *                 "dt": "2022-03-02T15:50:00.000Z",
 *                 "np": "3224",
 *                 "ip": "30510+068+31000",
 *                 "nneisp": "Нарушение/ослабление торцевого крепления подшипника в корпусе буксы",
 *                 "kneisp": "0159",
 *                 "probeg": 24843,
 *                 "msnv": "ЧЕРЕПОВЕЦ II",
 *                 "ksnv": "30250",
 *                 "mg": "СТАЛЬ ",
 *                 "kg": "32416",
 *                 "wg": 0
 *             }
 *         ],
 *         "count": 43,
 *         "type": "cursor"
 *     }
 * }
 */

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor(
    private dialogService: DialogService,
    private excelService: ExcelService
  ) {}

  toExcel(data: ICursorData, title?: string) {
    console.log('to excel:', data);
    const dialog = this.dialogService.open(ExportDialogComponent, {
      data: title,
    });

    dialog.afterClosed().subscribe((fname) => {
      const excelData: ExcelData = {
        cols: data.fields
          .filter((item) => item.visible === 'T')
          .map((item) => ({
            name: item.displayLabel || '',
            key: item.fieldName || '',
            type: item.dbTypeName,
            format: item.displayFormat,
            order: item.order || 0,
          })),
        rows: data.rows,
        title: title || '',
      };
      this.excelService.toExcel(excelData, fname);
    });
  }
  toCsv(data: any) {
    console.log('to Csv:', data);
  }
  toPdf(data: any) {
    console.log('to pdf:', data);
  }
}
