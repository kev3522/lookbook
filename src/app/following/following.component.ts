import { Component, OnInit, ViewChild } from '@angular/core';
import { FollowingService } from './following.service';
import { resource } from '../profileActions'
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  follows;
  constructor(private following: FollowingService) { }

  followFetch(method, url): void {
    resource(method,url)
    .then(res => {
        this.follows = res.following.map(function(name) {
          return {username: name}
        })
        return res.following.join()
      })
      .then(followers => {
        this.updateheadlines(followers)
        this.updateavatars(followers)
      })
  }

  // Handle adding friend
  addnewfriend(friendname): void {
    this.followFetch('PUT',`following/${friendname.value}`)
    friendname.value = ""
  }

  // Get headlines of followers
  updateheadlines(followers): void {
    resource('GET',`headlines/${followers}`)
      .then(res => {
        for (let headline of res.headlines) {
          let usermap = this.follows.filter(function(user) {
            return headline.username === user.username
          })
          if (usermap[0]) {
            this.follows[this.follows.indexOf(usermap[0])]["status"] = headline.headline
          }
        }
      })
  }

  // Get pictures of followers
  updateavatars(followers): void {
    resource('GET',`avatars/${followers}`)
      .then(res => {
        for (let avatar of res.avatars) {
          let usermap = this.follows.filter(function(user) {
            return avatar.username === user.username
          })
          if (usermap[0]) {
            this.follows[this.follows.indexOf(usermap[0])]["img"] = avatar.avatar
          }
        }
      })
    }

  // Handle friend removal
  removefriend(friendname): void {
    this.followFetch('DELETE',`following/${friendname}`)
  }

  ngOnInit() {
    this.follows = []
    this.followFetch('GET','following')
  }
}
