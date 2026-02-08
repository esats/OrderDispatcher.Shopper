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
  styles: [
    `
      .page-container {
        padding: 24px;
        max-width: 720px;
        margin: 0 auto;
        min-height: 100vh;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .page-header h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #111;
      }

      .count {
        font-size: 13px;
        color: #888;
        font-weight: 500;
      }

      .orders-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .order-card {
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 10px;
        overflow: hidden;
        transition: background 0.15s;
      }

      .order-card:hover {
        background: #fafafa;
      }

      .card-body {
        padding: 14px 16px;
      }

      .card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }

      .store-info {
        display: flex;
        align-items: baseline;
        gap: 8px;
        min-width: 0;
      }

      .store-name {
        font-size: 15px;
        font-weight: 600;
        color: #111;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .order-id {
        font-size: 12px;
        color: #999;
        flex-shrink: 0;
      }

      .status-chip {
        font-size: 11px !important;
        font-weight: 600 !important;
        height: 24px !important;
        padding: 0 10px !important;
        background: #e8f5e9 !important;
        color: #2e7d32 !important;
      }

      .meta-row {
        display: flex;
        align-items: baseline;
        gap: 6px;
        margin-bottom: 8px;
      }

      .pay {
        font-size: 14px;
        font-weight: 600;
        color: #111;
      }

      .tip {
        font-size: 12px;
        font-weight: 500;
        color: #43a047;
      }

      .customer-row {
        display: flex;
        gap: 8px;
        font-size: 13px;
        color: #555;
      }

      .customer-id {
        font-weight: 500;
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }

      .continue-btn {
        font-size: 13px;
        font-weight: 500;
        border-radius: 6px !important;
      }

      .empty-state {
        text-align: center;
        padding: 64px 24px;
      }

      .empty-text {
        margin: 0 0 4px 0;
        font-size: 15px;
        font-weight: 500;
        color: #555;
      }

      .empty-sub {
        margin: 0 0 20px 0;
        font-size: 13px;
        color: #999;
      }

      .cta-btn {
        font-size: 13px;
        font-weight: 500;
        border-radius: 6px !important;
      }

      @media (max-width: 600px) {
        .page-container { padding: 16px; }
        .customer-row { flex-direction: column; gap: 2px; }
      }
    `,
  ],
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
