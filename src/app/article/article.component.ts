import { Component, OnInit } from '@angular/core';
import { ArticleService } from './article.service';
import { FollowService } from './follow.service';
import { LogoutService } from './logout.service';
import { article } from './article';
import { follow } from './follow';
import { user } from '../auth/user';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['../app.component.css']
})
export class ArticleComponent implements OnInit {

  user: user;
  allArticles: article[] = [];
	articles: article[] = [];
  allFollows: follow[] = [];
  follows: follow[] = [];
  searchRes: article[] = [];
  postID: number;
  postContent: string;
  postImg: string;
  postedArticles: article[] = [];
  userStatus: string;
  newStatus: string;
  followID: number;
  newFollow: string;
  searchBox: string;
  artEditing: boolean;
  comEditing: boolean;
  editId: number;
  oldPic: string;
  oldText: string;
  oldComment: string;

  constructor(private articleService: ArticleService,
              private followService: FollowService,
              private logoutService: LogoutService) { }

  getArticles(): void {
    this.articleService
        .getArticles()
        .then(articles => {
          this.allArticles = articles;
          if(localStorage.articles) {
            this.postedArticles = JSON.parse(localStorage.articles).articles;
            this.allArticles = this.allArticles.concat(this.postedArticles);
          }
          this.articles = this.allArticles;
          this.searchRes = this.allArticles;
        })
        .then(_ => {
          var length = this.postedArticles.length;
          console.log("posted articles number", length);
          var max = 4;
          if(length != 0) {
            max = this.postedArticles.reduce((a, b) => {
              if(a._id > b._id)
                return a
              else
                return b;
            })._id;
          }
          this.postID = max + 1;
        });
  }

  getFollows(): void {
    this.followService
        .getFollows()
        .then(follows => {
          this.allFollows = follows;
          this.follows = this.allFollows;
        });
  }

  setUser(): void {
    console.log("user", localStorage.user);
    var user = JSON.parse(localStorage.user);
    user.birth = new Date(user.birth);
    this.user = user;
    this.userStatus = localStorage.headline || "I'm Rick's Morty";
    this.newStatus = "";
  }

  setSearch(): void {
    this.searchBox = "";
    this.searchRes = this.articles;
  }

  ngOnInit(): void {
  	this.getArticles();
    this.getFollows();
    this.setUser();
    this.setSearch();
    this.postContent = "";
    this.newFollow = "";
    this.followID = 5;
    this.oldPic = "";
    this.oldText = "";
    this.oldComment = "";
    this.artEditing = false;
    this.comEditing = false;
    this.editId = -1;
  }

  search(): void {
    if(this.searchBox) {
      this.searchRes = this.articles
        .filter(a => (
          a.author == this.searchBox || a.text.indexOf(this.searchBox) >= 0
        ));
    }
    else {
      this.searchRes = this.articles;
    }
  }

  unfollow(id: number, name: string): void {
    this.follows = this.follows.filter(f => f.id !== id);
    this.articles = this.articles.filter(a => (a.author !== name));
    this.search();
  }

  postArt(): void {
    if(this.postContent){
      console.log("article id", this.postID);
      const newArt: article = {
        '_id': this.postID,
        'text': this.postContent,
        'editing': false,
        'img': this.postImg,
        "colspan": this.postImg ? 1 : 2,
        'comments': [],
        'date': Date().toString(),
        'author': "Morty",
        'comment': ""
      };
      this.postedArticles.push(newArt);
      this.updateArtStore();
      this.insertArticle(this.searchRes, newArt);
      this.insertArticle(this.articles, newArt);
      this.insertArticle(this.allArticles, newArt);
      this.postContent = "";
      this.postID = this.postID + 1;
      this.postImg = "";
    }
  }

  insertArticle(articles: article[], newArt: article) {
    if(articles.findIndex(a => a._id === this.postID) === -1) {
      articles.unshift(newArt);
    }
  }

  clearPost(): void {
    this.postContent = "";
  }

  updateStatus(): void {
    if(this.newStatus) {
      this.userStatus = this.newStatus;
      localStorage.headline = this.newStatus;
      this.newStatus = "";
    }
  }

  addFollow(): void {
    if(this.newFollow) {
      var followSearch = this.allFollows.filter(f => (f.title === this.newFollow));
      var articleSearch = this.allArticles.filter(a => (a.author === this.newFollow));
      if(followSearch.length === 1 && this.follows.indexOf(followSearch[0]) === -1) {
        this.follows.push(followSearch[0]);
        this.articles = this.articles.concat(articleSearch);
        this.search();
      }
      else if(followSearch.length === 0) {
        const fol: follow = {
          'name': "user" + this.followID,
          'id': this.followID,
          'avatar': "https://vignette.wikia.nocookie.net/rickandmorty/images/d/dd/Rick.png/revision/latest?cb=20131230003659",
          'alt': "Photo of new following",
          'title': this.newFollow,
          'subTitle': "I love angular, angular makes me happy!",
        }
        this.follows.push(fol);
        this.followID = this.followID + 1;
      }
      this.newFollow = "";
    }
  }

  logout(): void {
    this.logoutService.logout();
  }

  handleImageChange(event: any, id: number): void {
    if(event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      // console.log("dude");

      reader.onload = (event: any) => {
        if(id === -1) {
          this.postImg = event.target.result;
          // console.log("post image changed");
        }
        else {
          var index = this.searchRes.findIndex(a => a._id === id);
          this.searchRes[index].img = event.target.result;
          // console.log("article image changed", id);
        }
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  editArticle(author: string, id: number): void {
    console.log(author, id);
    if(this.artEditing === false && author == "Morty") {
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
    this.searchRes[index].img = "";
  }

  deleteArticle(id: number): void {
    console.log("delete", id);
    this.allArticles = this.allArticles.filter(a => a._id !== id);
    this.articles = this.articles.filter(a => a._id !== id);
    this.searchRes = this.searchRes.filter(a => a._id !== id);
    this.postedArticles = this.postedArticles.filter(a => a._id !== id);
    this.updateArtStore();
    this.artEditing = false;
    this.oldPic = "";
  }

  cancleEdit(id: number): void {
    console.log("cancle", id);
    var index = this.editId;
    this.searchRes[index].img = this.oldPic;
    this.searchRes[index].text = this.oldText;
    this.searchRes[index].editing = false;
    this.artEditing = false;
    this.oldPic = "";
  }

  submitEdit(id: number): void {
    console.log("submit", id);
    var index = this.editId;
    this.searchRes[index].editing = false;
    this.updateArticle(this.allArticles, id);
    this.updateArticle(this.articles, id);
    this.updateArticle(this.postedArticles, id);
    this.updateArtStore();
    this.artEditing = false;
    this.oldPic = "";
  }

  updateArticle(articles: article[], id: number): void {
    var index = articles.findIndex(a => a._id === id);

    // if()
    if (articles[index].comment === "") {
      console.log("update article");
      articles[index].text = this.searchRes[this.editId].text;
      articles[index].img = this.searchRes[this.editId].img;
    }
    else {
      console.log("update comment");
      var now = new Date();
      const newComment = {
        'date': now.toString(),
        'author': this.user.disName,
        'id': this.user.id,
        'content': articles[index].comment,
        'editing': false
      }
      articles[index].comments.push(newComment);
      articles[index].comment = "";
    }
  }

  submitComment(id: number, comment: string): boolean {
    if(comment !== "") {
      // this.updateArticle(this.postedArticles, id, comment);
      // this.updateArticle(this.articles, id, comment);
      this.updateArticle(this.allArticles, id);
      this.updateArtStore();
    }
    return true;
  }

  editComment(articleID: number, commentID: number): void {
    if(!this.comEditing) {
      var artIndex = this.searchRes.findIndex(a => a._id == articleID);
      var comIndex = this.searchRes[artIndex].comments.findIndex(c => c.id == commentID);
      this.searchRes[artIndex].comments[comIndex].editing = true;
      this.oldComment = this.searchRes[artIndex].comments[comIndex].content;
      this.comEditing = true;
    }
  }

  updateArtStore() {
    localStorage.setItem("articles", JSON.stringify({"articles": this.postedArticles}));
  }
}


