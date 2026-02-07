import { Routes } from '@angular/router';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./side-login/side-login.component').then(
        (m) => m.AppSideLoginComponent
      ),
  },
];
