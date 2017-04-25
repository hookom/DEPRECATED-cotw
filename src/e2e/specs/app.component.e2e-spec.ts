import { browser, element, by } from 'protractor';

describe('App', () => {

  beforeEach(async () => {
    return await browser.get('/');
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Climb on the Way');
  });

  it('should have <nav>', () => {
    expect(element(by.css('climb-app sd-navbar nav')).isPresent()).toEqual(true);
  });

  it('should have correct nav text for Home', () => {
    expect(element(by.css('climb-app sd-navbar nav a:first-child')).getText()).toEqual('FIND');
  });

  it('should have correct nav text for Add', () => {
    expect(element(by.css('climb-app sd-navbar nav a:nth-child(2)')).getText()).toEqual('ADD');
  });

});
