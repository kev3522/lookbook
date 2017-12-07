import { Component, OnInit, ViewChild } from '@angular/core';
import { RegisterService } from './register.service'
import { LoginService } from './login.service'
import { Router } from '@angular/router'
import { resource, url } from '../profileActions'
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  constructor(private register: RegisterService, private login: LoginService, private router:Router) { }

  @ViewChild('displayAlert') displayAlert;
  @ViewChild('emailAlert') emailAlert;
  @ViewChild('phoneAlert') phoneAlert;
  @ViewChild('zipcodeAlert') zipcodeAlert;
  @ViewChild('passwordAlert') passwordAlert;

  doLogin(username, password, alert): void {
    resource('POST','login', {username : username, password : password})
      .then(res => {
        if (res.status === 401) {
          alert.style.display = "block"
        }
        this.login.validateLogin(res, alert)
      })
      .catch(err => {
        alert.style.display = "block"
      })
    if (! new RegExp("[a-zA-Z]+\-[a-zA-Z]+\-[a-zA-Z]").test(password) || ! this.register.validateDisplay(username) ) {
      alert.style.display = "block"
    }
  }

  // Validate inputs and display error messages if necessary
  doRegister(display, email, phone, zipcode, dob, password, passwordconfirm, alert): void {
    let incorrects = this.register.getIncorrects(display, email, phone, zipcode, password, passwordconfirm)
    if (Object.values(incorrects).indexOf(true) < 0) {
      resource('POST', 'register', {username: display, email:email, phone:phone, zipcode:zipcode, dob:dob, password: password})
        .then(res => {
          this.register.validateRegister(res, alert)
        })
    }
    this.displayAlert.nativeElement.style.display = incorrects[display] ? "block" : "none";
    this.emailAlert.nativeElement.style.display = incorrects[email] ? "block" : "none";
    this.phoneAlert.nativeElement.style.display = incorrects[phone] ? "block" : "none";
    this.zipcodeAlert.nativeElement.style.display = incorrects[zipcode] ? "block" : "none";
    this.passwordAlert.nativeElement.style.display = incorrects[password] ? "block" : "none";
    }

  facebookLogin(): void {
    fetch(`${url}/login/facebook`, {
      method:'GET'
    })
  }

  ngOnInit() { }

};