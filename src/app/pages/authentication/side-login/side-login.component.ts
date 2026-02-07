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
  styles: [
    `
      .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 24px;
        position: relative;
        overflow: hidden;
      }

      .login-container::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
          circle,
          rgba(255, 255, 255, 0.1) 0%,
          transparent 70%
        );
        animation: float 20s ease-in-out infinite;
      }

      @keyframes float {
        0%,
        100% {
          transform: translate(0, 0) rotate(0deg);
        }
        33% {
          transform: translate(30px, -30px) rotate(120deg);
        }
        66% {
          transform: translate(-20px, 20px) rotate(240deg);
        }
      }

      .login-wrapper {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 480px;
        animation: slideIn 0.5s ease-out;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .brand-section {
        text-align: center;
        margin-bottom: 32px;
        animation: fadeIn 0.8s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .brand-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        background: white;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        animation: bounce 1s ease-out;
      }

      @keyframes bounce {
        0% {
          transform: scale(0);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }

      .shopping-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .brand-title {
        margin: 0 0 8px 0;
        font-size: 32px;
        font-weight: 700;
        color: white;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .brand-subtitle {
        margin: 0;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
      }

      .login-card {
        border-radius: 24px;
        padding: 40px;
        background: white;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease;
      }

      .login-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35);
      }

      mat-card-header {
        margin-bottom: 32px;
        padding: 0;
      }

      .header-content {
        width: 100%;
        text-align: center;
      }

      .card-title {
        font-size: 32px !important;
        font-weight: 700 !important;
        margin-bottom: 8px !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .card-subtitle {
        font-size: 16px !important;
        color: rgba(0, 0, 0, 0.6) !important;
        font-weight: 500 !important;
      }

      mat-card-content {
        padding: 0 !important;
      }

      .full-width {
        width: 100%;
        margin-bottom: 24px;
      }

      mat-form-field {
        font-size: 16px;
      }

      .input-icon {
        color: #667eea;
        margin-right: 12px;
      }

      mat-form-field ::ng-deep .mat-mdc-text-field-wrapper {
        background: #f8f9fa;
      }

      mat-form-field ::ng-deep .mat-mdc-form-field-focus-overlay {
        background-color: transparent;
      }

      mat-form-field ::ng-deep .mdc-text-field--focused .mdc-notched-outline {
        border-color: #667eea !important;
      }

      mat-form-field
        ::ng-deep
        .mdc-text-field--focused
        .mdc-floating-label {
        color: #667eea !important;
      }

      .password-toggle {
        color: rgba(0, 0, 0, 0.6);
      }

      .password-toggle:hover {
        color: #667eea;
      }

      .error-alert {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
        border-left: 4px solid #f44336;
        border-radius: 12px;
        margin-bottom: 24px;
        animation: shake 0.5s ease-in-out;
      }

      @keyframes shake {
        0%,
        100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-10px);
        }
        75% {
          transform: translateX(10px);
        }
      }

      .error-icon {
        color: #f44336;
        font-size: 24px;
        width: 24px;
        height: 24px;
        flex-shrink: 0;
      }

      .error-alert span {
        color: #c62828;
        font-size: 14px;
        font-weight: 500;
        flex: 1;
      }

      .login-button {
        width: 100%;
        height: 56px;
        font-size: 18px;
        font-weight: 700;
        border-radius: 16px;
        margin-bottom: 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4) !important;
        transition: all 0.3s;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .login-button:hover:not(:disabled) {
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.6) !important;
        transform: translateY(-2px);
      }

      .login-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .button-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }

      .button-content mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      mat-spinner {
        margin: 0 auto;
      }

      .footer-text {
        text-align: center;
        margin-top: 24px;
        animation: fadeIn 1s ease-out 0.5s both;
      }

      .footer-text p {
        margin: 0;
        color: rgba(255, 255, 255, 0.8);
        font-size: 13px;
        font-weight: 500;
      }

      @media (max-width: 600px) {
        .login-container {
          padding: 16px;
        }

        .brand-icon {
          width: 64px;
          height: 64px;
        }

        .shopping-icon {
          font-size: 36px;
          width: 36px;
          height: 36px;
        }

        .brand-title {
          font-size: 26px;
        }

        .brand-subtitle {
          font-size: 14px;
        }

        .login-card {
          padding: 28px 20px;
        }

        .card-title {
          font-size: 26px !important;
        }

        .card-subtitle {
          font-size: 14px !important;
        }

        .full-width {
          margin-bottom: 20px;
        }

        .login-button {
          height: 52px;
          font-size: 16px;
        }
      }
    `,
  ],
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
