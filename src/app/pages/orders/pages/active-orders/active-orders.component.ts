import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { OrderService } from '../../services/order.service';
import { OrderModel } from '../../../../models/order.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-active-orders',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Active Orders</h1>
        <span class="count">{{ (orders$ | async)?.length || 0 }} active</span>
      </div>

      <div class="orders-list">
        <div *ngFor="let order of orders$ | async" class="order-card">
          <div class="card-body">
            <div class="card-top">
              <div class="store-info">
                <span class="store-name">Store: {{ order.storeId }}</span>
                <span class="order-id">#{{ order.id }}</span>
              </div>
              <mat-chip class="status-chip">{{ order.status }}</mat-chip>
            </div>

            <div class="meta-row">
              <span *ngIf="order.total != null" class="pay">\${{ order.total.toFixed(2) }}</span>
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

      <div *ngIf="(orders$ | async)?.length === 0" class="empty-state">
        <p class="empty-text">No active orders</p>
        <p class="empty-sub">Accept an order to get started</p>
        <button mat-flat-button color="primary" (click)="goToAvailableOrders()" class="cta-btn">
          View Available Orders
        </button>
      </div>
    </div>
  `,
  styleUrl: './active-orders.component.scss',
})
export class ActiveOrdersComponent implements OnInit {
  orders$: Observable<OrderModel[]>;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {
    this.orders$ = this.orderService.getOrders();
  }

  ngOnInit(): void {
    this.orderService.loadOrders().subscribe();
  }

  continueOrder(orderId: number): void {
    this.router.navigate(['/orders/detail', orderId]);
  }

  goToAvailableOrders(): void {
    this.router.navigate(['/orders/available']);
  }
}
