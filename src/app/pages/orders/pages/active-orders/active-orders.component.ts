import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { OrderService } from '../../services/order.service';
import { Order } from '../../../../models/order.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-active-orders',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="mat-display-1">Active Orders</h1>
            <p class="mat-body-1">Your accepted orders in progress</p>
          </div>
          <div class="header-badge">
            <mat-chip class="count-chip">
              {{ (activeOrders$ | async)?.length || 0 }} Active
            </mat-chip>
          </div>
        </div>
      </div>

      <div class="orders-list">
        <mat-card *ngFor="let order of activeOrders$ | async" class="order-card mat-elevation-z2">
          <div class="status-bar"></div>

          <mat-card-content>
            <div class="order-summary">
              <div class="order-left">
                <div class="store-section">
                  <div class="store-icon">
                    <i-tabler name="building-store"></i-tabler>
                  </div>
                  <div class="store-details">
                    <h3 class="store-name">{{ order.storeName }}</h3>
                    <p class="order-id">Order #{{ order.id }}</p>
                  </div>
                </div>

                <div class="customer-info">
                  <div class="info-item">
                    <div class="info-icon">
                      <i-tabler name="user"></i-tabler>
                    </div>
                    <span>{{ order.customerName }}</span>
                  </div>
                  <div class="info-item">
                    <div class="info-icon">
                      <i-tabler name="map-pin"></i-tabler>
                    </div>
                    <span>{{ order.customerAddress }}</span>
                  </div>
                </div>
              </div>

              <div class="order-stats">
                <div class="stat-card">
                  <i-tabler name="shopping-bag" class="stat-icon"></i-tabler>
                  <div class="stat-info">
                    <span class="stat-label">Items</span>
                    <span class="stat-value">{{ order.itemCount }}</span>
                  </div>
                </div>
                <div class="stat-card">
                  <i-tabler name="currency-dollar" class="stat-icon"></i-tabler>
                  <div class="stat-info">
                    <span class="stat-label">Pay</span>
                    <span class="stat-value">\${{ order.estimatedPay.toFixed(2) }}</span>
                  </div>
                </div>
                <div class="stat-card status-card">
                  <i-tabler name="circle-check" class="stat-icon"></i-tabler>
                  <div class="stat-info">
                    <span class="stat-label">Status</span>
                    <mat-chip class="status-chip">{{ order.status }}</mat-chip>
                  </div>
                </div>
              </div>

              <div class="order-actions">
                <button
                  mat-raised-button
                  color="primary"
                  (click)="continueOrder(order.id)"
                  class="continue-btn"
                >
                  <i-tabler name="arrow-right"></i-tabler>
                  Continue Shopping
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="(activeOrders$ | async)?.length === 0" class="empty-state">
        <div class="empty-content">
          <i-tabler name="clipboard-check" class="empty-icon"></i-tabler>
          <h2 class="mat-headline-5">No Active Orders</h2>
          <p class="mat-body-1">Accept an order from the available orders list to get started</p>
          <button mat-raised-button color="primary" (click)="goToAvailableOrders()" class="cta-button">
            <i-tabler name="plus"></i-tabler>
            View Available Orders
          </button>
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

      .header-badge {
        display: flex;
        align-items: center;
      }

      .count-chip {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        height: 36px !important;
        padding: 0 20px !important;
        border-radius: 18px !important;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .orders-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
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
        transform: translateY(-6px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
      }

      .status-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #4caf50 0%, #2e7d32 100%);
      }

      mat-card-content {
        padding: 24px !important;
      }

      .order-summary {
        display: grid;
        grid-template-columns: 2fr 1.5fr auto;
        gap: 32px;
        align-items: center;
      }

      .order-left {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .store-section {
        display: flex;
        gap: 16px;
        align-items: center;
      }

      .store-icon {
        width: 56px;
        height: 56px;
        border-radius: 14px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .store-icon i-tabler {
        width: 28px;
        height: 28px;
      }

      .store-details {
        flex: 1;
      }

      .store-name {
        margin: 0 0 6px 0;
        font-size: 22px;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.87);
      }

      .order-id {
        margin: 0;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.5);
        font-weight: 500;
      }

      .customer-info {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-left: 72px;
      }

      .info-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.7);
      }

      .info-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #667eea;
        flex-shrink: 0;
      }

      .info-icon i-tabler {
        width: 18px;
        height: 18px;
      }

      .order-stats {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .stat-card {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 18px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 12px;
        transition: all 0.2s;
      }

      .stat-card:hover {
        transform: translateX(4px);
        background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
      }

      .stat-card .stat-icon {
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

      .stat-card .stat-icon {
        width: 20px;
        height: 20px;
      }

      .stat-info {
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .stat-label {
        font-size: 11px;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 2px;
      }

      .stat-value {
        font-size: 18px;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.87);
      }

      .status-chip {
        background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%) !important;
        color: white !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        height: 28px !important;
        padding: 0 12px !important;
        border-radius: 14px !important;
      }

      .order-actions {
        display: flex;
        align-items: center;
      }

      .continue-btn {
        min-width: 180px;
        height: 56px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4) !important;
        transition: all 0.3s;
      }

      .continue-btn:hover {
        box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5) !important;
        transform: translateY(-2px);
      }

      .continue-btn i-tabler {
        width: 22px;
        height: 22px;
      }

      .empty-state {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
      }

      .empty-content {
        text-align: center;
        padding: 64px 48px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        max-width: 480px;
      }

      .empty-icon {
        width: 96px;
        height: 96px;
        color: #667eea;
        opacity: 0.3;
        margin-bottom: 24px;
      }

      .empty-content h2 {
        margin: 0 0 16px 0;
        color: rgba(0, 0, 0, 0.87);
      }

      .empty-content p {
        margin: 0 0 32px 0;
        color: rgba(0, 0, 0, 0.6);
        font-size: 16px;
      }

      .cta-button {
        height: 48px;
        padding: 0 32px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4) !important;
        display: inline-flex;
        align-items: center;
        gap: 10px;
      }

      .cta-button:hover {
        box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5) !important;
        transform: translateY(-2px);
      }

      .cta-button i-tabler {
        width: 20px;
        height: 20px;
      }

      @media (max-width: 1024px) {
        .order-summary {
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .customer-info {
          padding-left: 0;
        }

        .order-stats {
          flex-direction: row;
        }
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

        .order-stats {
          flex-direction: column;
        }

        .continue-btn {
          width: 100%;
        }
      }
    `,
  ],
})
export class ActiveOrdersComponent implements OnInit {
  activeOrders$: Observable<Order[]>;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {
    this.activeOrders$ = this.orderService.getActiveOrders();
  }

  ngOnInit(): void {}

  continueOrder(orderId: string): void {
    this.router.navigate(['/orders/detail', orderId]);
  }

  goToAvailableOrders(): void {
    this.router.navigate(['/orders/available']);
  }
}
