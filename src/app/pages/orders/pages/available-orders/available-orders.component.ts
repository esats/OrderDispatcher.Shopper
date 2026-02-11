import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { OrderService } from '../../services/order.service';
import { OrderModel } from '../../../../models/order.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DispatchSocketService } from '../../../../services/dispatch-socket.service';

@Component({
  selector: 'app-available-orders',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Available Orders</h1>
      </div>

      <div class="orders-list">
        <div
          *ngFor="let order of orders$ | async"
          class="order-card"
        >
          <div class="card-left">
            <img *ngIf="order.storeImageUrl" [src]="order.storeImageUrl" [alt]="order.storeName" class="store-image" />
            <span class="store-name">{{ order.storeName }}</span>
          </div>

          <div class="card-right">
            <div class="card-top">
              <span class="order-id">#{{ order.id }}</span>
            </div>

            <div class="meta-row">
              <span *ngIf="order.total != null" class="pay">\${{ order.total.toFixed(2) }}</span>
              <span *ngIf="order.tip != null" class="tip">+\${{ order.tip.toFixed(2) }} tip</span>
            </div>

            <div class="info-row">
              <span class="info-item distance-item"><i-tabler name="map-pin" class="distance-icon"></i-tabler> 4 mile</span>
              <span *ngIf="order.deliveryFee != null" class="info-item">Delivery: \${{ order.deliveryFee.toFixed(2) }}</span>
              <span *ngIf="order.serviceFee != null" class="info-item">Service: \${{ order.serviceFee.toFixed(2) }}</span>
            </div>

            <div *ngIf="order.notes" class="note">
              {{ order.notes }}
            </div>

            <div class="actions">
              <button mat-button class="details-btn" (click)="viewOrderDetail(order.id)">Details</button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="(orders$ | async)?.length === 0" class="empty-state">
        <p class="empty-text">No available orders</p>
        <p class="empty-sub">Check back later for new orders</p>
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
        flex-wrap: wrap;
        gap: 12px;
      }

      .page-header h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #111;
      }

      .orders-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .order-card {
        display: flex;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 10px;
        overflow: hidden;
        transition: background 0.15s;
      }

      .order-card:hover {
        background: #fafafa;
      }

      .order-card {
        display: flex;
        align-items: stretch;
      }

      .card-left {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 14px 16px;
        gap: 8px;
        flex-shrink: 0;
        width: 110px;
      }

      .store-image {
        width: 130px;
        height: 130px;
        border-radius: 12px;
        object-fit: cover;
      }

      .store-name {
        font-size: 13px;
        font-weight: 600;
        color: #111;
        text-align: center;
        word-break: break-word;
      }

      .card-right {
        flex: 1;
        padding: 14px 16px 14px 0;
        min-width: 0;
      }

      .card-top {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 6px;
      }

      .order-id {
        font-size: 12px;
        color: #999;
      }

      .status-label {
        font-size: 11px;
        font-weight: 600;
        color: #2e7d32;
        background: #e8f5e9;
        padding: 3px 10px;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .meta-row {
        display: flex;
        align-items: baseline;
        gap: 6px;
        margin-bottom: 8px;
        flex-wrap: wrap;
      }

      .pay {
        font-size: 16px;
        font-weight: 700;
        color: #111;
      }

      .tip {
        font-size: 12px;
        font-weight: 500;
        color: #43a047;
      }

      .info-row {
        display: flex;
        gap: 12px;
        margin-bottom: 8px;
        flex-wrap: wrap;
      }

      .info-item {
        font-size: 12px;
        color: #666;
      }

      .distance-item {
        display: flex;
        align-items: center;
        gap: 3px;
        font-weight: 500;
      }

      .distance-icon {
        width: 14px;
        height: 14px;
      }

      .customer-row {
        display: flex;
        gap: 8px;
        font-size: 13px;
        color: #555;
        margin-bottom: 4px;
      }

      .customer-id {
        font-weight: 500;
      }

      .note {
        font-size: 12px;
        color: #b26a00;
        background: #fff8e1;
        padding: 6px 10px;
        border-radius: 6px;
        margin-top: 6px;
        margin-bottom: 4px;
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 8px;
      }

      .actions button {
        font-size: 13px;
        font-weight: 500;
      }

      .details-btn {
        color: #f59e0b !important;
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
        margin: 0;
        font-size: 13px;
        color: #999;
      }

      @media (max-width: 600px) {
        .page-container { padding: 16px; }
        .meta-row { flex-wrap: wrap; }
        .customer-row { flex-direction: column; gap: 2px; }
      }
    `,
  ],
})
export class AvailableOrdersComponent implements OnInit, OnDestroy {
  orders$: Observable<OrderModel[]>;
  private destroy$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private router: Router,
    private dispatchSocket: DispatchSocketService
  ) {
    this.orders$ = this.orderService.getOrders();
  }

  ngOnInit(): void {
    this.orderService.loadOrders().subscribe();

    debugger
    this.dispatchSocket.connect();

    this.dispatchSocket.orderNew$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.orderService.loadOrders().subscribe();
    });

    this.dispatchSocket.orderClosed$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.orderService.loadOrders().subscribe();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  viewOrderDetail(orderId: number): void {
    this.router.navigate(['/orders/detail', orderId]);
  }
}
