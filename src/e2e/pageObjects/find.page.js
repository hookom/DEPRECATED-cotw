const until = protractor.ExpectedConditions;

const toggleSocialWheel = 'div.c-5 span';
const bellIcon = 'div.c-1 span a.link';
const gearIcon = 'div.c-2 span a.link';
const facebookIcon = 'div.c-3 span a.link';
const twitterIcon = 'div.c-4 span a.link';

var findPage = {
    navigateTo: () => {
        browser.get('http://localhost:5555');
    },

    toggleSocialMenu: () => {
        var socialToggle = element(by.css(toggleSocialWheel));
        return browser.wait(until.presenceOf(socialToggle), 5000, 'Social menu plus element did not display')
            .then(() => {
                socialToggle.click();
            });
    },

    socialMenuIsLoaded: () => {
        var bellP = browser.wait(until.visibilityOf($(bellIcon)), 5000, 'Bell icon link element did not display');
        var gearP = browser.wait(until.visibilityOf($(gearIcon)), 5000, 'Gear icon link element did not display');
        var facebookP = browser.wait(until.visibilityOf($(facebookIcon)), 5000, 'Facebook icon link element did not display');
        var twitterP = browser.wait(until.visibilityOf($(twitterIcon)), 5000, 'Twitter icon link element did not display');

        return Promise.all([bellP, gearP, facebookP, twitterP])
            .then((links) => {
                var loaded = true;
                links.forEach(visible => {
                    if (!visible) {
                        loaded = false;
                    }
                });
                return loaded;
            });
    }
}

module.exports = findPage;