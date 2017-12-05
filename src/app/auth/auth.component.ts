import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup
} from '@angular/forms';
import {
  CustomValidators
} from 'ng2-validation';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  LoginService
} from './login.service';
import {
  user
} from './user';

import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { resource } from '../resources';
import { MatSnackBar } from '@angular/material';

export const NAME_REGEX = /[a-zA-Z][a-zA-Z0-9]*/;
export const EMAIL_REGEX = /\w+@\w+\.\w+/;
export const PHONE_REGEX = /(\d){3}-(\d){3}-(\d){4}/;
export const CODE_REGEX = /(\d){5}/;
export const NETID_REGEX = /^[a-z]{2}[1-9][0-9]*/;
export const PASS_REGEX = /\w+-\w+-\w+/;

export class signData {
  name: string;
  disName: string;
  email: string;
  phone: string;
  birth: Date;
  code: string;
  pass: string;
  passConf: string;
}

export class loginData {
  loginName: string;
  loginPass: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['../app.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private http: Http,
    private snackBar: MatSnackBar
  ) {}

  sign: signData;
  log: loginData;
  loginForm: FormGroup;
  signForm: FormGroup;
  maxDate: Date;
  now: Date;
  validUser: boolean;

  ngOnInit() {
    localStorage.clear();
    this.validUser = true;
    this.log = new loginData();
    this.sign = new signData();
    this.now = new Date();
    this.maxDate = new Date(this.now.getFullYear() - 18, this.now.getMonth(), this.now.getDate());
    this.loginForm = new FormGroup({
      'loginName': new FormControl(this.log.loginName, [Validators.required, Validators.pattern(NETID_REGEX)]),
      'loginPass': new FormControl(this.log.loginPass, [Validators.required, Validators.pattern(PASS_REGEX)])
    });
    let pass = new FormControl(this.sign.pass, [Validators.pattern(PASS_REGEX), Validators.required]);
    let passConf = new FormControl(this.sign.passConf, [CustomValidators.equalTo(pass)]);
    this.signForm = new FormGroup({
      'name': new FormControl(this.sign.name, [Validators.required, Validators.pattern(NAME_REGEX)]),
      'disName': new FormControl(this.sign.disName, []),
      'email': new FormControl(this.sign.email, [Validators.required, Validators.pattern(EMAIL_REGEX)]),
      'phone': new FormControl(this.sign.phone, [Validators.required, Validators.pattern(PHONE_REGEX), CustomValidators.rangeLength([12, 12])]),
      'birth': new FormControl(this.sign.birth, [Validators.required]),
      'code': new FormControl(this.sign.code, [Validators.required, Validators.pattern(CODE_REGEX)]),
      'pass': pass,
      'passConf': passConf
    });
  }

  register(): void {
    this.loginService
    .register(this.signForm.value)
    .then(r => {
      if(r) {
        this.snackBar.open("Registration succeed! you can log in now!", null, { duration: 3000})
        this.signForm.reset()
      }
      else {
        this.signForm.controls['name'].setErrors({'unique': true})
      }
    })
    .catch(this.handleError)
  }

  verify(name: string, password: string): void {
    this.loginService.login(name, password)
    .then(r => {
      console.log(r)
      if (r === "success") {
        this.router.navigate(['../article'], {
          relativeTo: this.route
        });
      }
      else if(r.includes("no such user")) {
        this.loginForm.controls['loginName'].setErrors({ 'notExist': true });
      }
      else if(r === "wrong password") {
        this.loginForm.controls['loginPass'].setErrors({ 'wrong': true });
      }
    })
  }

  loginFacebook(): void {
    this.loginService
        .loginFacebook()
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  get loginName() {
    return this.loginForm.get('loginName');
  }

  get loginPass() {
    return this.loginForm.get('loginPass');
  }

  get name() {
    return this.signForm.get('name');
  }

  get email() {
    return this.signForm.get('email');
  }

  get phone() {
    return this.signForm.get('phone');
  }

  get birth() {
    return this.signForm.get('birth');
  }

  get code() {
    return this.signForm.get('code');
  }

  get pass() {
    return this.signForm.get('pass');
  }

  get passConf() {
    return this.signForm.get('passConf');
  }
}