import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { follow } from './follow'

@Injectable()
export class FollowService {

	private followUrl = 'assets/follows.json';
  follows: follow[] = [];

  constructor(private http: Http) { }

  getFollows(): Promise<follow[]> {
  	return this.http.get(this.followUrl)
  									.toPromise()
  									.then(response => response.json().follows as follow[])
  									.catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
