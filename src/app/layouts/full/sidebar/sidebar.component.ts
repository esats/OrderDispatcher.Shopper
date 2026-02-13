import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { navItems } from './sidebar-data';
import { OrderService } from '../../../pages/orders/services/order.service';
import { AuthService } from '../../../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, TablerIconsModule],
  template: `
    <mat-nav-list>
      <div class="brand-section">
        <h2>Shopper App</h2>
      </div>

      <ng-container *ngFor="let item of navItems">
        <!-- Nav Caption -->
        <div *ngIf="item.navCap" class="nav-caption">
          {{ item.navCap }}
        </div>

        <!-- Divider -->
        <mat-divider *ngIf="item.divider"></mat-divider>

        <!-- Nav Item -->
        <a
          *ngIf="item.route && (item.route !== '/orders/active' || (hasActiveOrder$ | async))"
          mat-list-item
          [routerLink]="[item.route]"
          routerLinkActive="active"
          class="nav-item"
        >
          <i-tabler [name]="item.iconName || 'point'" class="nav-icon"></i-tabler>
          <span class="nav-text">{{ item.displayName }}</span>
        </a>
      </ng-container>
    </mat-nav-list>
  `,
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  navItems = navItems;
  hasActiveOrder$: Observable<boolean> = of(false);

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.hasActiveOrder$ = this.orderService.getActiveOrder(userId).pipe(
        map((order) => !!order),
        catchError(() => of(false))
      );
    }
  }
}
