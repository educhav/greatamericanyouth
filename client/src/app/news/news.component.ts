import { Component, ElementRef, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GAY_URL } from 'src/constants/api';
import { NewsService } from 'src/services/news.service';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent {
  images: object[] = [];
  subscriptions: Subscription[] = [];
  title: string = "";
  author: string = "";
  description: string = "";
  date: string = "";
  avatar: string = "";
  thumbnail: string = "";
  tags: string[] = [];
  sections: any[] = [];

  isLoading: boolean = true;


  url: string = GAY_URL;

  @ViewChild('myImage', { static: true })
  sectionImage: ElementRef | undefined;

  constructor(private route: ActivatedRoute, private metaService: Meta, private newsService: NewsService, private titleService: Title) {
    this.route.params.subscribe(params => {
      const urlName = params['id'];
      this.subscriptions.push(this.newsService.getArticleByUrl(urlName).subscribe(response => {
        let data = (response as any)[0];
          this.isLoading = false;
          this.title = data?.title;
          this.author = data?.author;
          this.date = new Date(data?.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
          this.avatar = GAY_URL + data?.avatar;
          this.thumbnail = GAY_URL + data?.thumbnail;
          if (data?.tags) {
            this.tags = JSON.parse(data?.tags);
          }
          this.sections = JSON.parse(data?.sections);
          this.description = data?.description;
          this.titleService.setTitle(this.title);
          this.metaService.updateTag({ property: 'og:image', content: this.thumbnail });
          this.metaService.updateTag({ property: 'og:title', content: this.title });
          this.metaService.updateTag({ property: 'og:description', content: this.description });
          this.metaService.updateTag({ property: 'description', content: this.description });
          this.processSections();
        }));
    });
  }

  ngOnInit() {
  }

  processSections() {
    for (let i = 1; i < this.sections.length; i++) {
      if (this.sections[i].media.length === 0) {
        let prev = i - 1;
        while (!this.sections[prev].content) prev--;
        this.sections[prev].content += '\n\n' + this.sections[i].content;
        this.sections[i].content = null;
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
