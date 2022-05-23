import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutsComponent } from './shared/layouts/auth-layouts/auth-layouts.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthGuard } from './shared/classes/auth.guard';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DocsLayoutComponent } from './shared/layouts/docs-layout/docs-layout.component';

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
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: WelcomeComponent },
      { path: 'home/:id', component: HomePageComponent },
      { path: 'doc/:id', component: DocsLayoutComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
