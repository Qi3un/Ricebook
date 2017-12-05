import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { url, option } from '../auth/login.service';

@Injectable()
export class LinkService {
	constructor(private http: Http) { }

	link(): void {
    	// window.location.href = "http://localhost:3000/link";
    	window.location.href = "https://ricebook233-backend.herokuapp.com/link";

	}

	unlink(): Promise<any> {
		return this.http.delete(url('unlink'), option)
				 .toPromise()
				 .then(res => {
				 	if(res.status === 200) {
				 		console.log("unlink succeed")
				 		return true
				 	}
				 	else {
				 		console.log("unlink fail")
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
