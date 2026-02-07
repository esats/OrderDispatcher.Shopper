import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  Order,
  OrderItem,
  OrderStatus,
  OrderPriority,
} from '../../../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private availableOrdersSubject = new BehaviorSubject<Order[]>([]);
  private activeOrdersSubject = new BehaviorSubject<Order[]>([]);
  private currentOrderSubject = new BehaviorSubject<Order | null>(null);

  public availableOrders$ = this.availableOrdersSubject.asObservable();
  public activeOrders$ = this.activeOrdersSubject.asObservable();
  public currentOrder$ = this.currentOrderSubject.asObservable();

  // Mock data
  private mockOrders: Order[] = [
    {
      id: 'ORD-001',
      customerId: 'CUST-001',
      customerName: 'Sarah Johnson',
      customerAddress: '123 Main St, Apt 4B, New York, NY 10001',
      customerPhone: '+1234567890',
      storeId: 'STORE-001',
      storeName: 'Whole Foods Market',
      storeAddress: '456 Market St, New York, NY 10002',
      status: OrderStatus.AVAILABLE,
      priority: OrderPriority.HIGH,
      itemCount: 15,
      estimatedPay: 28.5,
      estimatedTime: 45,
      distance: 3.2,
      items: this.generateMockItems('ORD-001', 15),
      specialInstructions: 'Please select ripe avocados',
      deliveryInstructions: 'Leave at door, ring bell',
      tip: 5.0,
      createdAt: new Date(),
    },
    {
      id: 'ORD-002',
      customerId: 'CUST-002',
      customerName: 'Michael Chen',
      customerAddress: '789 Oak Avenue, Brooklyn, NY 11201',
      customerPhone: '+1987654321',
      storeId: 'STORE-002',
      storeName: "Trader Joe's",
      storeAddress: '321 Park Ave, Brooklyn, NY 11205',
      status: OrderStatus.AVAILABLE,
      priority: OrderPriority.MEDIUM,
      itemCount: 8,
      estimatedPay: 18.75,
      estimatedTime: 30,
      distance: 2.1,
      items: this.generateMockItems('ORD-002', 8),
      tip: 3.5,
      createdAt: new Date(Date.now() - 10 * 60000),
    },
    {
      id: 'ORD-003',
      customerId: 'CUST-003',
      customerName: 'Emily Rodriguez',
      customerAddress: '555 Elm Street, Queens, NY 11354',
      customerPhone: '+1555123456',
      storeId: 'STORE-003',
      storeName: 'Target',
      storeAddress: '777 Queens Blvd, Queens, NY 11355',
      status: OrderStatus.AVAILABLE,
      priority: OrderPriority.URGENT,
      itemCount: 22,
      estimatedPay: 42.0,
      estimatedTime: 60,
      distance: 5.8,
      items: this.generateMockItems('ORD-003', 22),
      specialInstructions: 'Check expiration dates on dairy products',
      tip: 10.0,
      createdAt: new Date(Date.now() - 5 * 60000),
    },
    {
      id: 'ORD-004',
      customerId: 'CUST-004',
      customerName: 'David Kim',
      customerAddress: '999 Broadway, Manhattan, NY 10012',
      customerPhone: '+1444555666',
      storeId: 'STORE-001',
      storeName: 'Whole Foods Market',
      storeAddress: '456 Market St, New York, NY 10002',
      status: OrderStatus.AVAILABLE,
      priority: OrderPriority.LOW,
      itemCount: 5,
      estimatedPay: 12.25,
      estimatedTime: 20,
      distance: 1.5,
      items: this.generateMockItems('ORD-004', 5),
      tip: 2.0,
      createdAt: new Date(Date.now() - 15 * 60000),
    },
  ];

  constructor() {
    // Initialize with mock data
    this.availableOrdersSubject.next(
      this.mockOrders.filter((o) => o.status === OrderStatus.AVAILABLE)
    );
  }

  getAvailableOrders(): Observable<Order[]> {
    return this.availableOrders$;
  }

  getActiveOrders(): Observable<Order[]> {
    return this.activeOrders$;
  }

  getCurrentOrder(): Observable<Order | null> {
    return this.currentOrder$;
  }

  acceptOrder(orderId: string): Observable<Order> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const order = this.mockOrders.find((o) => o.id === orderId);
        if (!order) {
          throw new Error('Order not found');
        }

        order.status = OrderStatus.ACCEPTED;
        order.acceptedAt = new Date();

        // Update subjects
        this.availableOrdersSubject.next(
          this.mockOrders.filter((o) => o.status === OrderStatus.AVAILABLE)
        );
        this.activeOrdersSubject.next(
          this.mockOrders.filter(
            (o) =>
              o.status === OrderStatus.ACCEPTED ||
              o.status === OrderStatus.SHOPPING
          )
        );
        this.currentOrderSubject.next(order);

        return order;
      })
    );
  }

  startShopping(orderId: string): Observable<Order> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const order = this.mockOrders.find((o) => o.id === orderId);
        if (!order) {
          throw new Error('Order not found');
        }

        order.status = OrderStatus.SHOPPING;
        this.currentOrderSubject.next(order);

        return order;
      })
    );
  }

  getOrderById(orderId: string): Observable<Order> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const order = this.mockOrders.find((o) => o.id === orderId);
        if (!order) {
          throw new Error('Order not found');
        }
        return order;
      })
    );
  }

  private generateMockItems(orderId: string, count: number): OrderItem[] {
    const mockProducts = [
      {
        name: 'Organic Bananas',
        category: 'Produce',
        price: 0.79,
        image: 'banana.jpg',
        unit: 'lb',
      },
      {
        name: 'Whole Milk',
        category: 'Dairy',
        price: 4.99,
        image: 'milk.jpg',
        unit: 'gallon',
      },
      {
        name: 'Large Eggs',
        category: 'Dairy',
        price: 5.49,
        image: 'eggs.jpg',
        unit: 'dozen',
      },
      {
        name: 'Organic Baby Spinach',
        category: 'Produce',
        price: 4.99,
        image: 'spinach.jpg',
        unit: 'each',
      },
      {
        name: 'Ground Beef 80/20',
        category: 'Meat',
        price: 5.99,
        image: 'beef.jpg',
        unit: 'lb',
      },
      {
        name: 'Chicken Breast',
        category: 'Meat',
        price: 7.99,
        image: 'chicken.jpg',
        unit: 'lb',
      },
      {
        name: 'Strawberries',
        category: 'Produce',
        price: 5.99,
        image: 'strawberries.jpg',
        unit: 'each',
      },
      {
        name: 'Bread - Whole Wheat',
        category: 'Bakery',
        price: 3.99,
        image: 'bread.jpg',
        unit: 'each',
      },
      {
        name: 'Orange Juice',
        category: 'Beverages',
        price: 4.99,
        image: 'oj.jpg',
        unit: 'each',
      },
      {
        name: 'Pasta - Penne',
        category: 'Pantry',
        price: 1.99,
        image: 'pasta.jpg',
        unit: 'each',
      },
    ];

    return Array.from({ length: count }, (_, i) => {
      const product = mockProducts[i % mockProducts.length];
      return {
        id: `ITEM-${orderId}-${i + 1}`,
        orderId,
        productId: `PROD-${i + 1}`,
        productName: product.name,
        productImage: product.image,
        category: product.category,
        quantity: Math.floor(Math.random() * 3) + 1,
        unit: product.unit,
        price: product.price,
        found: false,
        scanned: false,
      };
    });
  }
}
