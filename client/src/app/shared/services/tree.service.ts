import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ITreeNode } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  constructor(private http: HttpClient) {}

  getLeftTree(owner: string): Observable<ITreeNode[]> {
    return this.http.get<ITreeNode[]>(`/api/tree/${owner}`);
  }
}
