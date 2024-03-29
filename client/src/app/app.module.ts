import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, ɵBrowserAnimationBuilder } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { TabViewModule } from 'primeng/tabview';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { AnimateModule } from 'primeng/animate';
import { GalleriaModule } from 'primeng/galleria';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ScrollerModule } from 'primeng/scroller';
import { ImageModule } from 'primeng/image';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PaginatorModule } from 'primeng/paginator';






import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from './user/user.component';
import { GuessWhoComponent } from './guess-who/guess-who.component';
import { LeaderboardsComponent } from './leaderboards/leaderboards.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { PublishComponent } from './publish/publish.component';
import { ChatComponent } from './chat/chat.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CatalogComponent } from './catalog/catalog.component';
import { ModelsComponent } from './models/models.component';
import { LawnServiceComponent } from './lawn-service/lawn-service.component';
import { IllegalMoviesComponent } from './illegal-movies/illegal-movies.component';

const config: SocketIoConfig = {
  url: 'https://greatamericanyouth.com',
  options: {}
};



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    UserComponent,
    GuessWhoComponent,
    LeaderboardsComponent,
    UnauthorizedComponent,
    HomeComponent,
    NewsComponent,
    PublishComponent,
    ChatComponent,
    CatalogComponent,
    ModelsComponent,
    LawnServiceComponent,
    IllegalMoviesComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ButtonModule,
    SidebarModule,
    TabViewModule,
    PasswordModule,
    ToastModule,
    ProgressSpinnerModule,
    AvatarModule,
    AnimateModule,
    TableModule,
    GalleriaModule,
    InputTextModule,
    CalendarModule,
    ReactiveFormsModule,
    InputTextareaModule,
    FileUploadModule,
    TooltipModule,
    ConfirmDialogModule,
    SocketIoModule.forRoot(config),
    ScrollerModule,
    ScrollPanelModule,
    ImageModule,
    PaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
