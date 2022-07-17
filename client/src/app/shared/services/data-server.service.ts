import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IData, IDesc, IProcParam } from '../interfaces';
import { Observable } from 'rxjs';
import { Common } from '../classes/common';

@Injectable({
  providedIn: 'root',
})
export class DataServerService {
  constructor(private http: HttpClient, private common: Common) {}

  getDesc(owner: string, id: number): Observable<IDesc> {
    const url = `/api/desc/${owner}/${id}`;
    return this.http.get<IDesc>(url);
  }

  procExecute(
    procName: string,
    params: IProcParam[],
    uid: string,
    docId: number
  ): Observable<IData> {
    const outParams = params.map((param) => {
      if (param.type === 'DATE') {
        return {
          ...param,
          value: param.value.toString(),
        };
      } else {
        return param;
      }
    });
    const url = `/api/proc/${
      this.common.owner
    }/${procName}?params=${JSON.stringify(
      outParams
    )}&uid=${uid}&docId=${docId}`;

    return this.http.get<IData>(url);
  }

  getLookTable(
    table: string,
    order: string = 'asc',
    startRow: number = 0,
    countRows: number = 0,
    searchField: string = '',
    searchValue: string = ''
  ): Observable<any> {
    //{{baseUrl}}/api/look-table/:schema/:table?order=kd&start=0&count=10&searchField=nd&searchValue=ГР

    const url = `/api/look-table/${this.common.owner}/${table}?order=${order}&start=${startRow}&count=${countRows}&searchField=${searchField}&searchValue=${searchValue}`;

    return this.http.get(url);
  }
}
