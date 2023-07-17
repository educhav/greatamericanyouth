import { Component } from '@angular/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  display: boolean = false;
  isParty: boolean = false;
  isSemiParty: boolean = false;
  constructor(private authService: AuthService) {
  }
  ngOnInit() {
    this.isParty = this.authService.getRole() === 'party';
    this.isSemiParty = this.authService.getRole() == 'semi-party';
  }

}
