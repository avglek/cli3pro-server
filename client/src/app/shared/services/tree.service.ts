import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITreeDocs, ITreeNode } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  constructor(private http: HttpClient) {}

  // getLeftTree(): Observable<ITreeNode[]> {
  //   console.log('get left tree');
  //
  //   return this.common.owner.pipe(
  //     tap((owner) => console.log('tree owner:', owner)),
  //     switchMap((owner) => this.http.get<ITreeNode[]>(`/api/tree/${owner}`))
  //   );
  // }
  //
  // getDocs(id: string): Observable<ITreeDocs[]> {
  //   return this.common.owner.pipe(
  //     tap((owner) => console.log('tree doc owner:', owner)),
  //     switchMap((owner) =>
  //       this.http.get<ITreeDocs[]>(`api/tree-docs/${owner}/${id}`)
  //     )
  //   );
  // }

  getLeftTree(owner: string): Observable<ITreeNode[]> {
    return this.http.get<ITreeNode[]>(`/api/tree/${owner}`);
  }

  getDocs(owner: string, id: string): Observable<ITreeDocs[]> {
    return this.http.get<ITreeDocs[]>(`api/tree-docs/${owner}/${id}`);
  }
}
