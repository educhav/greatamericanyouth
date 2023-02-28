import { Component } from '@angular/core';
import { GAY_GALLERY } from 'src/constants/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  images: object[] = [];
  constructor() {
    this.images = GAY_GALLERY;
  }
}
