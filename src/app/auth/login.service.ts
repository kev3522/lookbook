import { Injectable } from '@angular/core';
import { Router } from '@angular/router'

@Injectable()
export class LoginService {
  constructor(private router:Router) { }

  validateLogin(res, alert): void {
    try {
      if (res.result === "success") {
        this.router.navigate(['main']);
      }
    }
    catch(err) {
      alert.innerHTML = "Invalid login!"
    }
  }
}
