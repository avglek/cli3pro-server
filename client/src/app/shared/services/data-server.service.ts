import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IData, IDesc, IProcParam } from '../interfaces';
import { Observable } from 'rxjs';
import { Common } from '../classes/common';
import { SortModelItem } from 'ag-grid-community';

@Injectable({
  providedIn: 'root',
})
export class DataServerService {
  constructor(private http: HttpClient, private common: Common) {}

  getDesc(owner: string, id: number): Observable<IDesc> {
    const url = `/api/desc/${owner}/${id}`;
    return this.http.get<IDesc>(url);
  }

  /*******
   * /api/proc/:name?params=[{"name":"P_NV","type":"VARCHAR2","position":2,"inOut":"IN","value":"29215332"},{"name":"P_TEXT","type":"CLOB","position":1,"inOut":"OUT"}]
   * &start=0&end=100
   * @param procName
   * @param params
   * @param uid
   * @param docId
   */
  procExecute(
    procName: string,
    params: IProcParam[],
    uid: string,
    docId: number
  ): Observable<IData> {
    const url = `/api/proc/${
      this.common.owner
    }/${procName}?params=${JSON.stringify(params)}&uid=${uid}&docId=${docId}`;
    return this.http.get<IData>(url);
  }
}
