import { Component } from '@angular/core';
import { NewsService } from 'src/services/news.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {
  first: number = 0;
  rows: number = 10;

  constructor(private newsService: NewsService) {
    // this.newsService.getArticleMetadata();

  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }
}