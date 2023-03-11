import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { UserGuard } from './user.guard';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { GuessWhoComponent } from './guess-who/guess-who.component';
import { RoleGuard } from './role.guard';
import { LeaderboardsComponent } from './leaderboards/leaderboards.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { PublishComponent } from './publish/publish.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Home | Great American Youth',
      description: '',
      ogTitle: '',
    }
  },
  {
    path: 'news',
    component: NewsComponent
  },
  {
    path: 'news/:id',
    component: NewsComponent

  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'guess-who',
    component: GuessWhoComponent,
    canActivate: [RoleGuard]
  },
  {
    path: 'leaderboards',
    component: LeaderboardsComponent,
    canActivate: [RoleGuard]
  },
  {
    path: 'publish',
    component: PublishComponent,
    canActivate: [RoleGuard]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [JwtHelperService, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }]
})
export class AppRoutingModule { }
