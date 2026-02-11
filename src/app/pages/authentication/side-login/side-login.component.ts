import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, ReactiveFormsModule, CommonModule],
  template: `
    <div class="login-container">
      <div class="login-wrapper">
        <div class="brand-section">
          <div class="brand-icon">
            <mat-icon class="shopping-icon">shopping_cart</mat-icon>
          </div>
          <h1 class="brand-title">Order Dispatcher</h1>
          <p class="brand-subtitle">Shopper Portal</p>
        </div>

        <mat-card class="login-card mat-elevation-z8">
          <mat-card-header>
            <div class="header-content">
              <mat-card-title class="card-title">Welcome Back!</mat-card-title>
              <mat-card-subtitle class="card-subtitle">
                Login to your shopper account
              </mat-card-subtitle>
            </div>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="submit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email Address</mat-label>
                <mat-icon matPrefix class="input-icon">email</mat-icon>
                <input
                  matInput
                  type="email"
                  formControlName="email"
                  placeholder="shopper@example.com"
                />
                <mat-error *ngIf="f['email'].hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="f['email'].hasError('email')">
                  Please enter a valid email address
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <mat-icon matPrefix class="input-icon">lock</mat-icon>
                <input
                  matInput
                  [type]="hidePassword ? 'password' : 'text'"
                  formControlName="password"
                  placeholder="Enter your password"
                />
                <button
                  mat-icon-button
                  matSuffix
                  type="button"
                  (click)="hidePassword = !hidePassword"
                  class="password-toggle"
                >
                  <mat-icon>{{
                    hidePassword ? 'visibility_off' : 'visibility'
                  }}</mat-icon>
                </button>
                <mat-error *ngIf="f['password'].hasError('required')">
                  Password is required
                </mat-error>
                <mat-error *ngIf="f['password'].hasError('minlength')">
                  Password must be at least 6 characters
                </mat-error>
              </mat-form-field>

              <div *ngIf="errorMessage" class="error-alert">
                <mat-icon class="error-icon">error_outline</mat-icon>
                <span>{{ errorMessage }}</span>
              </div>

              <button
                mat-raised-button
                color="primary"
                type="submit"
                class="login-button"
                [disabled]="loading"
              >
                <span *ngIf="!loading" class="button-content">
                  <mat-icon>login</mat-icon>
                  <span>Sign In</span>
                </span>
                <mat-spinner *ngIf="loading" diameter="24"></mat-spinner>
              </button>

            </form>
          </mat-card-content>
        </mat-card>

        <div class="footer-text">
          <p>© 2024 Order Dispatcher. All rights reserved.</p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './side-login.component.scss',
})
export class AppSideLoginComponent {
  loading = false;
  errorMessage = '';
  hidePassword = true;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;
    this.loading = true;
    this.errorMessage = '';

    this.authService
      .login({ email: email ?? '', password: password ?? '' })
      .subscribe({
        next: () => {
          const returnUrl =
            this.route.snapshot.queryParamMap.get('returnUrl') || '/orders/available';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.message || err?.message || 'Unable to login. Please try again.';
        },
      })
      .add(() => {
        this.loading = false;
      });
  }
}
