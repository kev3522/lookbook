import { AppPage } from './app.po';
import { browser, by, element, ExpectedConditions } from 'protractor';

describe('frontend App', () => {
  let page: AppPage;
  var EC = ExpectedConditions;
  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo('/');
    expect(page.getParagraphText()).toEqual('The Book');
  });

  it('should register a user', () => {
  	page.navigateTo('/auth');
  	page.typeInput('display','testuser')
  	page.typeInput('email','test@test.com')
  	page.typeInput('phone','123-456-7890')
  	page.typeInput('zipcode','12345')
  	page.typeInput('dob','01011997')
  	page.typeInput('password','pass-pass-pass')
  	page.typeInput('passwordconfirm','pass-pass-pass')
  	element(by.css('button#register')).click()
  	.then(_ => {
	  	expect(page.getInnerHTML('displayAlert')).toEqual('')
	  	expect(page.getInnerHTML('emailAlert')).toEqual('')
	  	expect(page.getInnerHTML('phoneAlert')).toEqual('')
	  	expect(page.getInnerHTML('zipcodeAlert')).toEqual('')
	  	expect(page.getInnerHTML('passwordAlert')).toEqual('')
	  	expect(page.getInnerHTML('bottomRegister')).toEqual('Registration successful!')
  	})
  })

  it('should login a user', () => {
  	page.typeInput('loginName','testuser')
  	page.typeInput('loginPassword','pass-pass-pass')
  	element(by.css('button#login')).click()
  	.then(_ => {
  		expect(page.getInnerHTML('loginAlert')).toEqual('')
  	})
  })

  it('should create new article and validate article appears in feed', () => {
  	browser.wait(function() {
  		return browser.driver.getCurrentUrl()
  		.then(url => {
  			return /main/.test(url)
  		})
  	})
  	browser.wait(EC.textToBePresentInElement(element(by.css('span#user_name')), 'testuser'), 5000);
  	expect(element(by.css('span#user_name')).getText()).toEqual('testuser')

  	element.all(by.css(".articleText")).count()
  	.then(count => {
  		page.typeInput('newposttext','e2e test post')
  		element(by.css('button#postbtn')).click()
  		.then(_ => {
  			page.waitLittle()
	  		element.all(by.css(".articleText")).count()
	  		.then(count2 => {
	  			expect(count2).toBeGreaterThan(count)
	  		})
	  	})
  	})
  })

  it('should edit an article and validate changed article text', () => {
  	browser.wait(function() {
  		return browser.driver.getCurrentUrl()
  		.then(url => {
  			return /main/.test(url)
  		})
  	})
  	page.waitFor('.articleText')
  	element.all(by.css('.articleText')).get(0).getText()
  	.then(text => {
  		expect(text).toEqual('e2e test post')
  		element.all(by.css('#newbody')).get(0).sendKeys('edited e2e test post')
  		element.all(by.css('#articleeditbtn')).get(0).click()
  		.then(_ => {
  			page.waitLittle()
  			element.all(by.css('.articleText')).get(0).getText()
  			.then(text2 => {
  				expect(text2).toEqual('edited e2e test post')
  			})
  		})
  	})
  })

  it('should update headline headline and verify change', () => {
  	browser.wait(function() {
  		return browser.driver.getCurrentUrl()
  		.then(url => {
  			return /main/.test(url)
  		})
  	})
  	page.waitFor('#newstatus')
  	element(by.css('#newstatus')).sendKeys('e2e: new status')
  	element(by.css('#updatestatus')).click()
  	.then(_ => {
  		page.waitLittle()
  		element(by.css('#userstatus')).getText()
  		.then(text => {
  			expect(text).toEqual('e2e: new status')
  		})
  	})
  })

  it('should add the Follower user and verify follower count increments', () => {
  	element.all(by.css('span.followername')).count()
  	.then(count => {
	  	element(by.css('#newfriendname')).sendKeys('Follower')
	  	element(by.css('#addfriendbtn')).click()
	  	.then(_ => {
	  		page.waitLittle()
	  		page.waitFor('span.followername')
	  		element.all(by.css('span.followername')).get(-1).getText()
	  		.then(text => {
	  			expect(text).toEqual('Follower')
	  			element.all(by.css('span.followername')).count()
	  			.then(count2 => {
	  				expect(count + 1).toEqual(count2)
	  			})
	  		})
	  	})
	})
  })

  it ('should remove the Follower user and verify following count decreases by one', () => {
  	element.all(by.css('span.followername')).count()
  	.then(count => {
  		element.all(by.css('#removefriendbtn')).get(-1).click()
  		.then(_ => {
  			page.waitLittle()
  			element.all(by.css('span.followername')).count()
  			.then(count2 => {
  				expect(count - 1).toEqual(count2)
  			})
  		})
  	})
  })

  it ('should search for special article and verify author', () => {
  	element(by.css('#searchbar')).sendKeys('e2e test post')
  	element(by.css('#searchbtn')).click()
  	page.waitLittle()
  	element.all(by.css('.articleAuthor')).count()
  	.then(count => {
  		expect(count).toEqual(1)
  	})
  	element.all(by.css('.articleAuthor')).get(0).getText()
  	.then(text => {
  		expect(text).toEqual('testuser')
  	})
  })

  it ('should update user email and verify', () => {
  	page.navigateTo('/#/profile')
  	browser.wait(function() {
  		return browser.driver.getCurrentUrl()
  		.then(url => {
  			return /profile/.test(url)
  		})
  	})
  	element(by.css('#updateemail')).sendKeys("updated@updated.com")
  	browser.wait(EC.elementToBeClickable(element(by.css('#updatebtn'))),2000)
  	element(by.css('#updatebtn')).click()
  	.then(_ => {
  		page.waitLittle()
  		element(by.css('#currentemail')).getText()
  		.then(text => {
  			expect(text).toEqual('updated@updated.com')
  		})
  	})
  })

  it ('should update user zipcode and verify', () => {
  	element(by.css('#updatezipcode')).sendKeys("00000")
  	browser.wait(EC.elementToBeClickable(element(by.css('#updatebtn'))),2000)
  	element(by.css('#updatebtn')).click()
  	.then(_ => {
  		page.waitLittle()
  		element(by.css('#currentzipcode')).getText()
  		.then(text => {
  			expect(text).toEqual('00000')
  		})
  	})
  })

  it ('should update user password and verify', () => {
  	element(by.css('#updatepassword')).sendKeys("new-new-new")
  	element(by.css('#updatepasswordconfirm')).sendKeys("new-new-new")
  	browser.wait(EC.elementToBeClickable(element(by.css('#updatebtn'))),2000)
  	element(by.css('#updatebtn')).click()
  	.then(_ => {
  		page.waitLittle()
  		element(by.css('#passwordAlert')).getText()
  		.then(text => {
  			expect(text).toEqual("You can't change your password right now, sorry!")
  		})
  	})
  })

});
