import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { ru_RU } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { AuthLayoutsComponent } from './shared/layouts/auth-layouts/auth-layouts.component';
import { LoginPageModule } from './pages/login-page/login-page.module';
import { TokenInterceptor } from './shared/classes/token.interceptor';
import { NzNotificationServiceModule } from 'ng-zorro-antd/notification';

import { SiteLayoutsModule } from './shared/layouts/site-layouts/site-layouts.module';
import { MainLayoutModule } from './shared/layouts/main-layout/main-layout.module';

registerLocaleData(ru);

@NgModule({
  declarations: [AppComponent, AuthLayoutsComponent],
  imports: [
    LoginPageModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzNotificationServiceModule,
    SiteLayoutsModule,
    MainLayoutModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: ru_RU },
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: TokenInterceptor },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
