import { Injectable } from '@angular/core';
import { DataServerService } from './data-server.service';
import { ICursorData, IField, IProcParam } from '../interfaces';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EditDataService {
  data!: ICursorData;

  constructor(private dataService: DataServerService) {}

  getWithLookTable(
    owner: string,
    procName: string,
    params: IProcParam[],
    uid: string,
    docId: number
  ): Observable<any> {
    return this.dataService
      .procExecute(owner, procName, params, uid, docId)
      .pipe(
        map((data) => <ICursorData>data.data['P_DOC']),
        tap((data) => {
          this.data = data;
        }),
        map((pdoc) => {
          return <IField[]>pdoc.fields.filter((f) => f.controlType === 3);
        }),
        mergeMap((items) => {
          if (items.length === 0) {
            return of(null);
          }

          const a = items.reduce((acc, curr) => {
            return Object.assign(acc, {
              [curr.fieldName!]: this.dataService.getLookTable(
                owner,
                curr.lookupTable!,
                curr.lookupKeyfields!
              ),
            });
          }, {});

          return forkJoin(a);
        })
      );
  }
}
