import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { IconService } from './shared/services/icon.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService, private iconService: IconService) {}

  ngOnInit(): void {
    this.iconService.registerIcons();
    const potentialToken = localStorage.getItem('auth-token');
    if (potentialToken) {
      this.auth.setToken(potentialToken);
    }
  }
}
