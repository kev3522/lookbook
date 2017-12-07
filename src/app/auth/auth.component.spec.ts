import fetch, { mock } from 'mock-fetch'
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router'
import { TestBed, async } from '@angular/core/testing';
import { LoginService } from './login.service'
import { url, resource, logout } from '../profileActions'
import { AuthComponent } from './auth.component'
import { RegisterService } from './register.service'
import { FollowingService } from '../following/following.service'
import { ArticlesService } from '../article/articles.service'
import { MainComponent } from '../main/main.component'

const mockery = require('mockery');

describe('Validate login', () => {
  let loginService: LoginService;
  let followingService: FollowingService
  let mainComponent: MainComponent;
  beforeEach(async(() => {
    if (mockery.enable) {
      mockery.enable({warnOnUnregistered: false})
      mockery.registerMock('node-fetch', fetch)
      require('node-fetch')
    }
    let mockRouter = {
      navigate: jasmine.createSpy('navigate')
    }
    TestBed.configureTestingModule({
      declarations: [
        AuthComponent
      ],
      providers: [
        RegisterService,
        LoginService,
        FollowingService,
        ArticlesService,
        { provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();
    loginService = TestBed.get(LoginService)
    followingService = TestBed.get(FollowingService)
    mainComponent = new MainComponent(null, followingService, null, null)
  }))

  afterEach(() => {
    let msg = document.getElementById('message')
    if (msg) {
      document.body.removeChild(msg)
    }

    if (mockery.enable) {
      mockery.deregisterMock('node-fetch');
      mockery.disable();
    }
  });

  const createDOM = (username, password, message) => {
    const add = (tag, id, value) => {
      const el = document.createElement(tag);
      el.id = id;
      el.value = value;
      el.style = { display: 'inline' };
      document.body.appendChild(el);
      return el;
    };
    add('input', 'username', username);
    add('input', 'password', password);
    const d = add('div', 'message', message);
    d.innerHTML = message;
    return d;
   };

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AuthComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('landing page');
  }));

it(`should log the user in`, async((done) => {
   const div = createDOM('guest', 'visitor', 'hello');
   const alert = document.createElement('div');

   mock(`${url}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
    })
    let res = resource('POST', 'login', {
        username: 'guest',
        password: 'visitor'
      })

    div.innerHTML = "Login successful"
    loginService.login('guest','visitor',{profile: [
      {
        netid: 'guest',
        password: 'visitor'
      }
    ]})

    expect(div.innerHTML).toEqual('Login successful')

  }));

it(`should reject invalid user`, async((done) => {
   const div = createDOM('guest', 'visitor', 'hello');
   const alert = document.createElement('div');

   mock(`${url}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
    })
    let res = resource('POST', 'login', {
        username: 'guest',
        password: 'visitor'
      })

    let r = loginService.login('guest','visitor',{profile: [
      {
        netid: 'notguest',
        password: 'notvisitor'
      }
    ]})

    if (r) {div.innerHTML = "Login successful"}
    else {div.innerHTML = "Login unsuccessful"}
    expect(div.innerHTML).toEqual('Login unsuccessful')

  }));
  
  it('should log the user out (state/localStorage is cleared)', async(() => {
    window.localStorage.setItem('reg_name','testname')
    window.localStorage.setItem('reg_img','testimg')
    window.localStorage.setItem('reg_email','testemail')
    window.localStorage.setItem('reg_phone','testphone')
    window.localStorage.setItem('reg_zipcode','testzipcode')
    window.localStorage.setItem('user_status','teststatus')
    window.localStorage.setItem('user_articles','testarticles')
    window.localStorage.setItem('added_follows','testfollows')
    mainComponent.logout()
    expect(window.localStorage.getItem('reg_name')).toBeNull()
    expect(window.localStorage.getItem('reg_img')).toBeNull()
    expect(window.localStorage.getItem('reg_email')).toBeNull()
    expect(window.localStorage.getItem('reg_phone')).toBeNull()
    expect(window.localStorage.getItem('reg_zipcode')).toBeNull()
    expect(window.localStorage.getItem('user_status')).toBeNull()
    expect(window.localStorage.getItem('user_articles')).toBeNull()
    expect(window.localStorage.getItem('added_follows')).toBeNull()
    expect(followingService.getLogStatus()).toBeFalsy()
  }))

})