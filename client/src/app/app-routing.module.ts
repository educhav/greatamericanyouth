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
import { ChatComponent } from './chat/chat.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ModelsComponent } from './models/models.component';
import { LawnServiceComponent } from './lawn-service/lawn-service.component';
import { IllegalMoviesComponent } from './illegal-movies/illegal-movies.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'news',
    component: CatalogComponent
  },
  {
    path: 'lawn-service',
    component: LawnServiceComponent,
    canActivate: [RoleGuard]
  },
  {
    path: 'illegal-movies',
    component: IllegalMoviesComponent,
    canActivate: [RoleGuard]
  },
  {
    path: 'news/:id',
    component: NewsComponent
  },
  {
    path: 'models',
    component: ModelsComponent,
    canActivate: [RoleGuard]
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
    path: 'chat',
    component: ChatComponent,
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
