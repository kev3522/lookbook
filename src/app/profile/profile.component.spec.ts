import fetch, { mock } from 'mock-fetch'
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';
import { url, resource } from '../profileActions'
import { ProfileComponent } from './profile.component'
import { RegisterService } from '../auth/register.service'
import { ProfileService } from './profile.service'
import { HeadlineService } from '../main/headline.service'

const mockery = require('mockery');

describe('Validate profile actions', () => {
  let profileService: ProfileService;
  let headlineService: HeadlineService;
  beforeEach(async(() => {
    if (mockery.enable) {
      mockery.enable({warnOnUnregistered: false})
      mockery.registerMock('node-fetch', fetch)
      require('node-fetch')
    }
    TestBed.configureTestingModule({
      declarations: [
        ProfileComponent
      ],
      providers: [
        RegisterService,
        ProfileService,
        HeadlineService
      ],
      imports: [
      	RouterTestingModule
      	]
    }).compileComponents();
    profileService = TestBed.get(ProfileService);
    headlineService = TestBed.get(HeadlineService);
  }))

  afterEach(() => {
  	window.localStorage.clear()
	if (mockery.enable) {
	  mockery.deregisterMock('node-fetch');
	  mockery.disable();
  	}
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(ProfileComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('profile page');
  }));

  it("should fetch the user's profile information", async(() => {
    resource('POST', 'login', {
    	username:'guest',
    	password:'visitor'
    })
	window.localStorage.setItem('reg_name','testname')
	window.localStorage.setItem('reg_img','testimg')
	window.localStorage.setItem('reg_email','testemail')
	window.localStorage.setItem('reg_phone','testphone')
	window.localStorage.setItem('reg_zipcode','testzipcode')

	profileService.useLocalProfile()
	let prof = profileService.getProfile()[0]
	expect(prof['name']).toEqual('testname')
	expect(prof['image']).toEqual('testimg')
	expect(prof['email']).toEqual('testemail')
	expect(prof['phone']).toEqual('testphone')
	expect(prof['zipcode']).toEqual('testzipcode')
  }))

  it('should update headline', async((done) => {
  	let oldheadline = document.createElement('div')
  	oldheadline.id = 'oldheadline'
  	oldheadline.innerHTML = ''
  	let newheadline = document.createElement('input')
  	newheadline.id = 'newheadline'
  	newheadline.value = 'shouldupdatetothis'
  	window.localStorage.setItem('reg_name','testname')
  	window.localStorage.setItem('defaultusers','&testname**shouldupdatetothis')
  	headlineService.updateStatus(newheadline, oldheadline)
  	expect(oldheadline.innerHTML).toEqual('shouldupdatetothis')
  }))
})