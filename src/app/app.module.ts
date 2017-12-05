import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import {    Routes,
            RouterModule
} from '@angular/router';

import {    MatButtonModule,
            MatSnackBarModule,
            MatCheckboxModule,
            MatFormFieldModule,
            MatListModule,
            MatInputModule,
            MatIconModule,
            MatCardModule,
            MatTooltipModule,
            MatExpansionModule
} from '@angular/material';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { HttpModule } from '@angular/http';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { ArticleComponent } from './article/article.component';
import { AuthComponent } from './auth/auth.component';
import { ProfileComponent } from './profile/profile.component';

import { ArticleService } from './article/article.service';
import { FollowService } from './article/follow.service';
import { LogoutService } from './article/logout.service';
import { LoginService } from './auth/login.service';
import { ProfileService } from './profile/profile.service';
import { OrderByPipe } from './article/order-by.pipe';
import { LinkService } from './article/link.service';


export const routes: Routes = [
 { path: '', pathMatch: 'full', redirectTo: 'auth' },
 { path: 'article', component: ArticleComponent },
 { path: 'auth', component: AuthComponent },
 { path: 'profile', component: ProfileComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ArticleComponent,
    AuthComponent,
    ProfileComponent,
    OrderByPipe
  ],
  imports: [
    HttpModule,
    MatSnackBarModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    MatCardModule,
    CustomFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  providers: [
    LinkService,
    CookieService,
    OrderByPipe,
    DatePipe,
    FollowService,
    ArticleService,
    LogoutService,
    LoginService,
    ProfileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
