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
  styleUrl: './full.component.scss'
})
export class FullComponent {
  sidenavOpened = true;
}
