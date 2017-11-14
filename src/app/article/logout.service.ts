import { Injectable } from '@angular/core';
import { resource } from '../resources';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LogoutService {

  constructor() { }

  logout(): Promise<any> {
    return resource('PUT', 'logout','')
    	.then(r => {
    		localStorage.clear();
    		return JSON.parse(r).sucess === "true";
    	})
    	.catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
