import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.less'],
})
export class MainLayoutComponent implements OnInit {
  opened: boolean = true;

  openSidebar() {
    this.opened = !this.opened;
  }

  constructor() {}

  ngOnInit(): void {}
}
