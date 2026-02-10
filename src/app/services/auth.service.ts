import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { ApiService } from './api.service';

export interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  userId: string;
  email: string;
  bearerToken: string;
}

interface ApiResponse<T> {
  value: T;
  message: string;
  exception: any;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenLifetimeMs = 24 * 60 * 60 * 1000;
  private readonly loginPath = '/auth/login';

  private authenticatedSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  public authenticated$ = this.authenticatedSubject.asObservable();

  constructor(private readonly apiService: ApiService) {}

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.apiService.post<ApiResponse<LoginResponse>>(this.loginPath, payload).pipe(
      map((response) => response.value),
      tap((data) => {
        const expiresAt = Date.now() + this.tokenLifetimeMs;
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.bearerToken);
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN_EXPIRES_AT, expiresAt.toString());
        localStorage.setItem(STORAGE_KEYS.AUTH_USER_ID, data.userId);
        this.authenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN_EXPIRES_AT);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER_ID);
    this.authenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const expiresAt = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN_EXPIRES_AT);
    if (!expiresAt) return false;

    return Date.now() < Number(expiresAt);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  getUserId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_USER_ID);
  }
}
