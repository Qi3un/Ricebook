import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { user } from './user';

// var url = (endpoint) => `http://localhost:3000/` + endpoint;
var url = (endpoint) => `https://ricebook233-backend.herokuapp.com/` + endpoint;

var option = {
  'headers': new Headers({
    'Accept': 'aplication/json',
    'Content-Type': 'application/json'
  }), 'withCredentials': true };

@Injectable()
export class LoginService {

  constructor(private http: Http ) { }

  login(name: string, password: string): Promise<string> {
    return this.http.post(url('login'), JSON.stringify({ username: name, password: password}), option)
                    .toPromise()
                    .then(r => {
                      if(r.status === 200) {
                        localStorage.user = r.json().username;
                        return r.json().result;
                      }
                      else {
                        return r.text();
                      }
                    })
                    .catch(this.handleError)
  }

  register(user: user): Promise<boolean> {
    return this.http.post(url("register"), JSON.stringify(user), option)
                    .toPromise()
                    .then(r => r.json())
                    .then(r => {
                      console.log("username", r.username)
                      console.log("result", r.result)
                      if(r.username == user.name && r.result == "success") {
                        return true
                      }
                      else {
                        return false
                      }
                    })
                    .catch(this.handleError);
  }

  loginFacebook(): void {
    // window.location.href = "http://localhost:3000/loginFacebook";
    window.location.href = "https://ricebook233-backend.herokuapp.com/loginFacebook";
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

export { url, option }