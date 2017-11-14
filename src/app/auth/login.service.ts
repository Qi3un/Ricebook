import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { user } from './user';
import { resource } from '../resources';

@Injectable()
export class LoginService {

	private userUrl = 'assets/users.json';
  users: user[] = [];
  validUser: boolean;

  constructor(private http: Http) {
    this.getUsers();
  }

  login(name: string, password: string): boolean {
    this.validUser = false;
    let usr = this.users.filter(u => (u.name == name));
    if(usr.length == 1 && usr[0].password === password){
      this.validUser = true;
      localStorage.setItem("user", JSON.stringify(usr[0]));
    }
    return this.validUser;
  }

  mockLogin = (name: string, password: string) => {
    this.validUser = false;
    return resource('POST', 'login', {
        username: name,
        password: password
    })
    .then(r => {
        this.validUser = (JSON.parse(r).valid === "true");
    })
    .catch(this.handleError);
  }

  getUsers(): Promise<user[]> {
  	return this.http.get(this.userUrl)
  									.toPromise()
  									.then(response => response.json().users as user[])
                    .then(users => this.users = users)
  									.catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
