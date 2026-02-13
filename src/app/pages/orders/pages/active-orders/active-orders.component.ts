import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { OrderService } from '../../services/order.service';
import { Order } from '../../../../models/order.model';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-active-orders',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Active Orders</h1>
      </div>

      <ng-container *ngIf="activeOrder$ | async as order; else emptyState">
        <div class="orders-list">
          <div class="order-card">
            <div class="card-body">
              <div class="card-top">
                <div class="store-info">
                  <span class="store-name">Store: {{ order.storeId }}</span>
                  <span class="order-id">#{{ order.id }}</span>
                </div>
                <mat-chip class="status-chip">{{ order.status }}</mat-chip>
              </div>

              <div class="meta-row">
                <span *ngIf="order.estimatedPay != null" class="pay">\${{ order.estimatedPay.toFixed(2) }}</span>
                <span *ngIf="order.tip != null" class="tip">+\${{ order.tip.toFixed(2) }} tip</span>
              </div>

              <div class="customer-row">
                <span class="customer-id">Customer: {{ order.customerId }}</span>
              </div>

              <div class="actions">
                <button
                  mat-flat-button
                  color="primary"
                  (click)="continueOrder(order.id)"
                  class="continue-btn"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <ng-template #emptyState>
        <div class="empty-state">
          <p class="empty-text">No active orders</p>
          <p class="empty-sub">Accept an order to get started</p>
          <button mat-flat-button color="primary" (click)="goToAvailableOrders()" class="cta-btn">
            View Available Orders
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: './active-orders.component.scss',
})
export class ActiveOrdersComponent implements OnInit {
  activeOrder$: Observable<Order | null> = of(null);

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.activeOrder$ = this.orderService.getActiveOrder(userId);
    }
  }

  continueOrder(orderId: string): void {
    this.router.navigate(['/orders/detail', orderId]);
  }

  goToAvailableOrders(): void {
    this.router.navigate(['/orders/available']);
  }
}
