import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LeaderboardsService } from 'src/services/leaderboards.service';
import { GAMES } from 'src/constants/constants';

@Component({
  selector: 'app-leaderboards',
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.scss'],
  providers: [LeaderboardsService]
})
export class LeaderboardsComponent {
  loaded: boolean = false;
  subscriptions: Subscription[] = [];
  games: string[] = GAMES;
  leaderboards: any;
  constructor(private leaderboardsService: LeaderboardsService) {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.leaderboardsService.getLeaderboards().subscribe((games) => {
        this.loaded = true;
        this.leaderboards = games;
      })
    )
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
