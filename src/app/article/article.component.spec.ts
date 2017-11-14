import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MatInputModule, MatIconModule, MatCardModule, MatTooltipModule, MatListModule } from '@angular/material';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatExpansionModule, } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpModule } from '@angular/http';

import { OrderByPipe } from './order-by.pipe';
import { ArticleService } from './article.service';
import { FollowService } from './follow.service';
import { LogoutService } from './logout.service';
import { article } from './article';
import { follow } from './follow';
import { ArticleComponent } from './article.component';


function newEvent(eventName: string, bubbles = false, cancelable = false) {
    let evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
    evt.initCustomEvent(eventName, bubbles, cancelable, null);
    return evt;
}

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let searchInput: HTMLInputElement;
  let statusInput: HTMLInputElement;
  let articleService: ArticleService;
  let followService: FollowService;
  let spyArticle: jasmine.Spy;
  let spyFollow: jasmine.Spy;
  let testArtiles: article[];
  let testFollows: follow[];

  beforeEach(async(() => {
    testArtiles = [
      {
        "_id": 1,
        "text": "test text1",
        "editing": false,
        "colspan": 2,
        "date": "01-01-2008",
        "img": null,
        "comments": [ {'content': "comment1", 'date': '01-01-2008', 'author': 'comment author1', 'id': 1, "editing": false} ],
        "author": "author1",
        "comment": ""
      },
      {
        "_id": 2,
        "text": "text2",
        "editing": false,
        "colspan": 2,
        "date": "02-02-2008",
        "img": null,
        "comments": [ {'content': "comment2", 'date': '02-02-2008', 'author': 'comment author2', 'id': 2, "editing": false} ],
        "author": "author2",
        "comment": ""
      }
    ];
    testFollows = [
      {
        "name": "test follower",
        "id": 1,
        "avatar": null,
        "alt": "test follow alt",
        "title": "test follow title",
        "subTitle": "test folloe subtitle"
      }
    ];

    TestBed.configureTestingModule({
      declarations: [
        ArticleComponent,
        OrderByPipe
      ],
      imports: [
        HttpModule,
        MatListModule,
        MatExpansionModule,
        MatTooltipModule,
        MatCardModule,
        CustomFormsModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatButtonModule,
        MatToolbarModule,
        CustomFormsModule
      ],
      providers: [
        ArticleService,
        FollowService,
        LogoutService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    articleService = fixture.debugElement.injector.get(ArticleService);
    spyArticle = spyOn(articleService, 'getArticles').and.returnValue(Promise.resolve(testArtiles));
    followService = fixture.debugElement.injector.get(FollowService);
    spyFollow = spyOn(followService, 'getFollows').and.returnValue(Promise.resolve(testFollows));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render articles', (done: any) => {
    fixture.detectChanges();
    expect(spyArticle.calls.any()).toBe(true, 'getArticles called');

    // get the spy promise and wait for it to resolve
    expect(component.articles).toEqual([]);
    spyArticle.calls.mostRecent().returnValue.then(() => {
      fixture.detectChanges();
      expect(component.articles.length).toEqual(2);
      done();
    });
  })

  it('should render follows', (done: any) => {
    fixture.detectChanges();
    expect(spyFollow.calls.any()).toBe(true, 'getFollows called');

    // get the spy promise and wait for it to resolve
    spyFollow.calls.mostRecent().returnValue.then(() => {
      fixture.detectChanges();
      expect(component.follows.length).toEqual(1);
      de = fixture.debugElement.query(By.css('#follow-title'));
      expect(de).not.toBe(null);
      el = de.nativeElement;
      expect(el.textContent).toBe("test follow title");
      done();
    });

  })

  it('shoud update search keyword (two-way binding)', fakeAsync(() => {
    fixture.detectChanges();

    component.searchBox = "author1";
    fixture.detectChanges();
    tick();
    de = fixture.debugElement.query(By.css('#searchBox'))
    searchInput = de.nativeElement;
    expect(searchInput.value).toEqual("author1");

    searchInput.value = "author2";
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();
    expect(component.searchBox).toEqual("author2");
  }));

  it('should filter displayed articles by the search keyword', fakeAsync(() => {
    fixture.detectChanges();

    // input keyword
    component.searchBox = "author1";

    // wait for angular
    fixture.detectChanges();
    tick();

    // trigger keyup event
    de = fixture.debugElement.query(By.css('#searchBox'))
    searchInput = de.nativeElement;
    de.triggerEventHandler('keyup', {});

    // check search result
    expect(component.searchRes.length).toEqual(1);
    expect(component.searchRes[0].author).toEqual("author1");
  }));

  it('should dispathc action to create a new article', fakeAsync(() => {
    fixture.detectChanges();

    // set new article
    component.postValue = "new article";
    fixture.detectChanges();
    tick();

    // click post button
    var postButton = fixture.debugElement.query(By.css("#post"));
    postButton.triggerEventHandler('click', {});

    // check posted articles
    expect(component.postedArticles.length).toEqual(1);
    expect(component.postedArticles[0].text).toEqual("new article");
  }))

  it('should update headline', fakeAsync(() => {
    fixture.detectChanges();

    // input new headline
    statusInput = fixture.debugElement.query(By.css("#newStatus")).nativeElement;
    statusInput.value = "test status";
    statusInput.dispatchEvent(new Event('input'));
    var updateButton = fixture.debugElement.query(By.css("#update"));
    updateButton.triggerEventHandler('click', {});

    // wait for angular to update
    fixture.detectChanges();
    tick();

    // check updated headline
    expect(component.userStatus).toEqual("test status");
    var status = fixture.debugElement.query(By.css("#userStatus"));
    expect(status.nativeElement.textContent).toEqual("test status");
  }))
});
