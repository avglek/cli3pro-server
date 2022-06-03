import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

  constructor(
    private auth: AuthService,
    private router: Router,
    private location: Location
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
}
