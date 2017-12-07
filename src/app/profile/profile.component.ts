import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from './profile.service';
import { RegisterService } from '../auth/register.service';
import { resource, url } from '../profileActions'
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  myprofile = {};
  constructor(private profile: ProfileService, private register: RegisterService) { }
  
  @ViewChild('displayAlert') displayAlert;
  @ViewChild('emailAlert') emailAlert;
  @ViewChild('phoneAlert') phoneAlert;
  @ViewChild('zipcodeAlert') zipcodeAlert;
  @ViewChild('passwordAlert') passwordAlert;
  @ViewChild('user_img') user_img;
  @ViewChild('newimage') newimage;

  // Handle profile picture change
  handleImageChange(files): void {
    if (files.length > 0) {
      let fd = new FormData()
      fd.append('image', files[0])
      fetch(`${url}/avatar`, {
        method: 'PUT',
        credentials: 'include',
        body: fd
      })
      .then(res => res.json())
      .then(res => {
        this.myprofile['image'] = res.avatar
      })
      this.newimage.nativeElement.value = ""
    }
  }

  doValidate(display, email, phone, zipcode, password, passwordconfirm): void {
    let incorrects = this.register.getIncorrects(display, email, phone, zipcode, password, passwordconfirm)
    
    if (!incorrects[email]) {
      resource('PUT','email',{email:email})
        .then(res => {
          this.myprofile['email'] = res.email
        })
    }

    if (!incorrects[zipcode]) {
      resource('PUT','zipcode',{zipcode:zipcode})
        .then(res => {
          this.myprofile['zipcode'] = res.zipcode
        })
    }
    this.displayAlert.nativeElement.style.display = incorrects[display] && display ? "block" : "none";
    this.emailAlert.nativeElement.style.display = incorrects[email] && email ? "block" : "none";
    this.phoneAlert.nativeElement.style.display = incorrects[phone] && phone ? "block" : "none";
    this.zipcodeAlert.nativeElement.style.display = incorrects[zipcode] && zipcode ? "block" : "none";
    this.passwordAlert.nativeElement.innerHTML = incorrects[password] && password ? "Invalid format. Passwords must match and be a three-pass-phrase." : "You can't change your password right now, sorry!";
    }

  linkLocal(username, password, alert): void {
    resource('POST','login',{username:username.value, password:password.value})
    .then(res => {
      if (res.result === 'success') {
        username.value = ""
        password.value = ""
        // Redirect to login page and reset since this OAuth account is now deleted
        resource('PUT','logout')
      }
      else {
        console.log(alert.style.display)
        alert.style.display = "block"
      }
    })
    .catch(_ => {
      alert.style.display = "block"
    })
  }

  ngOnInit() {
    resource('GET','email')
      .then(res => {
        this.myprofile['name'] = res.username
        this.myprofile['email'] = res.email
        return res.username
      })
      .then(name => {
        resource('GET','avatars')
          .then(res => {
            let user = res.avatars.filter(function(user) {
              return user.username === name
            })
            this.myprofile['image'] = user[0].avatar
          })
      })
    resource('GET','zipcode')
      .then(res => {
        this.myprofile['zipcode'] = res.zipcode
      })
    resource('GET','dob')
      .then(res => {
        let date = new Date(res.dob)
        this.myprofile['dob'] = date.toDateString();
      })
    
  }
}
