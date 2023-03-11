import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/services/login.service';
import { AuthService } from 'src/services/auth.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService, LoginService, HttpClient, AuthService, JwtHelperService, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }]
})
export class LoginComponent implements OnDestroy {
  loginUsername: string = "";
  loginPassword: string = "";
  registerUsername: string = "";
  registerPassword: string = "";
  subscriptions: Subscription[] = [];


  constructor(private messageService: MessageService, private loginService: LoginService,
    private authService: AuthService, private router: Router) {
  }
  login() {
    if (!this.loginUsername && !this.loginPassword)
      this.showError("Fields required: username and password");
    else if (!this.loginUsername)
      this.showError("Fields required: username");
    else if (!this.loginPassword)
      this.showError("Fields required: password");

    this.subscriptions.push(
      this.loginService.login(this.loginUsername, this.loginPassword)
        .subscribe((data: any) => {
          if (data.status === 'error') {
            this.showError("Login info is incorrect.. register maybe.. source?")
          }
          else {
            this.authService.login(data.token);
            this.showSuccess("Successfully logged in as: " + this.loginUsername)
            this.router.navigate(['user']);
          }

        }, (error) => {
          this.showError("INTERNAL SERVER ERROR: DON'T PANIC!")
        }));

  }
  register() {
    if (!this.registerUsername && !this.registerPassword)
      this.showError("Fields required: username and password");
    else if (!this.registerUsername)
      this.showError("Fields required: username");
    else if (!this.registerPassword)
      this.showError("Fields required: password");
    this.subscriptions.push(
      this.loginService.register(this.registerUsername, this.registerPassword)
        .subscribe((data: any) => {
          if (data.status === 'error') {
            this.showError("Name already registered.. source?");
          }
          else {
            this.authService.login(data.token);
            this.showSuccess("Successfully registered and logged in as: " + this.registerUsername);
            this.router.navigate(['user']);
          }
        }, (error) => {
          this.showError("INTERNAL SERVER ERROR: DON'T PANIC!")
        }));
  }
  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
