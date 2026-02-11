import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blank',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="blank-layout">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrl: './blank.component.scss'
})
export class BlankComponent {}
