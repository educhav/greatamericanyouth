import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent {
  images: object[] = [];
  constructor(private meta: Meta) {
    this.images = [
      { 'src': '../assets/patt1.png', 'alt': 'J Cole Patt, 21, Zion, IL booked into Dane County Jail on charges of disorderly conduct' },
      { 'src': '../assets/evers.jpeg', 'alt': 'Tony Evers, Governor of Wisconsin' },
    ]
    this.meta.updateTag({ property: 'og:image', content: '../assets/patt1.png' });

  }
  ngOnInit() {
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('property', 'og:image');
    metaTag.setAttribute('content', '../assets/patt1.png');
    document.getElementsByTagName('head')[0].appendChild(metaTag);
  }

}
