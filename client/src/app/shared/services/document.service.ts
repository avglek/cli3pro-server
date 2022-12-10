import { Injectable} from '@angular/core';
import { TabDataService } from './tab-data.service';
import { IDesc, IDescParam, ITabData} from '../interfaces';
import { DataServerService } from './data-server.service';
import { CommonService } from './common.service';
import { parseTemplate, toCamelCase } from '../utils/str-utils';
import dayjs from 'dayjs';
import { paramsToObject } from '../utils/data-utils';

export interface DocumentParams {
  key: string;
  value: any;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  params: DocumentParams[] = [];
  rowData: { [key: string]: any } = {};
  owner: string = '';
  currentTab: ITabData | undefined;

  constructor(
    private tabService: TabDataService,
    private dataService: DataServerService,
    private commonService: CommonService
  ) {
    this.owner = this.commonService.getCurrentOwner() || '';

    this.tabService.currentTabs.subscribe((tab) => {
      this.currentTab = tab;
    });
  }

  openNew(
    docId: number,
    colId: string,
    rowData: { [key: string]: any } = {},
    parentId: number = 0
  ) {
    this.rowData = rowData;

    const tab: ITabData = {
      uid: '',
      docId: docId,
      title: `Документ № ${docId}`,
      isLoading: true,
    };
    const uid = this.tabService.add(tab);

    this.dataService.getDesc(this.owner, docId).subscribe({
      next: (data) => {
        let isForm;
        let title;
        if (data.description.docId === 86) {
          isForm = this.hintDictionary(data, parentId, colId);
        } else {
          isForm = this.insertValue(colId, data.params);

          if (!isForm) {
            const params = paramsToObject(data.params || []);
            title = parseTemplate(data.description.docTitle, {
              ...this.rowData,
              ...params,
            });
          }
        }
        const newTab: ITabData = {
          uid,
          docId: tab.docId,
          title: title || data.description.docName,
          template: data.description.docTitle,
          description: data.description,
          procName: data.procName,
          params: data.params,
          isForm,
          reportType: data.description.docClass,
          isSuccess: true,
          isLoading: false,
          owner: this.owner,
          isEdit: false,
        };
        this.tabService.update(newTab);
      },
      error: (err) => {
        console.log(err.error);
        const newTab: ITabData = {
          uid,
          docId: tab.docId,
          title: 'Ошибка запроса',
          isSuccess: false,
          isLoading: false,
          errorMessage: err.error.message,
        };
        this.tabService.update(newTab);
      },
    });
  }

  private insertValue(colId: string, params: IDescParam[]): boolean {
    let check = false;
    params
      .filter((param) => param.inOut === 'IN')
      .forEach((param) => {
        if (colId === toCamelCase(param.fieldName)) {
          switch (param.dataType) {
            case 'DATE':
              param.value = dayjs(this.rowData[colId]).format('MM-DD-YYYY');
              break;
            default:
              param.value = this.rowData[colId];
          }
        } else {
          check = true;
        }
      });

    return check;
  }

  hintDictionary(data: IDesc, parentId: number, colId: string): boolean {
    const params = data.params.filter((i) => i.inOut === 'IN');
    console.log('data:', params);
    console.log(parentId, this.rowData, colId);
    params.forEach((param) => {
      switch (param.argumentName) {
        case 'P_DOC_ID':
          param.value = parentId;
          break;
        case 'P_FIELD_NAME':
          param.value = colId.toUpperCase();
          break;
        case 'P_KEY_VALUE':
          const key = colId.replace('m', 'k');
          param.value = this.rowData[key];
          break;
      }
    });
    console.log(params);
    return false;
  }
}
