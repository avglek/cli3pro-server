import { Component, OnInit } from '@angular/core';
import { TabDataService } from '../../shared/services/tab-data.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ITabData } from '../../shared/interfaces';
import { CommonService } from '../../shared/services/common.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
})
export class FooterComponent implements OnInit {
  rowCount: string | undefined;
  procedure: string | undefined;
  currentOwner: string | undefined;
  timeQuery: string | undefined;
  timeRunQuery: string | undefined;

  currentTab!: ITabData;

  navEnd!: Observable<NavigationEnd>;

  constructor(
    private tabService: TabDataService,
    private router: Router,
    private common: CommonService,
    private authService: AuthService
  ) {
    this.navEnd = router.events.pipe(
      filter((evt) => evt instanceof NavigationEnd)
    ) as Observable<NavigationEnd>;
  }

  ngOnInit(): void {
    this.authService
      .getCurrentOwner()
      .subscribe((owner) => (this.currentOwner = owner));
    this.navEnd.subscribe((nav) => {
      if (nav.url.includes('person')) {
        this.procedure = undefined;
        this.timeQuery = undefined;
        this.rowCount = undefined;
      } else if (nav.url.includes('home')) {
        this.procedure = undefined;
        this.timeQuery = undefined;
        this.rowCount = undefined;
      } else {
        if (this.currentTab) {
          this.currentOwner = this.currentTab.owner;
          this.procedure = this.currentTab.procName;
          this.timeQuery = this.currentTab.timeQuery;
          this.rowCount = this.currentTab.statusRowCount;
        }
      }
    });

    this.tabService.getCurrentTab().subscribe((tab) => {
      if (tab) {
        if (!tab.isLoading) {
          this.currentTab = tab;
          this.currentOwner = tab.owner;
          this.procedure = tab.procName;
          this.rowCount = tab.statusRowCount;
          this.timeQuery = tab.timeQuery;
        }
      }
    });
  }
}
