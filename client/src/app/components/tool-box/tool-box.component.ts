import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tool-box',
  templateUrl: './tool-box.component.html',
  styleUrls: ['./tool-box.component.less'],
})
export class ToolBoxComponent implements OnInit {
  isCollapsed: boolean = true;

  @Output() onToggle = new EventEmitter();

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  toogle() {
    this.onToggle.emit();
    this.isCollapsed = !this.isCollapsed;
  }

  async logout() {
    console.log('log out');
    await this.router.navigate(['/login']);
    this.auth.logout();
  }
}
