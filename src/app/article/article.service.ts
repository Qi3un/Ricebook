import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { article } from './article';
import { url, option } from '../auth/login.service'

var postOption = {
  'headers': new Headers({
    'Accept': 'aplication/json'
  }), 'withCredentials': true };

@Injectable()
export class ArticleService {

  constructor(private http: Http) { }

  getArticles(): Promise<article[]> {
  	return this.http.get(url('articles'), option)
  									.toPromise()
  									.then(response => response.json().articles)
  									.catch(this.handleError);
  }

  postArticle(formData: FormData): Promise<any> {
    console.log("formData", formData)
    return this.http.post(url('article'), formData, postOption)
                    .toPromise()
                    .then(response => {
                      console.log(response)
                      return response.json().articles[0]
                    })
                    .catch(this.handleError)
  }

  deleteArticle(id: number): Promise<any> {
    return this.http.delete(url('article/' + id.toString()), option)
                    .toPromise()
                    .then(res => {
                      console.log("res.status", res.status)
                    })
                    .catch(this.handleError)
  }

  updateArticle(formData: FormData): Promise<any> {
    return this.http.put(url('article'), formData, postOption)
                    .toPromise()
                    .then(res => {
                      console.log("res.statur", res.status)
                      console.log("res.json", res.json())
                    })
                    .catch(this.handleError)
  }

  updateComment(id: number, commentID: number, text: string, disName: string): Promise<any> {

    var formData = new FormData()
    formData.append("id", id.toString())
    formData.append("commentId", commentID.toString())
    formData.append("text", text)
    formData.append("displayName", disName)

    return this.http.put(url('article'), formData, postOption)
                    .toPromise()
                    .then(res => {
                      if(res.status === 200) {
                        console.log("comment res", res.json().comment)
                        return res.json().comment
                      }
                      else {
                        return ""
                      }
                    })
                    .catch(this.handleError)
  }

  deleteComment(id: number, commentID: number): Promise<any> {
    return this.http.delete(url('comment/' + id.toString() + '/' + commentID.toString()), option)
                    .toPromise()
                    .then(res => {
                      if(res.status === 200) {
                        console.log("comment delete succeed")
                      }
                    })
                    .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
