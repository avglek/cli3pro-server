import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/interfaces';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  validateForm!: UntypedFormGroup;
  authSub!: Subscription;
  passwordVisible!: boolean;
  isLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.auth
      .getVersion()
      .subscribe((message) => console.log(JSON.stringify(message)));

    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

    this.route.queryParams.subscribe((params) => {
      if (params['registered']) {
        //Теперь вы можете зайти в систему
        this.msg.success('Вход в систему', 'Теперь вы можете зайти в систему');
      } else if (params['accessDenied']) {
        this.msg.warning('Вход в систему', 'Для начала авторизируйтесь');
        //Для начала авторизируйтесь
      } else if (params['sessionFailed']) {
        this.msg.warning(
          'Вход в систему',
          'Пожалуйста войдите в систему заново'
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  submitForm(): void {
    this.isLoading = true;
    if (this.validateForm.valid) {
      const user: User = {
        user: this.validateForm.value.userName,
        password: this.validateForm.value.password,
      };
      this.validateForm.disable();

      this.authSub = this.auth.login(user).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.warn(error, 'test:');
          this.isLoading = false;
          this.msg.error('Ошибка авторизации', error.error.message);
          this.validateForm.enable();
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
