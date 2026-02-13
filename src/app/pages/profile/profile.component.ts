import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ProfileData {
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  userName: string;
}

interface ApiResponse<T> {
  value: T;
  message: string;
  exception: any;
  data: any;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, TablerIconsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>My Profile</h1>
      </div>

      <mat-card class="profile-card">
        <mat-card-header>
          <div class="card-header-content">
            <div class="avatar-circle">
              <i-tabler name="user" class="avatar-icon"></i-tabler>
            </div>
            <mat-card-title>Personal Information</mat-card-title>
            <mat-card-subtitle>Manage your account details</mat-card-subtitle>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <form
            *ngIf="!loading"
            [formGroup]="form"
            (ngSubmit)="save()"
            class="profile-form"
          >
            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>First Name</mat-label>
                <mat-icon matPrefix class="input-icon">person</mat-icon>
                <input
                  matInput
                  formControlName="firstName"
                  placeholder="Enter your first name"
                />
                <mat-error *ngIf="f['firstName'].hasError('required')">
                  First name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Last Name</mat-label>
                <mat-icon matPrefix class="input-icon">person_outline</mat-icon>
                <input
                  matInput
                  formControlName="lastName"
                  placeholder="Enter your last name"
                />
                <mat-error *ngIf="f['lastName'].hasError('required')">
                  Last name is required
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Phone Number</mat-label>
              <mat-icon matPrefix class="input-icon">phone</mat-icon>
              <input
                matInput
                formControlName="phoneNumber"
                placeholder="Enter your phone number"
              />
              <mat-error *ngIf="f['phoneNumber'].hasError('required')">
                Phone number is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix class="input-icon">email</mat-icon>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="Enter your email address"
              />
              <mat-error *ngIf="f['email'].hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="f['email'].hasError('email')">
                Please enter a valid email address
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
              class="save-button"
              [disabled]="saving"
            >
              <span *ngIf="!saving" class="button-content">
                <mat-icon>save</mat-icon>
                <span>Save Changes</span>
              </span>
              <mat-spinner *ngIf="saving" diameter="24"></mat-spinner>
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  loading = true;
  saving = false;
  errorMessage = '';

  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar
  ) {}

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    const userId = this.authService.getUserId();
    this.apiService
      .get<ApiResponse<ProfileData>>(`/engagement/profile/getOne/${userId}`)
      .subscribe({
        next: (res) => {
          this.form.patchValue({
            firstName: res.value.firstName,
            lastName: res.value.lastName,
            phoneNumber: res.value.phoneNumber,
            email: res.value.email,
          });
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.message || 'Failed to load profile data.';
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    const userId = this.authService.getUserId();

    this.apiService
      .post(`/engagement/profile/save`, this.form.value)
      .subscribe({
        next: () => {
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.message || 'Failed to update profile. Please try again.';
        },
      })
      .add(() => {
        this.saving = false;
      });
  }
}
