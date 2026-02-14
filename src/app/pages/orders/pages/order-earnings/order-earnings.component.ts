import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { OrderModel } from '../../../../models/order.model';

@Component({
  selector: 'app-order-earnings',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="earnings-container" *ngIf="order">
      <div class="earnings-card">
        <div class="check-icon">
          <mat-icon class="done-icon">check_circle</mat-icon>
        </div>
        <h2>Order Completed!</h2>

        <div class="earnings-details">
          <div class="earnings-row">
            <span class="label">Order Total</span>
            <span class="value">\${{ order.total?.toFixed(2) || '0.00' }}</span>
          </div>
          <mat-divider></mat-divider>
          <div class="earnings-row">
            <span class="label">Tip</span>
            <span class="value tip">\${{ order.tip?.toFixed(2) || '0.00' }}</span>
          </div>
          <mat-divider></mat-divider>
          <div class="earnings-row total-row">
            <span class="label">Total Earnings</span>
            <span class="value total">\${{ totalEarnings.toFixed(2) }}</span>
          </div>
        </div>

        <button mat-flat-button color="primary" class="done-btn" (click)="goToOrders()">
          Done
        </button>
      </div>
    </div>
  `,
  styles: [`
    .earnings-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 24px;
    }

    .earnings-card {
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 16px;
      padding: 32px 24px;
      max-width: 400px;
      width: 100%;
      text-align: center;
    }

    .check-icon {
      margin-bottom: 12px;
    }

    .done-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #43a047;
    }

    h2 {
      margin: 0 0 24px;
      font-size: 20px;
      font-weight: 600;
      color: #111;
    }

    .earnings-details {
      text-align: left;
      margin-bottom: 24px;
    }

    .earnings-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
    }

    .label {
      font-size: 14px;
      color: #555;
    }

    .value {
      font-size: 14px;
      font-weight: 600;
      color: #111;
    }

    .value.tip {
      color: #43a047;
    }

    .total-row .label {
      font-size: 16px;
      font-weight: 600;
      color: #111;
    }

    .value.total {
      font-size: 18px;
      color: #1565c0;
    }

    .done-btn {
      width: 100%;
      border-radius: 8px !important;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 0;
    }
  `],
})
export class OrderEarningsComponent implements OnInit {
  order: OrderModel | null = null;
  totalEarnings = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.order = nav?.extras?.state?.['order'] ?? history.state?.['order'] ?? null;

    if (this.order) {
      this.totalEarnings = (this.order.total ?? 0) + (this.order.tip ?? 0);
    } else {
      this.router.navigate(['/orders/active']);
    }
  }

  goToOrders(): void {
    this.router.navigate(['/orders/available']);
  }
}
