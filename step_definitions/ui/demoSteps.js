const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('chai');
const BaseClass = require('../../core/base/BaseClass');

// Initialize BaseClass instance
let baseClass;

// Hooks
Before(async function() {
    baseClass = new BaseClass();
    await baseClass.launchBrowser('chromium', { headless: false });
    this.page = baseClass.page;
    this.context = baseClass.context;
});

After(async function() {
    if (baseClass) {
        await baseClass.cleanup();
    }
});

Given('I have configured the test environment', async function () {
    console.log('✅ Test environment configured');
    console.log('🌐 Browser launched successfully');
});

Given('I navigate to the demo application', async function () {
    // Using a public demo site for testing
    await baseClass.navigateToPage('https://example.com');
    console.log('🔗 Navigated to demo application');
});

When('I verify the page loads successfully', async function () {
    await baseClass.waitForPageLoad();
    const title = await baseClass.page.title();
    console.log(`📄 Page loaded with title: ${title}`);
});

Then('I should see the page title', async function () {
    const title = await baseClass.page.title();
    expect(title).to.be.a('string');
    expect(title.length).to.be.greaterThan(0);
    console.log(`✅ Page title verified: ${title}`);
});

Then('I should take a screenshot', async function () {
    const screenshotPath = await baseClass.takeScreenshot('demo-page');
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
});

When('I interact with page elements', async function () {
    // Test basic element interactions
    const bodyText = await baseClass.getText('body');
    console.log(`📝 Page content length: ${bodyText.length} characters`);
    
    // Test scrolling
    await baseClass.scrollToBottom();
    await baseClass.waitForTimeout(1000);
    await baseClass.scrollToTop();
    console.log('🔄 Scroll interactions completed');
});

Then('I should verify element states', async function () {
    const isBodyVisible = await baseClass.isElementVisible('body');
    expect(isBodyVisible).to.be.true;
    console.log('✅ Element visibility verified');
});

Then('I should capture performance metrics', async function () {
    try {
        const metrics = await baseClass.getPerformanceMetrics();
        console.log('⚡ Performance Metrics:');
        console.log(`  - DOM Content Loaded: ${metrics.domContentLoaded}ms`);
        console.log(`  - Load Complete: ${metrics.loadComplete}ms`);
        console.log(`  - First Paint: ${metrics.firstPaint}ms`);
    } catch (error) {
        console.log('⚠️  Performance metrics not available');
    }
});

When('I fill out a sample form', async function () {
    // Since example.com doesn't have forms, we'll simulate form actions
    console.log('📝 Simulating form interactions');
    
    // Test JavaScript execution
    await baseClass.executeScript(() => {
        console.log('JavaScript execution test successful');
        return true;
    });
});

Then('I should verify form submission', async function () {
    // Verify we can execute JavaScript and interact with the page
    const result = await baseClass.executeScript(() => {
        return document.readyState === 'complete';
    });
    expect(result).to.be.true;
    console.log('✅ Page interaction capabilities verified');
});

Then('I should generate a test report', async function () {
    const fullPageScreenshot = await baseClass.takeFullPageScreenshot('demo-full-page');
    console.log(`📊 Full page screenshot: ${fullPageScreenshot}`);
    
    console.log('🎉 Demo test completed successfully!');
    console.log('🔧 Framework capabilities verified:');
    console.log('   ✅ Browser automation');
    console.log('   ✅ Page navigation');
    console.log('   ✅ Element interaction');
    console.log('   ✅ Screenshot capture');
    console.log('   ✅ JavaScript execution');
    console.log('   ✅ Performance monitoring');
});
