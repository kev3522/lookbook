import fetch, { mock } from 'mock-fetch'
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';
import { url, resource } from '../profileActions'
import { ArticleComponent } from './article.component'
import { ArticlesService } from './articles.service'
import { NewArticleService } from './new-article.service'

const mockery = require('mockery');

describe('Validate article actions', () => {
  let articlesService: ArticlesService
  let newarticleService: NewArticleService
  beforeEach(async(() => {
    if (mockery.enable) {
      mockery.enable({warnOnUnregistered: false})
      mockery.registerMock('node-fetch', fetch)
      require('node-fetch')
    }
    TestBed.configureTestingModule({
      declarations: [
        ArticleComponent
      ],
      providers: [
        ArticlesService,
        NewArticleService
      ],
      imports: [
        RouterTestingModule
        ]
    }).compileComponents();
    articlesService = TestBed.get(ArticlesService);
    newarticleService = TestBed.get(NewArticleService);
  }))

  afterEach(() => {
  if (mockery.enable) {
    mockery.deregisterMock('node-fetch');
    mockery.disable();
    }
  });

  it('should fetch articles', async(() => {
    window.localStorage.removeItem('user_articles')
    window.localStorage.setItem('added_follows','&guest')
    resource('GET','articles')
    .then(res => {
      let article = res.articles[0]
      articlesService.addArticle(article.text, article.img, article.author, article.date, article.id)
      expect(articlesService.getArticles()[0]).toBeTruthy()
      expect(articlesService.getArticles()[0]['author']).toEqual('guest')
    })
  }))

  it('should update the search keyword', async(() => {
    let searchinput = document.createElement('input')
    expect(searchinput.value).toEqual('')
    searchinput.value = "new search keyword"
    expect(searchinput.value).toEqual("new search keyword")
  }))

  it('should filter displayed articles by the search keyword', async(() => {
    let searchvalue = 'lorem'
    window.localStorage.removeItem('user_articles')
    window.localStorage.setItem('added_follows','&guest')
    articlesService.emptyArticles()
    resource('GET','articles')
    .then(res => {
      for (let article of res.articles) {
        articlesService.addArticle(article.text, article.img, article.author, article.date, article.id)
      }
      expect(articlesService.filterArticles(searchvalue)[0]['text']).toContain(searchvalue)
    })
  }))
})

describe('Article view', () => {
  let articlesService: ArticlesService
  let newarticleService: NewArticleService
  beforeEach(async(() => {
    if (mockery.enable) {
      mockery.enable({warnOnUnregistered: false})
      mockery.registerMock('node-fetch', fetch)
      require('node-fetch')
    }
    TestBed.configureTestingModule({
      declarations: [
        ArticleComponent
      ],
      providers: [
        ArticlesService,
        NewArticleService
      ],
      imports: [
        RouterTestingModule
        ]
    }).compileComponents();
    articlesService = TestBed.get(ArticlesService);
    newarticleService = TestBed.get(NewArticleService);
  }))

  afterEach(() => {
  if (mockery.enable) {
    mockery.deregisterMock('node-fetch');
    mockery.disable();
    }
  });

  it('should render articles', async(() => {
    const fixture = TestBed.createComponent(ArticleComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy()
  }))

  it('should dispatch actions to create new article', async(() => {
    window.localStorage.setItem('reg_name','testname')
    newarticleService.makepost('this is a new post')
    expect(articlesService.getArticles()[0]['text']).toEqual('this is a new post')
    expect(articlesService.getArticles()[0]['author']).toEqual('testname')
  }))

})