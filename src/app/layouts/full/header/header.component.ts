import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  template: `
    <mat-toolbar color="primary" class="header">
      <button mat-icon-button (click)="toggleSidebar.emit()">
        <i-tabler name="menu-2"></i-tabler>
      </button>

      <span class="spacer"></span>

      <button mat-icon-button>
        <i-tabler name="bell"></i-tabler>
      </button>

      <button mat-icon-button [matMenuTriggerFor]="userMenu">
        <i-tabler name="user-circle"></i-tabler>
      </button>

      <mat-menu #userMenu="matMenu">
        <button mat-menu-item (click)="goToProfile()">
          <i-tabler name="user"></i-tabler>
          <span>Profile</span>
        </button>
        <button mat-menu-item>
          <i-tabler name="settings"></i-tabler>
          <span>Settings</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <i-tabler name="logout"></i-tabler>
          <span>Logout</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  toggleSidebar = new EventEmitter<void>();

  constructor(private router: Router) {}

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    localStorage.removeItem('shopper_auth_token');
    localStorage.removeItem('shopper_user');
    this.router.navigate(['/authentication/login']);
  }
}

import { EventEmitter } from '@angular/core';
