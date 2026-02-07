import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-full',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    SidebarComponent,
    HeaderComponent,
  ],
  template: `
    <mat-sidenav-container class="main-container">
      <mat-sidenav
        #snav
        [mode]="'side'"
        [opened]="sidenavOpened"
        class="sidenav"
      >
        <app-sidebar></app-sidebar>
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <app-header (toggleSidebar)="snav.toggle()"></app-header>
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .main-container {
      width: 100%;
      height: 100vh;
    }

    .sidenav {
      width: 260px;
      border-right: 1px solid rgba(0, 0, 0, 0.12);
    }

    .content {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .page-content {
      flex: 1;
      padding: 24px;
      overflow: auto;
      background-color: #f5f5f5;
    }
  `]
})
export class FullComponent {
  sidenavOpened = true;
}
