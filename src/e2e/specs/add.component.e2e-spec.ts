import { browser, element, by } from 'protractor';

describe('Add', () => {

  beforeEach(async () => {
    return await browser.get('/add');
  });

  it('should have correct feature heading', () => {
    expect(element(by.css('sd-add h2')).getText()).toEqual('Features');
  });

});
