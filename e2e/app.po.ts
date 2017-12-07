import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(page) {
    return browser.get(page);
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  typeInput(elementId, text) {
  	return element(by.id(elementId)).sendKeys(text)
  }

  waitFor(selector) {
	  return browser.wait(function () {
	    return browser.isElementPresent(by.css(selector));
	  }, 50000);
	}

  getInnerHTML(elementId) {
  	return element(by.id(elementId)).getText();
  }

  waitLittle() {
  	browser.sleep(1000)
  }
}
