import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GAY_URL } from 'src/constants/api';
import { NewsService } from 'src/services/news.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {
  first: number = 0;
  rows: number = 10;
  articles: any[] = [];
  subscriptions: Subscription[] = [];
  url: string = "";
  baseUrl: string = "";

  constructor(private newsService: NewsService) {
    this.url = GAY_URL;
    this.baseUrl = this.url + 'news/'
    this.subscriptions.push(this.newsService.getArticleMetadata('', true).subscribe((res: any) => {
      this.articles = res;
      console.log(this.articles);
    }));
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  onDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}