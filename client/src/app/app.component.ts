import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { GAY_URL } from 'src/constants/api';
import { MENU_MESSAGES } from 'src/constants/constants';
import { NewsService } from 'src/services/news.service';
import { PublishService } from 'src/services/publish.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'greatamericanyouth';
  message = this.getRandomMessage();
  subscriptions: Subscription[] = [];
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

  // ngOnInit() {
  //   this.router.events.pipe(
  //     filter(event => event instanceof NavigationEnd),
  //   )
  //     .subscribe(() => {
  //       let rt = this.getChild(this.route);
  //       rt.params.subscribe((params: any) => {
  //         if (params?.id) {
  //           this.subscriptions.push(this.newsService.getArticleMetaData(params.id).subscribe(response => {
  //             let data = response as any;
  //             this.titleService.setTitle(data.title)
  //             // this.metaService.updateTag({ property: 'description', content: data.description })
  //             // this.metaService.updateTag({ property: 'og:title', content: data.title })
  //             // this.metaService.updateTag({ property: 'og:image', content: GAY_URL + data.thumbnail })
  //             // this.metaService.updateTag({ property: 'og:description', content: data.description })
  //           }))
  //         }

  //       });
  //     })

  // }
  // getChild(activatedRoute: ActivatedRoute): any {
  //   return activatedRoute.firstChild ? this.getChild(activatedRoute.firstChild) : activatedRoute;
  // }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}


