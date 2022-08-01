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

  constructor(
    private dataService: DataServerService,
    private authService: AuthService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    const owner = this.commonService.getCurrentOwner();

    if (user) {
      this.dataService.getOwners(user).subscribe((data) => {
        console.log(user, ':', data);
        this.listOfOption = data;
        if (data.length > 0) {
          this.selectedValue = owner || data[0];
        }
      });
    }
  }

  onClick() {
    this.commonService.changeOwner(this.selectedValue);
  }
}
