import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { GAY_URL } from 'src/constants/api';
import { AuthService } from 'src/services/auth.service';
import { NewsService } from 'src/services/news.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [JwtHelperService, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }]
})
export class UserComponent {
  username: string = ""
  url: string = "";
  articles: any[] = [];
  subscriptions: Subscription[] = [];
  constructor(private authService: AuthService, private router: Router, private newsService: NewsService) {
    this.username = this.authService.getUsername();
    this.url = GAY_URL;
    this.subscriptions.push(this.newsService.getArticleByUsername(this.username).subscribe(
      (response) => {
        let data = response as any;
        this.articles = data;
        console.log(this.articles);
      }
    ))

  }
  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
