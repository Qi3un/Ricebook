import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { user } from '../auth/user';
import { url } from '../auth/login.service'

@Injectable()
export class ProfileService {

  constructor( private http: Http ) { }

  updateProfile(user: user, newAvatar: string): Promise<any> {

    let formData = new FormData
    if(user.disName) {
      formData.append("disName", user.disName)
    }
    if(user.email) {
      formData.append("email", user.email)
    }
    if(user.phone) {
      formData.append("phone", user.phone)
    }
    if(user.code) {
      formData.append("code", user.code)
    }
    if(user.password) {
      formData.append("pass", user.password)
    }
    if(newAvatar) {
      formData.append("avatar", newAvatar)
    }

    let option = {
      'headers': new Headers({
        'Accept': 'aplication/json',
      }), 'withCredentials': true };

    return this.http.put(url('profile'), formData, option)
                    .toPromise()
                    .then(res => {
                      if(res.status === 200) {
                        console.log("Update saved! Back to homepage to check your new profile!")
                        return true
                      }
                      else {
                        return false
                      }
                    })
                    .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
