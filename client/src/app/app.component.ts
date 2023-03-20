import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { MENU_MESSAGES } from 'src/constants/constants';
import { NewsService } from 'src/services/news.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'greatamericanyouth';
  message = this.getRandomMessage();
  constructor(private router: Router, private route: ActivatedRoute, private metaService: Meta,
    private titleService: Title, private newsService: NewsService,) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.message = this.getRandomMessage();
      }
    });

  }
  getRandomMessage() {
    return MENU_MESSAGES[Math.floor(Math.random() * MENU_MESSAGES.length)];
  }


}


