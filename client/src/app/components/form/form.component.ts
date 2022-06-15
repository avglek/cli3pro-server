import { Component, Input, OnInit } from '@angular/core';
import { ITabData } from '../../shared/interfaces';
import { TabDataService } from '../../shared/services/tab-data.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less'],
})
export class FormComponent implements OnInit {
  @Input() tabData!: ITabData;

  constructor(private tabService: TabDataService) {}

  ngOnInit(): void {
    const params = this.tabData.params?.filter((param) => param.inOut === 'IN');
    console.log('in params:', params);
  }
}
