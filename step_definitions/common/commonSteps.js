import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import BaseClass from '../../core/base/BaseClass.js';

// Initialize BaseClass instance
let baseClass;

// Hooks
Before(async function() {
    baseClass = new BaseClass();
    await baseClass.launchBrowser();
    this.page = baseClass.page;
    this.context = baseClass.context;
});

After(async function() {
    if (baseClass) {
        await baseClass.closeBrowser();
    }
});

// Common Navigation Steps
Given('I am on the {string} page', async function(pageName) {
    const urls = {
        'home': '/',
        'login': '/login',
        'dashboard': '/dashboard',
        'profile': '/profile',
        'settings': '/settings'
    };
    
    const url = urls[pageName.toLowerCase()] || pageName;
    await baseClass.navigateToPage(url);
});

Given('I navigate to {string}', async function(url) {
    await baseClass.navigateToPage(url);
});

When('I go back', async function() {
    await this.page.goBack();
});

When('I go forward', async function() {
    await this.page.goForward();
});

When('I refresh the page', async function() {
    await this.page.reload();
});

// Common Element Interaction Steps
When('I click on {string}', async function(elementSelector) {
    await baseClass.clickElement(elementSelector);
});

When('I click on the element with text {string}', async function(text) {
    await baseClass.clickElementByText(text);
});

When('I type {string} in {string}', async function(text, selector) {
    await baseClass.typeText(selector, text);
});

When('I clear the field {string}', async function(selector) {
    await baseClass.clearField(selector);
});

When('I select {string} from {string}', async function(option, selector) {
    await baseClass.selectFromDropdown(selector, option);
});

When('I upload file {string} to {string}', async function(filePath, selector) {
    await baseClass.uploadFile(selector, filePath);
});

When('I check the checkbox {string}', async function(selector) {
    await baseClass.checkCheckbox(selector);
});

When('I uncheck the checkbox {string}', async function(selector) {
    await baseClass.uncheckCheckbox(selector);
});

When('I select radio button {string}', async function(selector) {
    await baseClass.selectRadioButton(selector);
});

// Common Assertion Steps
Then('I should see {string}', async function(text) {
    await expect(this.page.locator(`text=${text}`)).toBeVisible();
});

Then('I should not see {string}', async function(text) {
    await expect(this.page.locator(`text=${text}`)).not.toBeVisible();
});

Then('the element {string} should be visible', async function(selector) {
    await expect(this.page.locator(selector)).toBeVisible();
});

Then('the element {string} should not be visible', async function(selector) {
    await expect(this.page.locator(selector)).not.toBeVisible();
});

Then('the element {string} should be enabled', async function(selector) {
    await expect(this.page.locator(selector)).toBeEnabled();
});

Then('the element {string} should be disabled', async function(selector) {
    await expect(this.page.locator(selector)).toBeDisabled();
});

Then('the page title should be {string}', async function(expectedTitle) {
    await expect(this.page).toHaveTitle(expectedTitle);
});

Then('the page URL should contain {string}', async function(urlPart) {
    await expect(this.page).toHaveURL(new RegExp(urlPart));
});

Then('the field {string} should contain {string}', async function(selector, expectedValue) {
    await expect(this.page.locator(selector)).toHaveValue(expectedValue);
});

Then('the field {string} should be empty', async function(selector) {
    await expect(this.page.locator(selector)).toHaveValue('');
});

// Common Wait Steps
When('I wait for {int} seconds', async function(seconds) {
    await baseClass.waitForTimeout(seconds * 1000);
});

When('I wait for {string} to be visible', async function(selector) {
    await baseClass.waitForElement(selector);
});

When('I wait for {string} to disappear', async function(selector) {
    await baseClass.waitForElementToDisappear(selector);
});

When('I wait for page to load', async function() {
    await baseClass.waitForPageLoad();
});

// Common Form Steps
When('I fill the form with:', async function(dataTable) {
    const data = dataTable.rowsHash();
    for (const [field, value] of Object.entries(data)) {
        await baseClass.typeText(`[name="${field}"]`, value);
    }
});

When('I submit the form', async function() {
    await baseClass.clickElement('button[type="submit"]');
});

When('I reset the form', async function() {
    await baseClass.clickElement('button[type="reset"]');
});

// Common Modal/Dialog Steps
When('I open the modal {string}', async function(modalSelector) {
    await baseClass.clickElement(`[data-modal="${modalSelector}"]`);
    await baseClass.waitForElement('.modal');
});

When('I close the modal', async function() {
    await baseClass.clickElement('.modal-close');
    await baseClass.waitForElementToDisappear('.modal');
});

Then('the modal should be open', async function() {
    await expect(this.page.locator('.modal')).toBeVisible();
});

Then('the modal should be closed', async function() {
    await expect(this.page.locator('.modal')).not.toBeVisible();
});

// Common Alert/Toast Steps
When('I accept the alert', async function() {
    this.page.on('dialog', dialog => dialog.accept());
});

When('I dismiss the alert', async function() {
    this.page.on('dialog', dialog => dialog.dismiss());
});

Then('I should see a success message', async function() {
    await expect(this.page.locator('.success-message, .toast.success')).toBeVisible();
});

Then('I should see an error message', async function() {
    await expect(this.page.locator('.error-message, .toast.error')).toBeVisible();
});

Then('I should see a warning message', async function() {
    await expect(this.page.locator('.warning-message, .toast.warning')).toBeVisible();
});

// Common Table Steps
When('I click on row {int} in the table', async function(rowNumber) {
    await baseClass.clickElement(`table tbody tr:nth-child(${rowNumber})`);
});

When('I sort the table by {string}', async function(columnName) {
    await baseClass.clickElement(`th:has-text("${columnName}")`);
});

Then('the table should have {int} rows', async function(expectedRows) {
    const rows = await this.page.locator('table tbody tr').count();
    expect(rows).toBe(expectedRows);
});

Then('the table should contain {string}', async function(text) {
    await expect(this.page.locator('table')).toContainText(text);
});

// Common Search Steps
When('I search for {string}', async function(searchTerm) {
    await baseClass.typeText('[data-testid="search-input"]', searchTerm);
    await baseClass.clickElement('[data-testid="search-button"]');
});

When('I clear the search', async function() {
    await baseClass.clearField('[data-testid="search-input"]');
});

Then('the search results should contain {string}', async function(text) {
    await expect(this.page.locator('.search-results')).toContainText(text);
});

Then('there should be no search results', async function() {
    await expect(this.page.locator('.no-results')).toBeVisible();
});

// Common Menu/Navigation Steps
When('I open the menu', async function() {
    await baseClass.clickElement('.menu-toggle, .hamburger-menu');
});

When('I navigate to {string} from menu', async function(menuItem) {
    await baseClass.clickElementByText(menuItem);
});

When('I expand the {string} section', async function(sectionName) {
    await baseClass.clickElement(`[data-section="${sectionName}"] .expand-toggle`);
});

// Common List Steps
When('I select item {int} from the list', async function(itemNumber) {
    await baseClass.clickElement(`.list-item:nth-child(${itemNumber})`);
});

When('I select all items in the list', async function() {
    await baseClass.clickElement('.select-all');
});

Then('the list should have {int} items', async function(expectedCount) {
    const count = await this.page.locator('.list-item').count();
    expect(count).toBe(expectedCount);
});

// Common Drag and Drop Steps
When('I drag {string} to {string}', async function(sourceSelector, targetSelector) {
    await baseClass.dragAndDrop(sourceSelector, targetSelector);
});

// Common Keyboard Steps
When('I press {string}', async function(key) {
    await this.page.keyboard.press(key);
});

When('I press {string} and {string}', async function(key1, key2) {
    await this.page.keyboard.press(`${key1}+${key2}`);
});

// Common Screenshot Steps
When('I take a screenshot', async function() {
    await baseClass.takeScreenshot('step-screenshot');
});

When('I take a full page screenshot', async function() {
    await baseClass.takeFullPageScreenshot('full-page-screenshot');
});

// Common Local Storage Steps
When('I set local storage {string} to {string}', async function(key, value) {
    await this.page.evaluate(([k, v]) => {
        localStorage.setItem(k, v);
    }, [key, value]);
});

When('I clear local storage', async function() {
    await this.page.evaluate(() => {
        localStorage.clear();
    });
});

Then('local storage {string} should be {string}', async function(key, expectedValue) {
    const value = await this.page.evaluate((k) => {
        return localStorage.getItem(k);
    }, key);
    expect(value).toBe(expectedValue);
});

// Common Cookie Steps
When('I set cookie {string} to {string}', async function(name, value) {
    await this.context.addCookies([{
        name: name,
        value: value,
        domain: new URL(this.page.url()).hostname,
        path: '/'
    }]);
});

When('I clear all cookies', async function() {
    await this.context.clearCookies();
});

// Common Scroll Steps
When('I scroll to top', async function() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
});

When('I scroll to bottom', async function() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
});

When('I scroll to {string}', async function(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
});

// Common Viewport Steps
When('I set viewport to {int}x{int}', async function(width, height) {
    await this.page.setViewportSize({ width, height });
});

When('I set viewport to mobile', async function() {
    await this.page.setViewportSize({ width: 375, height: 667 });
});

When('I set viewport to tablet', async function() {
    await this.page.setViewportSize({ width: 768, height: 1024 });
});

When('I set viewport to desktop', async function() {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
});
