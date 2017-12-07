import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeadlineService } from './headline.service';
import { FollowingService } from '../following/following.service';
import { ProfileService } from '../profile/profile.service'
import { resource } from '../profileActions'
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  constructor(private headline: HeadlineService) { }

  load_name;
  avatar;
  status;

  logout(): void {
    resource('PUT','logout')
  }

  updateStatus(newstatus): void {
    resource('PUT','headline',{headline: newstatus.value})
    .then(res => {
      this.status = res.headline
      newstatus.value = ""
    })
  }

  ngOnInit() {
    // Initialize information from database
    resource('GET','following')
      .then(res => {
        this.load_name = res.username
        return this.load_name
      })
      .then(name => {
        resource('GET', `avatars/${name}`)
          .then(res => {
            this.avatar = res.avatars.find(function(user) {
              return user.username === name
            }).avatar
          })
        resource('GET', `headlines/${name}`)
          .then(res => {
            this.status = res.headlines.find(function(user) {
              return user.username === name
            }).headline
          })
      })
  }
}
