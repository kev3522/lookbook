import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component'
import { MainComponent} from './main/main.component'
import { ArticleComponent } from './article/article.component'
import { FollowingComponent } from './following/following.component'

import { RegisterService } from './auth/register.service';
import { LoginService } from './auth/login.service';
import { ProfileService } from './profile/profile.service'
import { HeadlineService } from './main/headline.service';
import { FollowingService } from './following/following.service';
import { ArticlesService } from './article/articles.service'
import { NewArticleService } from './article/new-article.service'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select'

export const routes: Routes = [
	{
	  path: '',
	  component: AuthComponent,
	  pathMatch: 'full'
	},
	{
	  path: 'auth',
	  component: AuthComponent,
	  pathMatch: 'full'
	},
	{
	  path: 'main',
	  component: MainComponent,
	  pathMatch: 'full'
	},
	{
	  path: 'profile',
	  component: ProfileComponent,
	  pathMatch: 'full'
	}
];

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ProfileComponent,
    MainComponent,
    ArticleComponent,
    FollowingComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatSelectModule
  ],
  providers: [
  	RegisterService,
  	LoginService,
  	ProfileService,
  	HeadlineService,
  	FollowingService,
  	ArticlesService,
  	NewArticleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
