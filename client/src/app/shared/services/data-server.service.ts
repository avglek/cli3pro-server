import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ContextMenuData,
  IData,
  IDesc,
  IDescParam,
  IProcParam,
  TypeRowEdit,
} from '../interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface OwnerListItem {
  owner: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataServerService {
  constructor(private http: HttpClient) {}

  getDesc(owner: string, id: number): Observable<IDesc> {
    const url = `/api/desc/${owner}/${id}`;
    return this.http.get<IDesc>(url);
  }

  procExecute(
    owner: string,
    procName: string,
    params: IProcParam[],
    uid: string,
    docId: number,
    isCache: boolean = true
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
    //Замена спецсимволов для индекса поезда.
    const paramJson = JSON.stringify(outParams);
    const paramBody = paramJson.replace(/\+/gm, '%2B');
    const url = `/api/proc/${owner}/${procName}?params=${paramBody}`;

    const queryParams = new HttpParams({
      fromObject: {
        uid,
        docId,
        isCache,
      },
    });

    return this.http.get<IData>(url, { params: queryParams });
  }

  getLookTable(
    owner: string,
    table: string,
    order: string = 'asc',
    startRow: number = 0,
    countRows: number = 0,
    searchField: string = '',
    searchValue: string = ''
  ): Observable<any> {
    const url = `/api/look-table/${owner}/${table}?order=${order}&start=${startRow}&count=${countRows}&searchField=${searchField}&searchValue=${searchValue}`;

    return this.http.get(url);
  }

  getOwners(user: string): Observable<string[]> {
    return this.http.get<OwnerListItem[]>(`/api/owners/get-list/${user}`).pipe(
      map((item) => {
        return item.map((i) => i.owner);
      })
    );
  }

  getControls(owner: string, docId: number, controls: string) {
    const url = `/api/fields/${owner}?docId=${docId}&fields=${controls}`;
    return this.http.get<IDescParam[]>(url);
  }

  getContext(
    owner: string,
    docId: number,
    field: string,
    roles: string[]
  ): Observable<ContextMenuData[]> {
    const roleStr = roles.map((el) => `'${el}'`).join(',');
    const url = `/api/context/${owner}?field='${field}'&roles=${roleStr}&parent=${docId}`;
    return this.http.get<ContextMenuData[]>(url);
  }

  saveData(owner: string, table: string, params: TypeRowEdit<any>[]) {
    const url = `/api/edit/${owner}/${table}`;

    return this.http.post(url, params);
  }
}
