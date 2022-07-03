import { Component, Input, OnInit } from '@angular/core';
import { ITabData } from '../../../shared/interfaces';

@Component({
  selector: 'app-error-tab',
  templateUrl: './error-tab.component.html',
  styleUrls: ['./error-tab.component.less'],
})
export class ErrorTabComponent implements OnInit {
  @Input() tabData!: ITabData;

  constructor() {}

  ngOnInit(): void {}
}
