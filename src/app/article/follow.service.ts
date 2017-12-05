import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { follow } from './follow'
import { user } from '../auth/user'
import { url, option } from '../auth/login.service'

@Injectable()
export class FollowService {

  follows: follow[] = [];

  constructor(private http: Http) {}

  getProfile(): Promise<any> {
    return this.http
               .get(url('profile'), option)
               .toPromise()
               .then(r => r.json())
               .catch(this.handleError)
  }

  addFollow(followName: string): Promise<follow[]> {
    console.log("follow service: add follow")
    return this.http.put(url("follow/" + followName), {}, option)
                    .toPromise()
                    .then(response => {
                      if(response.status == 200) {
                        console.log("new follow", response.json().follow)
                        return response.json().follow
                      }
                      else {
                        return []
                      }
                    })
                    .catch(this.handleError)
  }

  unfollow(name: string): Promise<boolean> {
    return this.http.delete(url("follow/" + name), option)
             .toPromise()
             .then(response => {
                if(response.status === 200) {
                  console.log("unfollow succeed")
                  return true
                }
                else {
                  console.log("something wrong with unfollow")
                  return false
                }
             })
             .catch(this.handleError)
  }

  getFollows(): Promise<follow[]> {
  	return this.http.get(url('follow'), option)
  									.toPromise()
  									.then(response => response.json().follow as follow[])
  									.catch(this.handleError);
  }

  updateStatus(status: string): Promise<any> {
    return this.http.put(url('headline'), { headline: status }, option)
                    .toPromise()
                    .then(res => res.json().headline)
                    .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
