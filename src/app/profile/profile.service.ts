import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { resource } from '../resources';
import { user } from '../auth/user';

@Injectable()
export class ProfileService {

  constructor() { }

  fetchProfile(id: number): Promise<user> {
    return resource('GET', 'profile', {userId: id})
    	.then(r => {
    		let user = JSON.parse(r).user;
    		user.birth = new Date(user.birth);
    		return user;
    	})
    	.catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
