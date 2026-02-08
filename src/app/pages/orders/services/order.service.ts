import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { OrderModel } from '../../../models/order.model';
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
      .get<OrderModel[]>('/api/order-management/order/getAll')
      .pipe(
        tap((orders) => this.ordersSubject.next(orders))
      );
  }

  getOrders(): Observable<OrderModel[]> {
    return this.orders$;
  }

  getOrderById(orderId: number): OrderModel | undefined {
    return this.ordersSubject.getValue().find((o) => o.id === orderId);
  }
}
