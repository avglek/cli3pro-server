import { Injectable } from '@angular/core';
import { JWTPayload, User } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import { TabDataService } from './tab-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = '';
  private owner = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private tabService: TabDataService) {
    const initOwner = localStorage.getItem('owner');
    console.log('init owner:', initOwner);
    if (initOwner) this.owner.next(initOwner);
  }

  login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/auth/login', user).pipe(
      tap(({ token }) => {
        const decode = <JWTPayload>jwtDecode(token);
        localStorage.setItem('auth-token', token);
        if (decode) {
          console.log(decode);
          this.owner.next(decode.owner);
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

  getCurrentOwner(): Observable<string> {
    return this.owner;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    console.log('logout');
    this.tabService.clean();
    this.setToken('');
    localStorage.clear();
  }

  getVersion() {
    return this.http.get('/api/version');
  }

  changeOwner(selectedValue: string) {
    this.owner.next(selectedValue);
    localStorage.setItem('owner', selectedValue);
  }
}
