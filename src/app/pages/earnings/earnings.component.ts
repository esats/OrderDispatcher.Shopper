import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MaterialModule } from '../../material.module';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface ShopperEarningResponse {
  totalEarning: number;
  totalOrder: number;
}

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">My Earnings</h1>

      <div class="loading-state" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div class="error-state" *ngIf="errorMessage && !loading">
        <mat-icon class="error-icon">error_outline</mat-icon>
        <p>{{ errorMessage }}</p>
        <button mat-flat-button color="primary" (click)="loadEarnings()">
          Retry
        </button>
      </div>

      <div class="earnings-content" *ngIf="!loading && !errorMessage">
        <div class="earnings-card total-card">
          <span class="card-label">Total Earnings</span>
          <span class="card-value">\${{ totalEarning.toFixed(2) }}</span>
        </div>

        <div class="earnings-card orders-card">
          <span class="card-label">Total Orders</span>
          <span class="card-value">{{ totalOrder }}</span>
        </div>

        <div class="earnings-card avg-card" *ngIf="totalOrder > 0">
          <span class="card-label">Avg. Per Order</span>
          <span class="card-value">\${{ (totalEarning / totalOrder).toFixed(2) }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 24px;
        max-width: 720px;
        margin: 0 auto;
      }

      .page-title {
        font-size: 22px;
        font-weight: 600;
        color: #111;
        margin: 0 0 24px;
      }

      .loading-state {
        display: flex;
        justify-content: center;
        padding: 64px 0;
      }

      .error-state {
        text-align: center;
        padding: 48px 0;
        color: #d32f2f;
      }

      .error-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 8px;
      }

      .error-state p {
        margin: 0 0 16px;
        font-size: 14px;
      }

      .earnings-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .earnings-card {
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .card-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
        margin-bottom: 12px;
      }

      .total-card .card-icon {
        color: #43a047;
      }

      .orders-card .card-icon {
        color: #1565c0;
      }

      .avg-card .card-icon {
        color: #ff8f00;
      }

      .card-label {
        font-size: 13px;
        color: #777;
        margin-bottom: 4px;
      }

      .card-value {
        font-size: 28px;
        font-weight: 700;
        color: #111;
      }

      .total-card .card-value {
        color: #43a047;
      }
    `,
  ],
})
export class EarningsComponent implements OnInit {
  loading = true;
  errorMessage = '';
  totalEarning = 0;
  totalOrder = 0;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEarnings();
  }

  loadEarnings(): void {
    this.loading = true;
    this.errorMessage = '';

    const params = new HttpParams().set(
      'userId',
      this.authService.getUserId() ?? ''
    );

    this.apiService
      .get<ShopperEarningResponse>(
        '/order-management/order/getEarningForShopper',
        { params }
      )
      .subscribe({
        next: (res) => {
          this.totalEarning = res.totalEarning;
          this.totalOrder = res.totalOrder;
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.message || 'Failed to load earnings.';
        },
      })
      .add(() => {
        this.loading = false;
      });
  }
}
