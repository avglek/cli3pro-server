import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  IData,
  IDesc,
  IDescParam,
  IProcParam,
} from '../interfaces';
import { Observable} from 'rxjs';
import { map} from 'rxjs/operators';

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
    const url = `/api/proc/${owner}/${procName}?params=${JSON.stringify(
      outParams
    )}&uid=${uid}&docId=${docId}`;

    return this.http.get<IData>(url);
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
    //{{baseUrl}}/api/look-table/:schema/:table?order=kd&start=0&count=10&searchField=nd&searchValue=ГР

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
}
