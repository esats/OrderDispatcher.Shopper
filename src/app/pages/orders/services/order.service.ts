import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BasketDetailResponse, OrderModel } from '../../../models/order.model';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<OrderModel[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(private apiService: ApiService) {}

  loadOrders(): Observable<OrderModel[]> {
    return this.apiService
      .get<OrderModel[]>('/aggregate/order-management/orders')
      .pipe(tap((orders) => this.ordersSubject.next(orders)));
  }

  getOrders(): Observable<OrderModel[]> {
    return this.orders$;
  }

  getOrderSnapshot(): OrderModel[] {
    return this.ordersSubject.getValue();
  }

  getOrderById(orderId: number): OrderModel | undefined {
    return this.ordersSubject.getValue().find((o) => o.id === orderId);
  }

  loadBasketDetail(userId: string, storeId: string): Observable<BasketDetailResponse> {
    let params = new HttpParams().set('userId', userId);
    params = params.set('storeId', storeId);
    return this.apiService.get<BasketDetailResponse>(
      '/aggregate/order-management/basketDetail',
      { params }
    );
  }
}
