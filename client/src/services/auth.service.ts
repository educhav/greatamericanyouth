import { Injectable } from '@angular/core';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public jwtHelper: JwtHelperService) { }
  isLoggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
  login(token: any) {
    localStorage.setItem('token', token);
  }
  logout() {
    localStorage.removeItem('token');
  }
  getToken(): any {
    return localStorage.getItem('token');
  }
  getUsername() {
    const token = localStorage.getItem('token');
    if (token === null) {
      return;
    }
    const decodedToken: any = jwt_decode(token);
    if (decodedToken.identity) {
      return decodedToken.identity.username;
    }
    else if (decodedToken.sub) {
      return decodedToken.sub.username;
    }
    return null;
  }
  getRole() {
    const token = localStorage.getItem('token');
    if (token === null) {
      return;
    }
    const decodedToken: any = jwt_decode(token);
    if (decodedToken.identity) {
      return decodedToken.identity.role;
    }
    else if (decodedToken.sub) {
      return decodedToken.sub.role;
    }
    return null;
  }
}
