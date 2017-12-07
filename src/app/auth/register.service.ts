import { Injectable } from '@angular/core';

@Injectable()
export class RegisterService {
	
	private disp_regex = new RegExp("^[A-Za-z0-9]+");
	private email_regex = new RegExp("^\\w+@\\w+.\\w+");
	private phone_regex = new RegExp("^[0-9]{3}-[0-9]{3}-[0-9]{4}$");
	private zip_regex = new RegExp("^[0-9]{5}$");
  	private pass_regex = new RegExp("[a-zA-Z]+\-[a-zA-Z]+\-[a-zA-Z]");

  	constructor() { }
  	
	validateDisplay(display): boolean {
		return (this.disp_regex.test(display));
	}

	validateEmail(email): boolean {
		return (this.email_regex.test(email));
	}

	validatePhone(phone): boolean {
		return (this.phone_regex.test(phone));
	}

	validateZipcode(zipcode): boolean {
		return (this.zip_regex.test(zipcode));
	}

	validatePasswords(password, passwordconfirm): boolean {
		return (password == passwordconfirm && 
				password.length + passwordconfirm.length > 0 && 
				this.pass_regex.test(password));
	}

	// Return a map that indicates whether an input is incorrect or not
	getIncorrects(display, email, phone, zipcode, password, passwordconfirm): {} {
		let incorrects = {}
		incorrects[display] = !this.validateDisplay(display)
		incorrects[email] = !this.validateEmail(email)
		incorrects[phone] = !this.validatePhone(phone)
		incorrects[zipcode] = !this.validateZipcode(zipcode)
		incorrects[password] = !this.validatePasswords(password, passwordconfirm)
		return incorrects
	}

	validateRegister(res, alert): void {
		try {
	      if (res.result === "success") {
	        alert.innerHTML = "Registration successful!"
	      }
	    }
	    catch(err) {
	      alert.innerHTML = err
	    }
	}
}
