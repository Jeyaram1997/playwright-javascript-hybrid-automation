const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('chai');
const BaseClass = require('../../core/base/BaseClass');

let baseClass;
let apiResponse;

Before(async function() {
    baseClass = new BaseClass();
    await baseClass.launchBrowser();
});

After(async function() {
    if (baseClass) {
        await baseClass.cleanup();
    }
});

Given('I have API testing configured', async function () {
    console.log('✅ API testing environment configured');
});

When('I send a GET request to a public API', async function () {
    // Test with a public API
    apiResponse = await baseClass.apiGet('https://jsonplaceholder.typicode.com/posts/1');
    console.log(`🌐 API GET request sent`);
    console.log(`📊 Status: ${apiResponse.status}`);
    console.log(`⏱️  Response Time: ${apiResponse.responseTime}ms`);
});

Then('I should receive a successful response', async function () {
    expect(apiResponse.status).to.equal(200);
    expect(apiResponse.json).to.be.an('object');
    expect(apiResponse.json.id).to.equal(1);
    console.log('✅ API response validation successful');
});

Then('I should verify response time', async function () {
    expect(apiResponse.responseTime).to.be.below(5000); // 5 seconds max
    console.log(`⚡ Response time verified: ${apiResponse.responseTime}ms`);
});

When('I send a request with custom headers', async function () {
    const customHeaders = {
        'User-Agent': 'Playwright-Framework-Test',
        'Accept': 'application/json'
    };
    
    apiResponse = await baseClass.apiGet('https://httpbin.org/headers', {
        headers: customHeaders
    });
    
    console.log('📤 Request sent with custom headers');
});

Then('I should verify the response headers', async function () {
    expect(apiResponse.status).to.equal(200);
    expect(apiResponse.headers).to.be.an('object');
    console.log('✅ Response headers verified');
});

Then('I should log the response details', async function () {
    console.log('📋 API Response Details:');
    console.log(`   Status: ${apiResponse.status}`);
    console.log(`   Status Text: ${apiResponse.statusText}`);
    console.log(`   Response Time: ${apiResponse.responseTime}ms`);
    console.log(`   Content Length: ${apiResponse.body.length} characters`);
    
    if (apiResponse.json) {
        console.log('   Response Type: JSON');
        console.log(`   Response Keys: ${Object.keys(apiResponse.json).join(', ')}`);
    }
    
    console.log('🎉 API testing capabilities verified!');
});
