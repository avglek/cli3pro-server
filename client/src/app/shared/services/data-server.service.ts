import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDesc } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataServerService {
  constructor(private http: HttpClient) {}

  getDesc(owner: string, id: number) {
    const url = `/api/desc/${owner}/${id}`;
    return this.http.get<IDesc>(url);
  }
}
