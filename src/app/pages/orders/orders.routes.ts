import { Routes } from '@angular/router';

export const OrdersRoutes: Routes = [
  {
    path: '',
    redirectTo: 'available',
    pathMatch: 'full',
  },
  {
    path: 'available',
    loadComponent: () =>
      import('./pages/available-orders/available-orders.component').then(
        (m) => m.AvailableOrdersComponent
      ),
  },
  {
    path: 'active',
    loadComponent: () =>
      import('./pages/active-orders/active-orders.component').then(
        (m) => m.ActiveOrdersComponent
      ),
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./pages/order-detail/order-detail.component').then(
        (m) => m.OrderDetailComponent
      ),
  },
  {
    path: 'earnings',
    loadComponent: () =>
      import('./pages/order-earnings/order-earnings.component').then(
        (m) => m.OrderEarningsComponent
      ),
  },
];
