const findPage = require('../pageObjects/find.page.js');

describe('Find Page Tests - ', function() {
	it('should open social menu wheel', function() {

		findPage.navigateTo();
		findPage.toggleSocialMenu()
			.then(() => {
				findPage.socialMenuIsLoaded()
					.then((loaded) => {
						console.log('asserting on: ' + loaded);
						expect(loaded).toEqual(true);
					}, (rejectReason) => {
						console.log('promise rejection')
						console.log(rejectReason);
					});
			});
		
		browser.sleep(2000);
	});
});