import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { OrderService } from '../../services/order.service';
import { Order } from '../../../../models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  template: `
    <div class="page-container">
      <div *ngIf="order" class="order-detail">
        <div class="header-section">
          <button mat-fab class="back-button" (click)="goBack()">
            <i-tabler name="arrow-left"></i-tabler>
          </button>

          <div class="header-content">
            <div class="title-group">
              <h1 class="mat-display-1">Order Details</h1>
              <p class="order-id">Order #{{ order.id }}</p>
            </div>
            <div class="header-badges">
              <mat-chip class="status-chip">{{ order.status }}</mat-chip>
              <mat-chip [class]="'priority-chip priority-' + order.priority.toLowerCase()">
                {{ order.priority }} PRIORITY
              </mat-chip>
            </div>
          </div>
        </div>

        <!-- Pay Highlight Banner -->
        <div class="pay-banner">
          <div class="pay-content">
            <i-tabler name="currency-dollar" class="pay-icon"></i-tabler>
            <div class="pay-info">
              <span class="pay-label">Total Estimated Pay</span>
              <span class="pay-amount">\${{ order.estimatedPay.toFixed(2) }}</span>
            </div>
          </div>
          <div *ngIf="order.tip" class="tip-badge">
            <i-tabler name="gift"></i-tabler>
            <span>+\${{ order.tip.toFixed(2) }} tip included</span>
          </div>
        </div>

        <div class="content-grid">
          <!-- Quick Stats -->
          <div class="quick-stats">
            <div class="stat-box">
              <div class="stat-icon">
                <i-tabler name="clock"></i-tabler>
              </div>
              <div class="stat-data">
                <span class="stat-label">Est. Time</span>
                <span class="stat-value">{{ order.estimatedTime }} min</span>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon">
                <i-tabler name="map-pin"></i-tabler>
              </div>
              <div class="stat-data">
                <span class="stat-label">Distance</span>
                <span class="stat-value">{{ order.distance }} mi</span>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon">
                <i-tabler name="shopping-bag"></i-tabler>
              </div>
              <div class="stat-data">
                <span class="stat-label">Items</span>
                <span class="stat-value">{{ order.itemCount }}</span>
              </div>
            </div>
          </div>

          <!-- Store Info Card -->
          <mat-card class="info-card store-card mat-elevation-z4">
            <div class="card-icon store-icon">
              <i-tabler name="building-store"></i-tabler>
            </div>
            <mat-card-header>
              <mat-card-title>Store Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <h3 class="location-name">{{ order.storeName }}</h3>
              <div class="location-address">
                <i-tabler name="map-pin"></i-tabler>
                <span>{{ order.storeAddress }}</span>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Customer Info Card -->
          <mat-card class="info-card customer-card mat-elevation-z4">
            <div class="card-icon customer-icon">
              <i-tabler name="user"></i-tabler>
            </div>
            <mat-card-header>
              <mat-card-title>Customer Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <h3 class="location-name">{{ order.customerName }}</h3>
              <div class="contact-info">
                <div class="contact-item">
                  <i-tabler name="phone"></i-tabler>
                  <span>{{ order.customerPhone }}</span>
                </div>
                <div class="contact-item">
                  <i-tabler name="map-pin"></i-tabler>
                  <span>{{ order.customerAddress }}</span>
                </div>
              </div>
              <div *ngIf="order.deliveryInstructions" class="instruction-box delivery">
                <div class="instruction-header">
                  <i-tabler name="truck-delivery"></i-tabler>
                  <strong>Delivery Instructions</strong>
                </div>
                <p>{{ order.deliveryInstructions }}</p>
              </div>
              <div *ngIf="order.specialInstructions" class="instruction-box special">
                <div class="instruction-header">
                  <i-tabler name="alert-circle"></i-tabler>
                  <strong>Special Instructions</strong>
                </div>
                <p>{{ order.specialInstructions }}</p>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Items List Card -->
          <mat-card class="items-card mat-elevation-z4">
            <mat-card-header>
              <div class="items-header">
                <div class="items-title">
                  <i-tabler name="shopping-bag"></i-tabler>
                  <mat-card-title>Shopping List</mat-card-title>
                </div>
                <mat-chip class="items-count">{{ order.items.length }} items</mat-chip>
              </div>
            </mat-card-header>
            <mat-card-content>
              <div class="items-list">
                <div *ngFor="let item of order.items" class="item-card">
                  <div class="item-main">
                    <div class="item-icon">
                      <i-tabler name="package"></i-tabler>
                    </div>
                    <div class="item-info">
                      <span class="item-name">{{ item.productName }}</span>
                      <span class="item-category">{{ item.category }}</span>
                    </div>
                  </div>
                  <div class="item-details">
                    <span class="quantity">{{ item.quantity }} {{ item.unit }}</span>
                    <span class="price">\${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Action Buttons -->
        <div class="action-section">
          <button
            *ngIf="order.status === 'AVAILABLE'"
            mat-raised-button
            color="primary"
            class="action-btn accept-btn"
            (click)="acceptOrder()"
          >
            <i-tabler name="check"></i-tabler>
            Accept Order
          </button>
          <button
            *ngIf="order.status === 'ACCEPTED'"
            mat-raised-button
            color="primary"
            class="action-btn start-btn"
            (click)="startShopping()"
          >
            <i-tabler name="shopping-cart"></i-tabler>
            Start Shopping
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="loading-state">
        <mat-spinner diameter="60"></mat-spinner>
        <p>Loading order details...</p>
      </div>

      <div *ngIf="error" class="error-state">
        <i-tabler name="alert-triangle" class="error-icon"></i-tabler>
        <h2>Oops! Something went wrong</h2>
        <p>{{ error }}</p>
        <button mat-raised-button color="primary" (click)="goBack()">
          <i-tabler name="arrow-left"></i-tabler>
          Go Back
        </button>
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

      .order-detail {
        max-width: 1400px;
        margin: 0 auto;
      }

      .header-section {
        background: white;
        border-radius: 20px;
        padding: 32px;
        margin-bottom: 32px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        display: flex;
        gap: 24px;
        align-items: center;
      }

      .back-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4) !important;
        flex-shrink: 0;
      }

      .back-button:hover {
        box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5) !important;
      }

      .back-button i-tabler {
        width: 24px;
        height: 24px;
      }

      .header-content {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
        flex-wrap: wrap;
      }

      .title-group h1 {
        margin: 0 0 8px 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
        font-size: 36px;
      }

      .title-group .order-id {
        margin: 0;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.5);
        font-weight: 500;
      }

      .header-badges {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .status-chip {
        background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%) !important;
        color: white !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        height: 36px !important;
        padding: 0 20px !important;
        border-radius: 18px !important;
      }

      .priority-chip {
        font-size: 13px !important;
        font-weight: 700 !important;
        height: 36px !important;
        padding: 0 20px !important;
        border-radius: 18px !important;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .priority-chip.priority-low {
        background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%) !important;
        color: white !important;
      }

      .priority-chip.priority-medium {
        background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%) !important;
        color: white !important;
      }

      .priority-chip.priority-high {
        background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%) !important;
        color: white !important;
      }

      .priority-chip.priority-urgent {
        background: linear-gradient(135deg, #ef5350 0%, #c62828 100%) !important;
        color: white !important;
        animation: pulse-chip 2s ease-in-out infinite;
      }

      @keyframes pulse-chip {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      .pay-banner {
        background: white;
        border-radius: 16px;
        padding: 28px 32px;
        margin-bottom: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        border: 3px solid transparent;
        background-image:
          linear-gradient(white, white),
          linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
      }

      .pay-content {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .pay-icon {
        width: 56px;
        height: 56px;
        border-radius: 14px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 14px;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
      }

      .pay-info {
        display: flex;
        flex-direction: column;
      }

      .pay-label {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 500;
        margin-bottom: 4px;
      }

      .pay-amount {
        font-size: 40px;
        font-weight: 800;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;
      }

      .tip-badge {
        display: flex;
        align-items: center;
        gap: 10px;
        background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
        color: white;
        padding: 14px 24px;
        border-radius: 24px;
        font-size: 16px;
        font-weight: 700;
        box-shadow: 0 4px 16px rgba(76, 175, 80, 0.4);
      }

      .tip-badge i-tabler {
        width: 24px;
        height: 24px;
      }

      .quick-stats {
        display: grid;
        grid-column: 1 / -1;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 12px;
      }

      .stat-box {
        background: white;
        border-radius: 16px;
        padding: 24px;
        display: flex;
        align-items: center;
        gap: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        transition: all 0.3s;
      }

      .stat-box:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      }

      .stat-box .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 14px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
      }

      .stat-box .stat-icon i-tabler {
        width: 28px;
        height: 28px;
      }

      .stat-data {
        display: flex;
        flex-direction: column;
      }

      .stat-label {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
      }

      .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.87);
      }

      .content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 24px;
        margin-bottom: 32px;
      }

      .info-card {
        position: relative;
        border-radius: 16px;
        overflow: visible;
        transition: all 0.3s;
        padding-top: 20px;
      }

      .info-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
      }

      .card-icon {
        position: absolute;
        top: -20px;
        left: 24px;
        width: 64px;
        height: 64px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      }

      .card-icon i-tabler {
        width: 32px;
        height: 32px;
      }

      .store-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .customer-icon {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      mat-card-header {
        padding: 24px 24px 0 24px !important;
      }

      mat-card-title {
        font-size: 18px !important;
        font-weight: 600 !important;
        color: rgba(0, 0, 0, 0.6) !important;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 13px !important;
      }

      mat-card-content {
        padding: 20px 24px 24px !important;
      }

      .location-name {
        margin: 0 0 16px 0;
        font-size: 22px;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.87);
      }

      .location-address {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px;
        background: #f8f9fa;
        border-radius: 12px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.8);
      }

      .location-address i-tabler {
        width: 20px;
        height: 20px;
        color: #667eea;
        flex-shrink: 0;
      }

      .contact-info {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 16px;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px;
        background: #f8f9fa;
        border-radius: 12px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.8);
      }

      .contact-item i-tabler {
        width: 20px;
        height: 20px;
        color: #667eea;
        flex-shrink: 0;
      }

      .instruction-box {
        margin-top: 12px;
        padding: 16px;
        border-radius: 12px;
        border-left: 4px solid;
      }

      .instruction-box.delivery {
        background: #e3f2fd;
        border-color: #2196f3;
      }

      .instruction-box.special {
        background: #fff3e0;
        border-color: #ff9800;
      }

      .instruction-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .instruction-header i-tabler {
        width: 18px;
        height: 18px;
      }

      .instruction-box.delivery .instruction-header {
        color: #1976d2;
      }

      .instruction-box.special .instruction-header {
        color: #f57c00;
      }

      .instruction-box p {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        color: rgba(0, 0, 0, 0.8);
      }

      .items-card {
        grid-column: 1 / -1;
      }

      .items-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .items-title {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .items-title i-tabler {
        width: 24px;
        height: 24px;
        color: #667eea;
      }

      .items-count {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        height: 32px !important;
        padding: 0 16px !important;
        border-radius: 16px !important;
      }

      .items-list {
        display: grid;
        gap: 16px;
      }

      .item-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 12px;
        transition: all 0.2s;
      }

      .item-card:hover {
        transform: translateX(8px);
        background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
      }

      .item-main {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;
      }

      .item-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
      }

      .item-icon i-tabler {
        width: 24px;
        height: 24px;
      }

      .item-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .item-name {
        font-size: 16px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.87);
      }

      .item-category {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 500;
      }

      .item-details {
        display: flex;
        align-items: center;
        gap: 24px;
      }

      .quantity {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 500;
        padding: 6px 14px;
        background: white;
        border-radius: 8px;
      }

      .price {
        font-size: 20px;
        font-weight: 700;
        color: #667eea;
        min-width: 80px;
        text-align: right;
      }

      .action-section {
        display: flex;
        justify-content: center;
        gap: 20px;
        padding: 20px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      }

      .action-btn {
        min-width: 240px;
        height: 64px;
        font-size: 18px;
        font-weight: 700;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4) !important;
        transition: all 0.3s;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .action-btn:hover {
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.6) !important;
        transform: translateY(-3px);
      }

      .action-btn i-tabler {
        width: 26px;
        height: 26px;
      }

      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        background: white;
        border-radius: 16px;
        padding: 64px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      }

      .loading-state p {
        margin-top: 24px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.6);
      }

      .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-height: 400px;
        background: white;
        border-radius: 16px;
        padding: 64px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      }

      .error-icon {
        width: 80px;
        height: 80px;
        color: #ef5350;
        margin-bottom: 24px;
      }

      .error-state h2 {
        margin: 0 0 16px 0;
        font-size: 28px;
        color: rgba(0, 0, 0, 0.87);
      }

      .error-state p {
        margin: 0 0 32px 0;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.6);
      }

      .error-state button {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 48px;
        padding: 0 32px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 24px;
      }

      .error-state button i-tabler {
        width: 20px;
        height: 20px;
      }

      @media (max-width: 1024px) {
        .content-grid {
          grid-template-columns: 1fr;
        }

        .items-card {
          grid-column: 1;
        }
      }

      @media (max-width: 768px) {
        .page-container {
          padding: 16px;
        }

        .header-section {
          padding: 20px;
          flex-direction: column;
          align-items: flex-start;
        }

        .header-content {
          width: 100%;
        }

        .title-group h1 {
          font-size: 28px;
        }

        .pay-banner {
          flex-direction: column;
          gap: 20px;
          text-align: center;
        }

        .pay-amount {
          font-size: 32px;
        }

        .quick-stats {
          grid-template-columns: 1fr;
        }

        .content-grid {
          grid-template-columns: 1fr;
        }

        .item-card {
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }

        .item-details {
          width: 100%;
          justify-content: space-between;
        }

        .action-section {
          flex-direction: column;
        }

        .action-btn {
          width: 100%;
          min-width: unset;
        }
      }
    `,
  ],
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(orderId);
    } else {
      this.error = 'Order ID not provided';
      this.loading = false;
    }
  }

  loadOrder(orderId: string): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load order details';
        this.loading = false;
        console.error(err);
      },
    });
  }

  acceptOrder(): void {
    if (!this.order) return;

    this.orderService.acceptOrder(this.order.id).subscribe({
      next: (order) => {
        this.order = order;
      },
      error: (err) => {
        console.error('Failed to accept order:', err);
      },
    });
  }

  startShopping(): void {
    if (!this.order) return;

    this.orderService.startShopping(this.order.id).subscribe({
      next: (order) => {
        this.order = order;
        // Navigate to shopping list (will be implemented later)
        alert('Shopping started! (Shopping module will be implemented next)');
      },
      error: (err) => {
        console.error('Failed to start shopping:', err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/orders/available']);
  }
}
