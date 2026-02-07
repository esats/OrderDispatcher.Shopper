import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { OrderService } from '../../services/order.service';
import { Order, OrderPriority } from '../../../../models/order.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-available-orders',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="mat-display-1">Available Orders</h1>
            <p class="mat-body-1">Select an order to start shopping</p>
          </div>
          <mat-chip-listbox class="filter-chips">
            <mat-chip-option selected>All</mat-chip-option>
            <mat-chip-option>High Priority</mat-chip-option>
            <mat-chip-option>Urgent</mat-chip-option>
          </mat-chip-listbox>
        </div>
      </div>

      <div class="orders-grid">
        <mat-card
          *ngFor="let order of availableOrders$ | async"
          class="order-card mat-elevation-z2"
          [class.high-priority]="order.priority === 'HIGH'"
          [class.urgent]="order.priority === 'URGENT'"
        >
          <div class="priority-indicator" [class]="getPriorityClass(order.priority)"></div>

          <mat-card-header>
            <div mat-card-avatar class="store-avatar">
              <i-tabler name="building-store"></i-tabler>
            </div>
            <mat-card-title class="store-name">{{ order.storeName }}</mat-card-title>
            <mat-card-subtitle class="order-id">Order #{{ order.id }}</mat-card-subtitle>
            <mat-chip class="priority-chip" [class]="getPriorityClass(order.priority)">
              {{ order.priority }}
            </mat-chip>
          </mat-card-header>

          <mat-card-content>
            <div class="pay-highlight">
              <div class="pay-amount">
                <i-tabler name="currency-dollar" class="pay-icon"></i-tabler>
                <div>
                  <span class="pay-label">Estimated Pay</span>
                  <span class="pay-value">\${{ order.estimatedPay.toFixed(2) }}</span>
                </div>
              </div>
              <div *ngIf="order.tip" class="tip-badge">
                <i-tabler name="gift"></i-tabler>
                +\${{ order.tip.toFixed(2) }} tip
              </div>
            </div>

            <div class="order-stats">
              <div class="stat-item">
                <div class="stat-icon">
                  <i-tabler name="clock"></i-tabler>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Time</span>
                  <span class="stat-value">{{ order.estimatedTime }} min</span>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon">
                  <i-tabler name="map-pin"></i-tabler>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Distance</span>
                  <span class="stat-value">{{ order.distance }} mi</span>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon">
                  <i-tabler name="shopping-bag"></i-tabler>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Items</span>
                  <span class="stat-value">{{ order.itemCount }}</span>
                </div>
              </div>
            </div>

            <mat-divider class="divider"></mat-divider>

            <div class="customer-section">
              <div class="info-row">
                <i-tabler name="user" class="info-icon"></i-tabler>
                <span class="info-text">{{ order.customerName }}</span>
              </div>
              <div class="info-row">
                <i-tabler name="map-pin-filled" class="info-icon"></i-tabler>
                <span class="info-text">{{ order.customerAddress }}</span>
              </div>
              <div *ngIf="order.specialInstructions" class="special-note">
                <i-tabler name="notes"></i-tabler>
                <span>{{ order.specialInstructions }}</span>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions align="end">
            <button
              mat-button
              color="primary"
              (click)="viewOrderDetail(order.id)"
            >
              <i-tabler name="eye"></i-tabler>
              Details
            </button>
            <button
              mat-raised-button
              color="primary"
              (click)="acceptOrder(order.id)"
              class="accept-btn"
            >
              <i-tabler name="check"></i-tabler>
              Accept Order
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="(availableOrders$ | async)?.length === 0" class="empty-state">
        <div class="empty-content">
          <i-tabler name="inbox" class="empty-icon"></i-tabler>
          <h2 class="mat-headline-5">No Available Orders</h2>
          <p class="mat-body-1">Check back later for new orders</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
      }

      .page-header {
        background: white;
        border-radius: 16px;
        padding: 32px;
        margin-bottom: 32px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
      }

      .header-text h1 {
        margin: 0 0 8px 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
        font-size: 36px;
      }

      .header-text p {
        margin: 0;
        color: rgba(0, 0, 0, 0.6);
        font-size: 16px;
      }

      .filter-chips {
        display: flex;
        gap: 8px;
      }

      .orders-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
        gap: 24px;
        margin-bottom: 32px;
      }

      .order-card {
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: white;
      }

      .order-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
      }

      .priority-indicator {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
      }

      .priority-indicator.low {
        background: linear-gradient(90deg, #9e9e9e 0%, #757575 100%);
      }

      .priority-indicator.medium {
        background: linear-gradient(90deg, #42a5f5 0%, #1976d2 100%);
      }

      .priority-indicator.high {
        background: linear-gradient(90deg, #ffa726 0%, #fb8c00 100%);
      }

      .priority-indicator.urgent {
        background: linear-gradient(90deg, #ef5350 0%, #c62828 100%);
        height: 6px;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }

      mat-card-header {
        padding: 20px 20px 0 20px;
        position: relative;
      }

      .store-avatar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .store-avatar i-tabler {
        width: 24px;
        height: 24px;
      }

      .store-name {
        font-size: 20px !important;
        font-weight: 600 !important;
        margin-bottom: 4px !important;
      }

      .order-id {
        font-size: 13px !important;
        color: rgba(0, 0, 0, 0.5) !important;
      }

      .priority-chip {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 11px !important;
        font-weight: 600 !important;
        height: 28px !important;
        padding: 0 12px !important;
        border-radius: 14px !important;
      }

      .priority-chip.low {
        background-color: #e0e0e0 !important;
        color: #616161 !important;
      }

      .priority-chip.medium {
        background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%) !important;
        color: white !important;
      }

      .priority-chip.high {
        background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%) !important;
        color: white !important;
      }

      .priority-chip.urgent {
        background: linear-gradient(135deg, #ef5350 0%, #c62828 100%) !important;
        color: white !important;
      }

      mat-card-content {
        padding: 20px !important;
      }

      .pay-highlight {
        background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .pay-amount {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .pay-icon {
        width: 32px;
        height: 32px;
        color: #667eea;
        background: white;
        border-radius: 8px;
        padding: 6px;
      }

      .pay-amount > div {
        display: flex;
        flex-direction: column;
      }

      .pay-label {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 500;
      }

      .pay-value {
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .tip-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
        color: white;
        padding: 8px 14px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
      }

      .tip-badge i-tabler {
        width: 16px;
        height: 16px;
      }

      .order-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-bottom: 20px;
      }

      .stat-item {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 10px;
        transition: all 0.2s;
      }

      .stat-item:hover {
        background: #e9ecef;
        transform: scale(1.02);
      }

      .stat-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
      }

      .stat-icon i-tabler {
        width: 20px;
        height: 20px;
      }

      .stat-content {
        display: flex;
        flex-direction: column;
      }

      .stat-label {
        font-size: 11px;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .stat-value {
        font-size: 16px;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.87);
      }

      .divider {
        margin: 20px 0 !important;
      }

      .customer-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .info-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
      }

      .info-icon {
        width: 20px;
        height: 20px;
        color: #667eea;
        flex-shrink: 0;
      }

      .info-text {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.8);
        line-height: 1.5;
      }

      .special-note {
        display: flex;
        gap: 12px;
        padding: 12px;
        background: #fff3e0;
        border-left: 3px solid #ffa726;
        border-radius: 8px;
        margin-top: 8px;
      }

      .special-note i-tabler {
        width: 20px;
        height: 20px;
        color: #fb8c00;
        flex-shrink: 0;
      }

      .special-note span {
        font-size: 13px;
        color: #e65100;
        font-weight: 500;
      }

      mat-card-actions {
        padding: 16px 20px 20px !important;
        display: flex;
        gap: 12px;
      }

      mat-card-actions button {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        border-radius: 8px;
      }

      mat-card-actions button i-tabler {
        width: 18px;
        height: 18px;
      }

      .accept-btn {
        flex: 1;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
      }

      .accept-btn:hover {
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5) !important;
      }

      .empty-state {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
      }

      .empty-content {
        text-align: center;
        padding: 64px 24px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        max-width: 400px;
      }

      .empty-icon {
        width: 80px;
        height: 80px;
        color: #667eea;
        opacity: 0.3;
        margin-bottom: 24px;
      }

      .empty-content h2 {
        margin: 0 0 12px 0;
        color: rgba(0, 0, 0, 0.87);
      }

      .empty-content p {
        margin: 0;
        color: rgba(0, 0, 0, 0.6);
      }

      @media (max-width: 768px) {
        .page-container {
          padding: 16px;
        }

        .page-header {
          padding: 20px;
        }

        .header-text h1 {
          font-size: 28px;
        }

        .orders-grid {
          grid-template-columns: 1fr;
        }

        .order-stats {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AvailableOrdersComponent implements OnInit {
  availableOrders$: Observable<Order[]>;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {
    this.availableOrders$ = this.orderService.getAvailableOrders();
  }

  ngOnInit(): void {}

  getPriorityClass(priority: OrderPriority): string {
    return priority.toLowerCase();
  }

  viewOrderDetail(orderId: string): void {
    this.router.navigate(['/orders/detail', orderId]);
  }

  acceptOrder(orderId: string): void {
    this.orderService.acceptOrder(orderId).subscribe({
      next: (order) => {
        this.router.navigate(['/orders/detail', order.id]);
      },
      error: (err) => {
        console.error('Failed to accept order:', err);
      },
    });
  }
}
