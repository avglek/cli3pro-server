import { Component, Inject, OnInit } from '@angular/core';
import { DialogRef } from '../../../shared/classes/dialog-ref';
import { DIALOG_DATA } from '../../../shared/classes/dialog-tokens';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.less'],
})
export class ExportDialogComponent implements OnInit {
  inputValue: string = '';
  title: string = 'Введите имя файла';
  placeholder: string;
  exp: string = 'xsl';

  constructor(
    private dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: string
  ) {
    this.placeholder = data;
  }

  ngOnInit(): void {}

  onCancel() {
    this.dialogRef.close();
  }

  onOk() {
    if (!this.inputValue) {
      this.inputValue = this.placeholder;
    }
    this.dialogRef.close(`${this.inputValue}`);
  }
}
