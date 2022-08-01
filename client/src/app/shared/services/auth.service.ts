import { Injectable } from '@angular/core';
import { User } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';

interface jwtPayload {
  iat: number;
  owner: string;
  roles: string[];
  user: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = '';

  constructor(private http: HttpClient) {}

  login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/auth/login', user).pipe(
      tap(({ token }) => {
        const decode = <jwtPayload>jwtDecode(token);
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

  getCurrentUser() {
    const decode = jwtDecode<jwtPayload>(this.token);
    if (decode) {
      return decode.user;
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
}
