import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ITreeDocs, ITreeNode } from '../interfaces';
import { Common } from '../classes/common';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  constructor(private http: HttpClient, private common: Common) {}

  getLeftTree(): Observable<ITreeNode[]> {
    return this.http.get<ITreeNode[]>(`/api/tree/${this.common.owner}`);
  }

  getDocs(id: string): Observable<ITreeDocs[]> {
    return this.http.get<ITreeDocs[]>(
      `api/tree-docs/${this.common.owner}/${id}`
    );
  }
}
