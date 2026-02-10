import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { OrderService } from '../../services/order.service';
import { BasketItem, OrderModel } from '../../../../models/order.model';

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
            <div class="store-header">
              <img *ngIf="order.storeImageUrl" [src]="order.storeImageUrl" [alt]="order.storeName" class="store-image" />
              <div class="store-header-text">
                <h1>{{ order.storeName }}</h1>
                <span class="order-id">#{{ order.id }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pay-row">
          <span *ngIf="order.total != null" class="pay-amount">\${{ order.total.toFixed(2) }}</span>
          <span *ngIf="order.tip != null" class="tip">+\${{ order.tip.toFixed(2) }} tip</span>
          <span class="distance"><i-tabler name="map-pin" class="distance-icon"></i-tabler> 4 mile</span>
        </div>

        <div class="section">
          <h2 class="section-title">Order Info</h2>
          <div class="section-body">
            <p class="info-line"><strong>Store:</strong> {{ order.storeName }}</p>
            <p *ngIf="order.shopperId" class="info-line"><strong>Shopper:</strong> {{ order.shopperId }}</p>
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

        <button mat-raised-button class="products-btn" (click)="openProductsModal()">
          <i-tabler name="package" class="products-icon"></i-tabler>
          View Products
        </button>

        <button mat-raised-button class="accept-btn" (click)="acceptOrder()">
          <i-tabler name="check" class="accept-icon"></i-tabler>
          Accept
        </button>

        <div class="modal-overlay" *ngIf="showProductsModal" (click)="closeProductsModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Products</h2>
              <button mat-icon-button (click)="closeProductsModal()">
                <i-tabler name="x"></i-tabler>
              </button>
            </div>
            <div class="modal-body">
              <div *ngIf="productsLoading" class="products-loading">
                <mat-spinner diameter="24"></mat-spinner>
              </div>
              <div *ngIf="!productsLoading && basketItems.length === 0">
                <p class="empty-text">No products available</p>
              </div>
              <div *ngIf="!productsLoading && basketItems.length > 0" class="product-list">
                <div *ngFor="let item of basketItems" class="product-item">
                  <img *ngIf="item.imageUrl" [src]="item.imageUrl" [alt]="item.productName || item.name" class="product-image" />
                  <div *ngIf="!item.imageUrl" class="product-image-placeholder">
                    <i-tabler name="package"></i-tabler>
                  </div>
                  <div class="product-info">
                    <span class="product-name">{{ item.productName || item.name }}</span>
                    <span class="product-qty">Qty: {{ item.quantity }}</span>
                  </div>
                  <span class="product-price">\${{ item.productPrice.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
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

      .store-header {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .store-image {
        width: 72px;
        height: 72px;
        border-radius: 12px;
        object-fit: cover;
        flex-shrink: 0;
      }

      .store-header-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .store-header-text h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #111;
      }

      .order-id {
        font-size: 13px;
        color: #999;
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

      .distance {
        display: flex;
        align-items: center;
        gap: 3px;
        font-size: 13px;
        font-weight: 500;
        color: #666;
      }

      .distance-icon {
        width: 14px;
        height: 14px;
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

      .products-btn {
        width: 100%;
        margin-top: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        padding: 12px;
        background: #f59e0b !important;
        color: #fff !important;
        border-radius: 10px;
      }

      .products-icon {
        width: 18px;
        height: 18px;
      }

      .accept-btn {
        width: 100%;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        padding: 12px;
        background: #2e7d32 !important;
        color: #fff !important;
        border-radius: 10px;
      }

      .accept-icon {
        width: 18px;
        height: 18px;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal-content {
        background: #fff;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #e5e5e5;
      }

      .modal-header h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #111;
      }

      .modal-body {
        padding: 24px 20px;
      }

      .modal-body .empty-text {
        text-align: center;
        font-size: 14px;
        color: #999;
        margin: 0;
      }

      .products-loading {
        display: flex;
        justify-content: center;
        padding: 24px 0;
      }

      .product-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .product-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f0f0;
      }

      .product-item:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .product-image {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        object-fit: cover;
        flex-shrink: 0;
      }

      .product-image-placeholder {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ccc;
        flex-shrink: 0;
      }

      .product-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .product-name {
        font-size: 14px;
        font-weight: 500;
        color: #111;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .product-qty {
        font-size: 12px;
        color: #888;
      }

      .product-price {
        font-size: 14px;
        font-weight: 600;
        color: #111;
        flex-shrink: 0;
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

  showProductsModal = false;
  productsLoading = false;
  basketItems: BasketItem[] = [];

  openProductsModal(): void {
    this.showProductsModal = true;
    if (this.order && this.basketItems.length === 0) {
      this.productsLoading = true;
      this.orderService
        .loadBasketDetail(this.order.customerId, this.order.storeId)
        .subscribe({
          next: (res) => {
            debugger
            this.basketItems = res.items;
            this.productsLoading = false;
          },
          error: () => {
            this.productsLoading = false;
          },
        });
    }
  }

  closeProductsModal(): void {
    this.showProductsModal = false;
  }

  acceptOrder(): void {
    // TODO: implement accept order API call
  }

  goBack(): void {
    this.router.navigate(['/orders/available']);
  }
}
