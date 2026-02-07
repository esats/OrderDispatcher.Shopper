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
  styles: [`
    .blank-layout {
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  `]
})
export class BlankComponent {}
