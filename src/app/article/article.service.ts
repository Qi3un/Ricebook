import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { article } from './article';
import { resource } from '../resources';

@Injectable()
export class ArticleService {

	private articleUrl = 'assets/articles.json';

  constructor(private http: Http) { }

  getArticles(): Promise<article[]> {
  	return this.http.get(this.articleUrl)
  									.toPromise()
  									.then(response => response.json().articles as article[])
  									.catch(this.handleError);
  }

  mockFetArt = () => {
    return resource('GET', 'articles', '')
    .then(r => JSON.parse(r).articles)
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
