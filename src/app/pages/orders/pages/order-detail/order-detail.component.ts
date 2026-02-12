import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../../../services/auth.service';
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
  styleUrl: './order-detail.component.scss',
})
export class OrderDetailComponent implements OnInit {
  order: OrderModel | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
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
    debugger
    const shopperId = this.authService.getUserId();
    if (!this.order || !shopperId) return;

    this.orderService.assignToShopper({ shopperId, orderId: this.order.id }).subscribe({
      next: () => {
        this.router.navigate(['/orders/active']);
      },
      error: (err) => {
        console.error('Failed to accept order', err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/orders/available']);
  }
}
