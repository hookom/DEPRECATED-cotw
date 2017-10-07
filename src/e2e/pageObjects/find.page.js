const until = protractor.ExpectedConditions;

const openSocialWheel = 'div.c-5';
const bellIcon = 'div.c-1 span a';
const gearIcon = 'div.c-2 span a';
const facebookIcon = 'div.c-3 span a';
const twitterIcon = 'div.c-4 span a';

var findPage = {
    navigateTo: () => {
        browser.get('http://localhost:5555');
    },

    openSocialMenu: () => {
        var socialPlus = element(by.css(openSocialWheel));
        browser.wait(until.presenceOf(socialPlus), 5000, 'Social menu plus element did not display')
            .then(() => {socialPlus.click()});
    },

    socialMenuIsLoaded: () => {
        var bellP = browser.wait(until.presenceOf(bellIcon), 5000, 'Bell icon link element did not display');
        var gearP = browser.wait(until.presenceOf(gearIcon), 5000, 'Gear icon link element did not display');
        var facebookP = browser.wait(until.presenceOf(facebookIcon), 5000, 'Facebook icon link element did not display');
        var twitterP = browser.wait(until.presenceOf(twitterIcon), 5000, 'Twitter icon link element did not display');

        return Promise.all([bellP, gearP, facebookP, twitterP])
            .then(() => { 
                return resolve(true);
            });
    }
}

module.exports = findPage;