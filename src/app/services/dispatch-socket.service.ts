import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface OrderNewPayload {
  orderId: string;
}

export interface OrderClosedPayload {
  orderId: string;
  reason: 'assigned' | 'cancelled';
}

@Injectable({
  providedIn: 'root',
})
export class DispatchSocketService implements OnDestroy {
  private socket: Socket | null = null;

  private orderNewSubject = new Subject<OrderNewPayload>();
  private orderClosedSubject = new Subject<OrderClosedPayload>();

  public orderNew$: Observable<OrderNewPayload> = this.orderNewSubject.asObservable();
  public orderClosed$: Observable<OrderClosedPayload> = this.orderClosedSubject.asObservable();

  constructor(private authService: AuthService) {}

  connect(): void {
    if (this.socket?.connected) return;

    const token = this.authService.getToken();
    const shopperId = this.authService.getUserId();
    if (!token || !shopperId) return;

    this.socket = io(`${environment.wsUrl}/dispatch`, {
      auth: { token },
      query: { shopperId },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    this.socket.on('order.new', (payload: OrderNewPayload) => {
      this.orderNewSubject.next(payload);
    });

    this.socket.on('order.closed', (payload: OrderClosedPayload) => {
      this.orderClosedSubject.next(payload);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
