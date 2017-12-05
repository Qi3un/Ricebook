import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';
import { ArticleService } from './article.service';
import { FollowService } from './follow.service';
import { LogoutService } from './logout.service';
import { LinkService } from './link.service';
import { article, comment } from './article';
import { follow } from './follow';
import { user } from '../auth/user';

const defaultAvatar = "http://www.uuwtq.com/file/image/tx/3w4013592245u2536567220t28.jpg";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['../app.component.css']
})
export class ArticleComponent implements OnInit {
  @ViewChild('text_') textEl: ElementRef;
  @ViewChild('img_') imgEl: ElementRef;

  profile = {
    id: 0,
    name: "qs5",
    fbID: null,
    disName: "feelsbadman",
    email: "test@test.test",
    phone: "123-123-1234",
    birth: new Date(),
    code: "12345",
    headline: "headline",
    avatar: null
  }
	articles: article[] = [];
  allFollows: follow[] = [];
  follows: follow[] = [];
  searchRes: article[] = [];
  postContent: string;
  postImg: string;
  image_upload: string;
  newStatus: string;
  newFollow: string;
  searchBox: string;
  artEditing: boolean;
  comEditing: boolean;
  editId: number;
  newImg: string;
  oldPic: SafeResourceUrl;
  oldText: string;
  oldComment: string;
  unlinkCount: number;

  constructor(private articleService: ArticleService,
              private followService: FollowService,
              private logoutService: LogoutService,
              private sanitizer: DomSanitizer,
              private snackBar: MatSnackBar,
              private linkService: LinkService
              ) { }


  ngOnInit(): void {
    this.setUser()
    this.getFollows();
    this.getArticles();
    this.setSearch();
    this.postContent = "";
    this.newFollow = "";
    this.oldPic = null;
    this.newImg = "";
    this.oldText = "";
    this.oldComment = "";
    this.artEditing = false;
    this.comEditing = false;
    this.editId = -1;
    this.unlinkCount = 0;
  }

  unlink(): void {
    this.unlinkCount = this.unlinkCount + 1;
    if(this.unlinkCount === 1) {
      this.snackBar.open("!!!: the account logged in with \
        Facebook will be deleted from our database, and the data belongs to it \
        will only be owned by current user. Click again if you know what you're doing.",
        "", { duration: 10000 })
    }
    else {
      this.unlinkCount = 0;
      this.profile.fbID = ""
      this.linkService.unlink()
                      .then(_ => {
                        this.snackBar.open("Successfully unlinked from Facebook account!", "", { duration: 2000 })
                      })
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  setUser(): Promise<any> {
    return this.followService
        .getProfile()
        .then(r => {
          this.profile.id = r._id;
          this.profile.name = r.username;
          this.profile.fbID = r.fbID;
          this.profile.disName = r.displayName || r.username;
          this.profile.email = r.email;
          this.profile.phone = r.phone;
          this.profile.birth = new Date(r.dob);
          this.profile.code = r.zipcode;
          this.profile.avatar = r.avatar.data ?
            this.sanitizer.bypassSecurityTrustResourceUrl(
              base64ArrayBuffer(r.avatar.contentType, r.avatar.data.data)) : (r.avatar.url ? r.avatar.url : null);
          this.profile.headline = r.headline;
          this.newStatus = "";
       })
        .catch(this.handleError)
  }

  getFollows(): Promise<any> {
    return this.followService
        .getFollows()
        .then(follows => {
          var filtered = []
          if(follows.length) {
            follows.map(follow => {
              filtered.push(this.filterFollow(follow))
            })
          }
          this.follows = filtered;
        });
  }

  filterFollow(item: any): follow {
    var filtered = new follow()
    filtered.name = item.name
    filtered.id = item.id
    filtered.alt = item.alt
    filtered.title = item.title
    filtered.subTitle = item.subTitle
    filtered.avatar = item.avatar.data ? this.sanitizer.bypassSecurityTrustResourceUrl(
                  base64ArrayBuffer(item.avatar.contentType, item.avatar.data.data)) : (item.avatar.url ? item.avatar.url : null);
    console.log("filtered", filtered)
    return filtered
  }

  addFollow(): void {
    if(this.newFollow) {
      this.followService
          .addFollow(this.newFollow)
          .then(follows => {
            var filtered = []
            if(follows.length) {
              follows.map(follow => {
                filtered.push(this.filterFollow(follow))
              })
              this.follows = filtered;
              this.snackBar.open("Refresh to see the articles of your new following", "", { duration: 3000 })
            }
            else {
              this.snackBar.open("User doesn't extst or already followed (°Д°)", "", { duration: 3000})
            }
          })
      this.newFollow = "";
    }
  }

  unfollow(id: number, name: string): void {
    this.followService
        .unfollow(name)
        .then(response => {
          if(response) {
            this.follows = this.follows.filter(f => f.id !== id);
            this.articles = this.articles.filter(a => (a.name === this.profile.name || a.name !== name));
            this.searchRes = this.searchRes.filter(a => (a.name === this.profile.name || a.name !== name));
            this.search();
          }
        })
  }

  logout(): void {
    this.logoutService.logout();
  }

  filterComment(comment: any): comment {
    var filtered = {
      date: comment.date,
      author: comment.displayName,
      name: comment.author,
      id: comment._id,
      content: comment.body,
      editing: false
    }
    return filtered
  }

  filterArticle(article: any): article {
    /* get comments formalized */
    var comments = []
    article.comments.map(comment => comments.push(this.filterComment(comment)))

    /* get whole article formalized */
    var filtered: article = {
      _id: article._id,
      text: article.body,
      editing: false,
      colspan: article.img.data ? 1 : 2,
      date: article.date,
      img: article.img.data ? this.sanitizer.bypassSecurityTrustResourceUrl(
        base64ArrayBuffer(article.img.contentType, article.img.data.data)) : null,
      comments: comments,
      author: article.displayName,
      name: article.author,
      comment: ""
    }
    return filtered
  }

  getArticles(): Promise<any> {
    this.articles = []
    this.searchRes = []

    return this.articleService
        .getArticles()
        .then(articles => {
          if(articles.length) {
            articles.map(article => {
              this.articles.push(this.filterArticle(article))
            })
          }
          this.articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          this.searchRes = this.articles
        })
  }

  postArt(): void {
    if(this.postContent){
      console.log("text", this.textEl);
      console.log("img", this.imgEl);
      let textEl: HTMLInputElement = this.textEl.nativeElement;
      let imgEl: HTMLInputElement = this.imgEl.nativeElement;
      let formData = new FormData();
      formData.append('disName', this.profile.disName)
      formData.append('text', textEl.value);
      if(imgEl.files.length) {
        formData.append('img', imgEl.files.item(0))
      }
      console.log("formData in component", formData);
      this.articleService
          .postArticle(formData)
          .then(res => {
            console.log("new article", res)
            var newPost = this.filterArticle(res)
            this.searchRes.unshift(newPost)
            // this.articles.unshift(newPost)
            this.clearPost()
            console.log("current articles", this.articles)
            console.log("current searchRes", this.searchRes)
          })
    }
  }

  clearPost(): void {
    this.postContent = "";
    this.postImg = "";
    this.image_upload = "";
  }

  setSearch(): void {
    this.searchBox = "";
    this.searchRes = this.articles;
  }

  search(): void {
    if(this.searchBox) {
      this.searchRes = this.articles
        .filter(a => (
          a.author.indexOf(this.searchBox) !== -1 || a.text.indexOf(this.searchBox) !== -1
        ));
    }
    else {
      this.searchRes = this.articles;
    }
  }

  updateStatus(): void {
    if(this.newStatus) {
      this.followService
          .updateStatus(this.newStatus)
          .then(headline => {
            this.profile.headline = headline
            this.newStatus = "";
          })
    }
  }

  handleImageChange(event: any, id: number): void {
    if(event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        if(id === -1) {
          this.postImg = event.target.result;
        }
        else {
          var index = this.searchRes.findIndex(a => a._id === id);
          this.searchRes[index].img = event.target.result;
        }
      }
      this.newImg = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  editArticle(name: string, id: number): void {
    console.log(name, id);
    if(this.artEditing === false && name == this.profile.name) {
      this.editId = this.searchRes.findIndex(a => a._id === id);
      var index = this.editId;
      this.searchRes[index].editing = true;
      this.oldPic = this.searchRes[index].img;
      this.oldText = this.searchRes[index].text;
      this.artEditing = true;
    }
  }

  deleteImg(id: number) {
    console.log("delete img", id);
    var index = this.searchRes.findIndex(a => a._id === id);
    this.searchRes[index].img = null;
    this.searchRes[index].colspan = 2;
  }

  deleteArticle(id: number): void {
    console.log("delete", id);
    this.articles = this.articles.filter(a => a._id !== id);
    this.searchRes = this.searchRes.filter(a => a._id !== id);
    this.articleService
        .deleteArticle(id)
        .then(_ => {
          this.artEditing = false;
          this.oldPic = null;
        })
  }

  cancelEdit(id: number): void {
    console.log("cancel", id);
    var index = this.editId;
    this.searchRes[index].img = this.oldPic;
    this.searchRes[index].text = this.oldText;
    this.searchRes[index].editing = false;
    this.artEditing = false;
    this.oldPic = null;
    this.newImg = null;
  }

  submitEdit(id: number): void {
    console.log("submit", id);
    var index = this.editId;
    this.searchRes[index].editing = false;

    this.updateArticle(this.articles, id);

    let formData = new FormData();
    formData.append("id", id.toString());
    formData.append("text", this.searchRes[index].text);
    if(this.newImg) {
      formData.append("img", this.newImg);
    }
    this.articleService
        .updateArticle(formData)
        .then(_ => {
          this.artEditing = false;
          this.oldPic = null;
          this.newImg = null;
        })
  }

  updateArticle(articles: article[], id: number): void {
    var index = articles.findIndex(a => a._id === id);
    var now = new Date();

    if(index > -1) {
      if (articles[index].comment === "" && !this.comEditing) {
        console.log("update article");
        articles[index].text = this.searchRes[this.editId].text;
        articles[index].img = this.searchRes[this.editId].img;
      }
      else if(this.comEditing) {
        var comIndex = articles[index].comments.findIndex(comment => comment.editing)
        this.articleService
            .updateComment(
              id,
              articles[index].comments[comIndex].id,
              articles[index].comments[comIndex].content,
              this.profile.disName
            ).then(_ => {
              articles[index].comments[comIndex].date = now.toString();
              articles[index].comments[comIndex].editing = false;
            })
      }
      else {
        console.log("new comment");
        this.articleService
            .updateComment(id, -1, articles[index].comment, this.profile.disName)
            .then(newComment => {
              articles[index].comments.push(this.filterComment(newComment));
              articles[index].comment = "";
            })
      }
    }
  }

  submitComment(id: number, comment: string): boolean {
    if(comment !== "") {
      this.updateArticle(this.articles, id);
    }
    return true;
  }

  deleteComment(articleID: number, commentID: number): void {
    this.articleService
        .deleteComment(articleID, commentID)
        .then(_ => {
          var artIndex = this.articles.findIndex(a => a._id === articleID);
          var comIndex = this.articles[artIndex].comments.findIndex(c => c.id == commentID)
          this.articles[artIndex].comments.splice(comIndex, 1);
        })
  }

  editComment(articleID: number, commentID: number): void {
    if(!this.comEditing) {
      console.log("articleID", articleID);
      console.log("commentID", commentID);
      var artIndex = this.searchRes.findIndex(a => a._id == articleID);
      console.log("artIndex", artIndex)
      var comIndex = this.searchRes[artIndex].comments.findIndex(c => c.id == commentID);
      console.log("comIndex", comIndex)
      this.searchRes[artIndex].comments[comIndex].editing = true;
      this.oldComment = this.searchRes[artIndex].comments[comIndex].content;
      this.comEditing = true;
    }
  }

  cancelEditComment(articleID: number, commentID: number): void {
      var artIndex = this.searchRes.findIndex(a => a._id == articleID);
      // console.log("artIndex", artIndex)
      var comIndex = this.searchRes[artIndex].comments.findIndex(c => c.id == commentID);
      this.searchRes[artIndex].comments[comIndex].editing = false;
      this.searchRes[artIndex].comments[comIndex].content = this.oldComment;
      this.comEditing = false;
  }

  submitEditComment(articleID: number, commentID: number): void {
      var artIndex = this.searchRes.findIndex(a => a._id == articleID);
      console.log("artIndex", artIndex)
      var comIndex = this.searchRes[artIndex].comments.findIndex(c => c.id == commentID);
      this.updateArticle(this.articles, articleID);
      this.comEditing = false;
  }
}

function base64ArrayBuffer(contentType, arrayBuffer): string {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }

  return "data:" + contentType + ";base64," + base64
}

export { base64ArrayBuffer }
