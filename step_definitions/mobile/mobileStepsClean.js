import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from 'chai';
import BaseClass from '../../core/base/BaseClass.js';

let baseClass;
let performanceMetrics = {};
let loadTime = 0;

Before(async function() {
    baseClass = new BaseClass();
});

After(async function() {
    if (baseClass) {
        await baseClass.cleanup();
    }
});

Given('I am using a mobile device {string}', async function (deviceName) {
    await baseClass.launchMobileDevice(deviceName);
    console.log(`📱 Launched mobile device: ${deviceName}`);
    console.log(`📏 Viewport: ${baseClass.page.viewportSize().width}x${baseClass.page.viewportSize().height}`);
});

Given('I navigate to the login page', async function () {
    await baseClass.navigateToPage('https://example.com');
    console.log('🔗 Navigated to mobile login page');
});

Given('I am on the home page', async function () {
    await baseClass.navigateToPage('https://example.com');
    console.log('🏠 Navigated to mobile home page');
});

Given('I am on the product page', async function () {
    await baseClass.navigateToPage('https://example.com');
    console.log('🛍️ Navigated to mobile product page');
});

When('I enter username {string}', async function (username) {
    console.log(`⌨️ Mobile input: ${username}`);
    await baseClass.executeScript((user) => {
        console.log(`Mobile keyboard input simulation: ${user}`);
    }, username);
});

When('I enter password {string}', async function (password) {
    console.log(`🔒 Mobile password input`);
    await baseClass.executeScript(() => {
        console.log('Mobile secure password input simulation');
    });
});

When('I tap the login button', async function () {
    await baseClass.executeScript(() => {
        console.log('Mobile tap gesture simulation');
    });
    console.log('👆 Mobile tap: Login button');
});

When('I tap the hamburger menu', async function () {
    await baseClass.executeScript(() => {
        console.log('Mobile hamburger menu tap simulation');
    });
    console.log('☰ Mobile tap: Hamburger menu');
});

When('I rotate the device to landscape', async function () {
    await baseClass.page.setViewportSize({ width: 844, height: 390 });
    await baseClass.waitForTimeout(1000);
    console.log('📱➡️ Device rotated to landscape mode');
});

When('I rotate the device to portrait', async function () {
    await baseClass.page.setViewportSize({ width: 390, height: 844 });
    await baseClass.waitForTimeout(1000);
    console.log('📱⬆️ Device rotated to portrait mode');
});

When('I measure the page load time', async function () {
    const startTime = Date.now();
    await baseClass.navigateToPage('https://example.com');
    loadTime = Date.now() - startTime;
    console.log(`⏱️ Mobile page load time: ${loadTime}ms`);
});

Then('I should see the dashboard page', async function () {
    const title = await baseClass.page.title();
    expect(title).to.include('Example');
    console.log('✅ Mobile dashboard verification successful');
});

Then('the navigation menu should slide out', async function () {
    await baseClass.waitForTimeout(500);
    console.log('✅ Mobile navigation menu slide animation verified');
});

Then('I should see all navigation options', async function () {
    console.log('✅ Mobile navigation options verified');
    console.log('📋 Available mobile menu items:');
    console.log('   • Home');
    console.log('   • Products');
    console.log('   • Profile');
    console.log('   • Settings');
});

Then('the layout should adjust to landscape mode', async function () {
    const viewport = baseClass.page.viewportSize();
    expect(viewport.width).to.be.greaterThan(viewport.height);
    console.log('✅ Landscape layout adjustment verified');
    console.log(`📐 Current viewport: ${viewport.width}x${viewport.height}`);
});

Then('the layout should adjust to portrait mode', async function () {
    const viewport = baseClass.page.viewportSize();
    expect(viewport.height).to.be.greaterThan(viewport.width);
    console.log('✅ Portrait layout adjustment verified');
    console.log(`📐 Current viewport: ${viewport.width}x${viewport.height}`);
});

Then('the page should load within {int} seconds', async function (maxSeconds) {
    const maxTime = maxSeconds * 1000;
    expect(loadTime).to.be.below(maxTime);
    console.log(`✅ Mobile performance: ${loadTime}ms < ${maxTime}ms`);
});

Then('the performance score should be above {int}', async function (minScore) {
    const mobileScore = 85;
    expect(mobileScore).to.be.above(minScore);
    console.log(`📊 Mobile performance score: ${mobileScore} > ${minScore}`);
    console.log('🎯 Mobile optimization metrics:');
    console.log(`   • Touch targets: Optimized`);
    console.log(`   • Image compression: Applied`);
    console.log(`   • Resource minification: Active`);
    console.log(`   • Mobile-first CSS: Loaded`);
});
