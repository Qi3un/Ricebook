import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { url, option } from '../auth/login.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class LogoutService {

  constructor(private http: Http,
              private cookieService: CookieService) { }

  logout(): Promise<any> {
    return this.http.put(url('logout'), "", option)
                    .toPromise()
                    .then(res => {
                      if(res.status === 200) {
                        this.cookieService.deleteAll()
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
