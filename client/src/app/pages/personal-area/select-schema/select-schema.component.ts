import { Component, OnInit } from '@angular/core';
import { DataServerService } from '../../../shared/services/data-server.service';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-select-schema',
  template: `
    <nz-select [(ngModel)]="selectedValue">
      <nz-option
        *ngFor="let option of listOfOption"
        [nzValue]="option"
        [nzLabel]="option"
      ></nz-option>
    </nz-select>
    <button nz-button (click)="onClick()">Выбрать</button>
  `,
  styles: [
    `
      nz-select {
        margin: 0 8px 10px 0;
        width: 120px;
      }
    `,
  ],
})
export class SelectSchemaComponent implements OnInit {
  selectedValue = '';
  listOfOption: string[] = [];
  currentOwner = '';

  constructor(
    private dataService: DataServerService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService
      .getCurrentOwner()
      .subscribe((owner) => (this.currentOwner = owner));
    const user = this.authService.getCurrentUser();

    if (user) {
      this.dataService.getOwners(user).subscribe((data) => {
        this.listOfOption = data;
        if (data.length > 0) {
          this.selectedValue = this.currentOwner || data[0];
        }
      });
    }
  }

  onClick() {
    this.authService.changeOwner(this.selectedValue);
  }
}
