import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-personal-area',
  templateUrl: './personal-area.component.html',
  styleUrls: ['./personal-area.component.less'],
})
export class PersonalAreaComponent implements OnInit {
  uploading = false;
  fileList: NzUploadFile[] = [];

  constructor() {}

  ngOnInit(): void {}
}
