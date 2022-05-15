import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutsComponent } from './shared/layouts/auth-layouts/auth-layouts.component';
import { SiteLayoutsComponent } from './shared/layouts/site-layouts/site-layouts.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthGuard } from './shared/classes/auth.guard';
import { HelloPageComponent } from './pages/hello-page/hello-page.component';
import { OverviewPageComponent } from './pages/overview-page/overview-page.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutsComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
    ],
  },
  {
    path: '',
    component: SiteLayoutsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'hello', component: HelloPageComponent },
      { path: 'overview', component: OverviewPageComponent },
      { path: 'welcome', component: WelcomeComponent },
    ],
  },
  {
    path: 'test',
    component: MainLayoutComponent,
  },
  // { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  // { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
