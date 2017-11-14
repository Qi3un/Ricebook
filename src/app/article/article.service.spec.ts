import { TestBed, inject, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { ArticleService } from './article.service';
import { url } from '../resources';

const fetchMock = require('fetch-mock');

describe('ArticleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [ArticleService]
    });
  });

  it('should be created', inject([ArticleService], (service: ArticleService) => {
    expect(service).toBeTruthy();
  }));

  it('should read articles from ../assets/articles.json', async(inject([ArticleService], (service: ArticleService) => {
    service.getArticles()
      .then(r => expect(r.length).toBeGreaterThan(0));
  })));

  it('should fetch article', async(inject([ArticleService], (service: ArticleService) => {
    const testArticles = [
      {
        "_id": 0,
        "text": "test text",
        "editing": false,
        "colspan": 2,
        "date": "2010-10-10",
        "img": null,
        "comments": [ {'content': "test comment", 'date': '2010-10-10', 'author': 'comment author', 'id': 0, "editing": false} ],
        "author": "test author",
        "comment": ""
      }];
    fetchMock.get(`${url}/articles`, {"articles": testArticles});
    service.mockFetArt()
      .then(r => expect(r).toEqual(testArticles, 'mock fetch articles should get test articles'));
    fetchMock.restore();
  })));
});
