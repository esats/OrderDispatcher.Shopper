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
        <span class="searching-label">
          <mat-spinner diameter="16"></mat-spinner>
          Searching new order
        </span>
      </div>

      <div class="orders-list">
        <div
          *ngFor="let order of orders$ | async"
          class="order-card"
          [class.new-order]="isNewOrder(order.id)"
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
  styleUrl: './available-orders.component.scss',
})
export class AvailableOrdersComponent implements OnInit, OnDestroy {
  orders$: Observable<OrderModel[]>;
  newOrderIds = new Set<number>();
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

    this.dispatchSocket.connect();

    this.dispatchSocket.orderNew$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const existingIds = new Set(
        this.orderService.getOrderSnapshot().map((o) => o.id)
      );
      this.orderService.loadOrders().subscribe((orders) => {
        const incoming = orders.filter((o) => !existingIds.has(o.id));
        incoming.forEach((o) => {
          this.newOrderIds.add(o.id);
          setTimeout(() => this.newOrderIds.delete(o.id), 5000);
        });
      });
    });

    this.dispatchSocket.orderClosed$.pipe(takeUntil(this.destroy$)).subscribe((payload) => {
      this.orderService.removeOrder(Number(payload.orderId));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isNewOrder(orderId: number): boolean {
    return this.newOrderIds.has(orderId);
  }

  viewOrderDetail(orderId: number): void {
    this.router.navigate(['/orders/detail', orderId]);
  }
}
