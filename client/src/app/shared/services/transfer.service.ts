import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  btnFilter = new BehaviorSubject<boolean>(false);
}
