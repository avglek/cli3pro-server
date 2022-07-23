import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ITabData, TypeReport } from '../../shared/interfaces';
import { TabDataService } from '../../shared/services/tab-data.service';

@Component({
  selector: 'app-tool-box',
  templateUrl: './tool-box.component.html',
  styleUrls: ['./tool-box.component.less'],
})
export class ToolBoxComponent implements OnInit {
  isCollapsed: boolean = true;

  @Output() onOpen = new EventEmitter();
  menuTitle: string = 'Меню';
  navEnd!: Observable<NavigationEnd>;
  prevUrl!: string;
  isVertical: boolean = false;
  currentTab!: ITabData;
  isTwoTables: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private location: Location,
    private tabDataService: TabDataService
  ) {
    this.navEnd = router.events.pipe(
      filter((evt) => evt instanceof NavigationEnd)
    ) as Observable<NavigationEnd>;
  }

  ngOnInit(): void {
    this.navEnd.subscribe((nav) => {
      this.menuTitle = nav.url.includes('home') ? 'Запросы' : 'Меню';
      this.prevUrl = nav.url;
    });

    this.tabDataService.getCurrentTab().subscribe({
      next: (tab) => {
        if (tab) {
          this.currentTab = tab;
          this.isTwoTables = tab.reportType === TypeReport.TwoTables;
          this.isVertical = !!tab.isVerticalOrient;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  open() {
    this.onOpen.emit();
    this.isCollapsed = !this.isCollapsed;
  }

  async logout() {
    await this.router.navigate(['/login']);
    this.auth.logout();
  }

  async menuToggle() {
    const href = this.router.url;
    if (href.includes('home')) {
      await this.router.navigate(['doc']);
    } else {
      this.location.back();
    }
  }

  onChangeOrient() {
    this.isVertical = !this.isVertical;
    this.currentTab.isVerticalOrient = this.isVertical;
  }
}
