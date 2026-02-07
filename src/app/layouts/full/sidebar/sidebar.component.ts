import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { navItems } from './sidebar-data';

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
          *ngIf="item.route"
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
  styles: [`
    .brand-section {
      padding: 24px 16px;
      text-align: center;
      border-bottom: 1px solid rgba(0,0,0,0.12);
    }

    .brand-section h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #667eea;
    }

    .nav-caption {
      padding: 16px 16px 8px;
      font-size: 12px;
      font-weight: 600;
      color: rgba(0,0,0,0.54);
      text-transform: uppercase;
    }

    .nav-item {
      margin: 4px 8px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      height: 48px;
    }

    .nav-item:hover {
      background-color: rgba(0,0,0,0.04);
    }

    .nav-item.active {
      background-color: #667eea;
      color: white;
    }

    .nav-icon {
      width: 20px;
      height: 20px;
    }

    .nav-text {
      font-size: 14px;
      font-weight: 500;
    }
  `]
})
export class SidebarComponent {
  navItems = navItems;
}
