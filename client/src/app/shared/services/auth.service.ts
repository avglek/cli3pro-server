import { Injectable } from '@angular/core';
import { JWTPayload, User } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = '';

  constructor(private http: HttpClient) {}

  login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/auth/login', user).pipe(
      tap(({ token }) => {
        const decode = <JWTPayload>jwtDecode(token);
        localStorage.setItem('auth-token', token);
        if (decode) {
          localStorage.setItem('owner', decode.owner);
        }
        this.setToken(token);
      })
    );
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  getTokenInfo(): JWTPayload | null {
    const currToken = localStorage.getItem('auth-token');
    if (currToken) {
      return <JWTPayload>jwtDecode(this.token);
    }
    return null;
  }

  getCurrentUser(): string | null {
    const info = this.getTokenInfo();
    if (info) {
      return info.user;
    }
    return null;
  }

  getCurrentRoles(): string[] | null {
    const info = this.getTokenInfo();
    if (info) {
      return info.roles;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.setToken('');
    localStorage.clear();
  }

  getVersion() {
    return this.http.get('/api/version');
  }
}
