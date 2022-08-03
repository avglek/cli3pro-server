import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITreeDocs, ITreeNode } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  constructor(private http: HttpClient) {}

  getLeftTree(owner: string): Observable<ITreeNode[]> {
    return this.http.get<ITreeNode[]>(`/api/tree/${owner}`);
  }

  getDocs(owner: string, id: string): Observable<ITreeDocs[]> {
    return this.http.get<ITreeDocs[]>(`api/tree-docs/${owner}/${id}`);
  }
}
