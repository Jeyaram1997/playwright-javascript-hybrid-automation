import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import BaseClass from '../../core/base/BaseClass.js';
import DataReader from '../../core/utils/DataReader.js';

// Initialize BaseClass instance
let baseClass;
let testData;

// Hooks
Before(async function() {
    baseClass = new BaseClass();
    await baseClass.launchBrowser();
    this.page = baseClass.page;
    this.context = baseClass.context;
    this.base = baseClass; // For backward compatibility
});

After(async function() {
    if (baseClass) {
        await baseClass.cleanup();
    }
});

// Load test data
Given('I am on the login page', async function () {
    await baseClass.navigateToPage('/login');
});

Given('I have valid login credentials', async function () {
    // Read credentials from data file - this will use encrypted data if available
    try {
        this.credentials = await DataReader.readJson('./test-data/users/userTestData.json', false);
        this.credentials = this.credentials.testUsers[0]; // Use first test user
    } catch (error) {
        // Fallback to default credentials if file not found
        this.credentials = {
            username: 'admin@example.com',
            password: 'AdminPassword123!'
        };
    }
});

When('I enter my username', async function () {
    const username = this.credentials?.username || 'admin@example.com';
    await baseClass.typeText('[data-testid="username"], #username, [name="username"], [name="email"]', username);
});

When('I enter my password', async function () {
    const password = this.credentials?.password || 'AdminPassword123!';
    await baseClass.typeText('[data-testid="password"], #password, [name="password"]', password);
});

When('I click the login button', async function () {
    await baseClass.clickElement('[data-testid="login-button"], #login-btn, [type="submit"], .login-btn');
});

When('I click on the login button', async function () {
    await baseClass.clickElement('[data-testid="login-button"], #login-btn, [type="submit"], .login-btn');
});

Then('I should be redirected to the dashboard', async function () {
    await baseClass.waitForURL(/dashboard|home/);
    await baseClass.assertUrlContains('dashboard');
});

Then('I should see the welcome message', async function () {
    await baseClass.assertElementVisible('[data-testid="welcome-message"], .welcome, .greeting');
});

When('I enter invalid credentials', async function () {
    await baseClass.typeText('[data-testid="username"], #username, [name="username"]', 'invalid@example.com');
    await baseClass.typeText('[data-testid="password"], #password, [name="password"]', 'wrongpassword');
});

Then('I should see an error message', async function () {
    await baseClass.assertElementVisible('[data-testid="error-message"], .error, .alert-error');
});

When('I use AI to login with {string} and {string}', async function (username, password) {
    await baseClass.aiType('username field', username);
    await baseClass.aiType('password field', password);
    await baseClass.aiClick('login button');
});

When('I enter username {string} and password {string}', async function (username, password) {
    await baseClass.typeText('[data-testid="username"], #username, [name="username"]', username);
    await baseClass.typeText('[data-testid="password"], #password, [name="password"]', password);
});

Then('I should be logged in successfully', async function () {
    await baseClass.waitForURL(/dashboard|home|profile/);
    await baseClass.assertPageHasText('Welcome');
});

Then('I should see the {string} specific dashboard', async function (role) {
    await baseClass.assertPageHasText(role);
    await baseClass.assertElementVisible(`[data-role="${role}"], .${role}-dashboard`);
});

When('I enter my password', async function () {
    const password = this.credentials?.password || 'testpass123';
    await this.base.fillText('[data-testid="password"]', password);
});

When('I click the login button', async function () {
    await this.base.clickElement('[data-testid="login-button"]');
});

When('I enter invalid credentials', async function () {
    await this.base.fillText('[data-testid="username"]', 'invalid@example.com');
    await this.base.fillText('[data-testid="password"]', 'wrongpassword');
    await this.base.clickElement('[data-testid="login-button"]');
});

When('I use AI to login with {string} and {string}', async function (username, password) {
    // Example of using AI-powered actions from BaseClass
    await this.base.aiFill('username field', username);
    await this.base.aiFill('password field', password);
    await this.base.aiClick('login button');
});

Then('I should be redirected to the dashboard', async function () {
    await this.base.expectToBeVisible('[data-testid="dashboard"]');
    const title = await this.base.getTitle();
    expect(title).to.include('Dashboard');
});

Then('I should see an error message', async function () {
    await this.base.expectToBeVisible('[data-testid="error-message"]');
    const errorText = await this.base.getText('[data-testid="error-message"]');
    expect(errorText).to.include('Invalid credentials');
});

Then('I should see the welcome message', async function () {
    await this.base.expectToBeVisible('[data-testid="welcome-message"]');
    const welcomeText = await this.base.getText('[data-testid="welcome-message"]');
    expect(welcomeText).to.include('Welcome');
});