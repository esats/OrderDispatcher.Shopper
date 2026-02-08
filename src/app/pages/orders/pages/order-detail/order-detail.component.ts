import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { OrderService } from '../../services/order.service';
import { OrderModel } from '../../../../models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  template: `
    <div class="page-container">
      <div *ngIf="order" class="order-detail">
        <div class="page-header">
          <button mat-button class="back-btn" (click)="goBack()">Back</button>
          <div class="header-title">
            <h1>Order #{{ order.id }}</h1>
            <div class="header-badges">
              <span class="status-label">Status: {{ order.status }}</span>
            </div>
          </div>
        </div>

        <div class="pay-row">
          <span *ngIf="order.total != null" class="pay-amount">\${{ order.total.toFixed(2) }}</span>
          <span *ngIf="order.tip != null" class="tip">+\${{ order.tip.toFixed(2) }} tip</span>
        </div>

        <div class="section">
          <h2 class="section-title">Order Info</h2>
          <div class="section-body">
            <p class="info-line"><strong>Store:</strong> {{ order.storeId }}</p>
            <p class="info-line"><strong>Customer:</strong> {{ order.customerId }}</p>
            <p *ngIf="order.shopperId" class="info-line"><strong>Shopper:</strong> {{ order.shopperId }}</p>
            <p class="info-line"><strong>Basket Master ID:</strong> {{ order.basketMasterId }}</p>
            <p *ngIf="order.assignedAtUtc" class="info-line"><strong>Assigned At:</strong> {{ order.assignedAtUtc }}</p>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Payment Details</h2>
          <div class="section-body">
            <p *ngIf="order.subtotal != null" class="info-line"><strong>Subtotal:</strong> \${{ order.subtotal.toFixed(2) }}</p>
            <p *ngIf="order.deliveryFee != null" class="info-line"><strong>Delivery Fee:</strong> \${{ order.deliveryFee.toFixed(2) }}</p>
            <p *ngIf="order.serviceFee != null" class="info-line"><strong>Service Fee:</strong> \${{ order.serviceFee.toFixed(2) }}</p>
            <p *ngIf="order.tip != null" class="info-line"><strong>Tip:</strong> \${{ order.tip.toFixed(2) }}</p>
            <p *ngIf="order.total != null" class="info-line total"><strong>Total:</strong> \${{ order.total.toFixed(2) }}</p>
          </div>
        </div>

        <div *ngIf="order.notes" class="section">
          <h2 class="section-title">Notes</h2>
          <div class="note">{{ order.notes }}</div>
        </div>
      </div>

      <div *ngIf="loading" class="loading-state">
        <mat-spinner diameter="32"></mat-spinner>
        <p>Loading...</p>
      </div>

      <div *ngIf="error" class="error-state">
        <p class="error-text">{{ error }}</p>
        <button mat-button (click)="goBack()">Go Back</button>
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 24px;
        max-width: 640px;
        margin: 0 auto;
        min-height: 100vh;
      }

      .page-header {
        margin-bottom: 20px;
      }

      .back-btn {
        font-size: 13px;
        color: #888;
        padding: 0;
        margin-bottom: 8px;
      }

      .header-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }

      .header-title h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #111;
      }

      .header-badges {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .status-label {
        font-size: 11px;
        font-weight: 600;
        color: #2e7d32;
        background: #e8f5e9;
        padding: 3px 10px;
        border-radius: 4px;
      }

      .pay-row {
        display: flex;
        align-items: baseline;
        gap: 6px;
        flex-wrap: wrap;
        padding: 14px 16px;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 10px;
        margin-bottom: 20px;
      }

      .pay-amount {
        font-size: 20px;
        font-weight: 700;
        color: #111;
      }

      .tip {
        font-size: 13px;
        font-weight: 500;
        color: #43a047;
      }

      .section {
        margin-bottom: 16px;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 10px;
        padding: 14px 16px;
      }

      .section-title {
        margin: 0 0 8px 0;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #999;
      }

      .section-body {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .info-line {
        margin: 0;
        font-size: 14px;
        color: #333;
      }

      .info-line strong {
        color: #111;
      }

      .info-line.total {
        font-size: 16px;
        font-weight: 600;
        margin-top: 6px;
        padding-top: 8px;
        border-top: 1px solid #eee;
      }

      .note {
        font-size: 13px;
        color: #b26a00;
        background: #fff8e1;
        padding: 8px 10px;
        border-radius: 6px;
      }

      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 64px 24px;
        gap: 12px;
      }

      .loading-state p {
        margin: 0;
        font-size: 13px;
        color: #999;
      }

      .error-state {
        text-align: center;
        padding: 64px 24px;
      }

      .error-text {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: #e53935;
      }

      @media (max-width: 600px) {
        .page-container { padding: 16px; }
        .pay-row { flex-wrap: wrap; }
      }
    `,
  ],
})
export class OrderDetailComponent implements OnInit {
  order: OrderModel | null = null;
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
      this.loadOrder(Number(orderId));
    } else {
      this.error = 'Order ID not provided';
      this.loading = false;
    }
  }

  loadOrder(orderId: number): void {
    this.orderService.loadOrders().subscribe({
      next: () => {
        const order = this.orderService.getOrderById(orderId);
        if (order) {
          this.order = order;
        } else {
          this.error = 'Order not found';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load order details';
        this.loading = false;
        console.error(err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/orders/available']);
  }
}
