import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [JwtHelperService, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }]
})
export class UserComponent {
  username: string = ""
  constructor(private authService: AuthService, private router: Router) {
    this.username = this.authService.getUsername();
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
