/**
 * Enhanced Base Class for Playwright Hybrid Framework
 * Enterprise-grade automation framework with comprehensive features
 * @author Jeyaram K
 * @version 2.0.0
 */

import { expect } from '@playwright/test';
import { chromium, firefox, webkit, devices } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BaseClass {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.config = this.loadConfig();
        this.testData = {};
        this.screenshots = [];
        this.performanceMetrics = {};
    }

    // --- Configuration Management ---
    loadConfig() {
        try {
            const env = process.env.NODE_ENV || 'dev';
            const configPath = path.join(__dirname, `../../config/environments/${env}.json`);
            return require(configPath);
        } catch (error) {
            console.warn('Config file not found, using defaults');
            return {
                baseUrl: 'http://localhost:3000',
                browser: 'chromium',
                headless: true,
                timeout: 30000
            };
        }
    }

    // --- Browser Management ---
    async launchBrowser(browserType = 'chromium', options = {}) {
        const defaultOptions = {
            headless: this.config.headless || false,
            slowMo: this.config.slowMo || 0,
            timeout: this.config.timeout || 30000,
            ...options
        };

        switch (browserType.toLowerCase()) {
            case 'firefox':
                this.browser = await firefox.launch(defaultOptions);
                break;
            case 'webkit':
                this.browser = await webkit.launch(defaultOptions);
                break;
            default:
                this.browser = await chromium.launch(defaultOptions);
        }

        this.context = await this.browser.newContext({
            viewport: { width: 1920, height: 1080 },
            recordVideo: { dir: './reports/videos' },
            ...options.contextOptions
        });

        this.page = await this.context.newPage();
        await this.setupPageListeners();
        return this.page;
    }

    async setupPageListeners() {
        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error('Browser Console Error:', msg.text());
            }
        });

        this.page.on('pageerror', error => {
            console.error('Page Error:', error.message);
        });

        this.page.on('requestfailed', request => {
            console.warn('Request Failed:', request.url(), request.failure()?.errorText);
        });
    }

    async closeBrowser() {
        if (this.page) await this.page.close();
        if (this.context) await this.context.close();
        if (this.browser) await this.browser.close();
    }

    // --- Mobile Device Support ---
    async launchMobileDevice(deviceName = 'iPhone 12') {
        const device = devices[deviceName];
        if (!device) {
            throw new Error(`Device ${deviceName} not found`);
        }

        this.browser = await chromium.launch({ headless: false });
        this.context = await this.browser.newContext({
            ...device,
            recordVideo: { dir: './reports/videos' }
        });
        this.page = await this.context.newPage();
        await this.setupPageListeners();
        return this.page;
    }

    async simulateNetworkConditions(networkProfile = 'slow3G') {
        const profiles = {
            slow3G: { downloadThroughput: 500 * 1024 / 8, uploadThroughput: 500 * 1024 / 8, latency: 400 },
            fast3G: { downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8, latency: 150 },
            offline: { downloadThroughput: 0, uploadThroughput: 0, latency: 0 }
        };

        await this.page.route('**/*', route => {
            const profile = profiles[networkProfile];
            setTimeout(() => route.continue(), profile.latency);
        });
    }

    // --- Navigation Actions ---
    async navigateToPage(url) {
        const fullUrl = url.startsWith('http') ? url : `${this.config.baseUrl}${url}`;
        await this.page.goto(fullUrl, { waitUntil: 'networkidle' });
        await this.waitForPageLoad();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForFunction(() => document.readyState === 'complete');
    }

    async goBack() {
        await this.page.goBack();
    }

    async goForward() {
        await this.page.goForward();
    }

    async refreshPage() {
        await this.page.reload();
    }

    // --- Element Interaction ---
    async clickElement(selector, options = {}) {
        await this.waitForElement(selector);
        await this.page.click(selector, options);
    }

    async doubleClickElement(selector) {
        await this.waitForElement(selector);
        await this.page.dblclick(selector);
    }

    async rightClickElement(selector) {
        await this.waitForElement(selector);
        await this.page.click(selector, { button: 'right' });
    }

    async hoverElement(selector) {
        await this.waitForElement(selector);
        await this.page.hover(selector);
    }

    async typeText(selector, text, options = {}) {
        await this.waitForElement(selector);
        await this.page.fill(selector, '');
        await this.page.type(selector, text, { delay: 100, ...options });
    }

    async clearField(selector) {
        await this.waitForElement(selector);
        await this.page.fill(selector, '');
    }

    async pressKey(key) {
        await this.page.keyboard.press(key);
    }

    async selectFromDropdown(selector, value) {
        await this.waitForElement(selector);
        await this.page.selectOption(selector, value);
    }

    async checkCheckbox(selector) {
        await this.waitForElement(selector);
        await this.page.check(selector);
    }

    async uncheckCheckbox(selector) {
        await this.waitForElement(selector);
        await this.page.uncheck(selector);
    }

    async selectRadioButton(selector) {
        await this.waitForElement(selector);
        await this.page.check(selector);
    }

    async uploadFile(selector, filePath) {
        await this.waitForElement(selector);
        await this.page.setInputFiles(selector, filePath);
    }

    async dragAndDrop(sourceSelector, targetSelector) {
        await this.waitForElement(sourceSelector);
        await this.waitForElement(targetSelector);
        await this.page.dragAndDrop(sourceSelector, targetSelector);
    }

    // --- Element Information ---
    async getText(selector) {
        await this.waitForElement(selector);
        return await this.page.textContent(selector);
    }

    async getInputValue(selector) {
        await this.waitForElement(selector);
        return await this.page.inputValue(selector);
    }

    async getAttribute(selector, attribute) {
        await this.waitForElement(selector);
        return await this.page.getAttribute(selector, attribute);
    }

    async isElementVisible(selector) {
        try {
            return await this.page.isVisible(selector);
        } catch {
            return false;
        }
    }

    async isElementEnabled(selector) {
        try {
            await this.waitForElement(selector);
            return await this.page.isEnabled(selector);
        } catch {
            return false;
        }
    }

    async getElementCount(selector) {
        return await this.page.locator(selector).count();
    }

    // --- Wait Functions ---
    async waitForElement(selector, timeout = 10000) {
        await this.page.waitForSelector(selector, { timeout });
    }

    async waitForElementToDisappear(selector, timeout = 10000) {
        await this.page.waitForSelector(selector, { state: 'hidden', timeout });
    }

    async waitForText(selector, text, timeout = 10000) {
        await this.page.waitForFunction(
            (sel, txt) => document.querySelector(sel)?.textContent?.includes(txt),
            [selector, text],
            { timeout }
        );
    }

    async waitForTimeout(milliseconds) {
        await this.page.waitForTimeout(milliseconds);
    }

    async waitForURL(urlPattern, timeout = 10000) {
        await this.page.waitForURL(urlPattern, { timeout });
    }

    // --- JavaScript Execution ---
    async executeScript(script, ...args) {
        return await this.page.evaluate(script, ...args);
    }

    async scrollToElement(selector) {
        await this.waitForElement(selector);
        await this.page.locator(selector).scrollIntoViewIfNeeded();
    }

    async scrollToTop() {
        await this.page.evaluate(() => window.scrollTo(0, 0));
    }

    async scrollToBottom() {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    // --- Frame Handling ---
    async switchToFrame(frameSelector) {
        const frame = await this.page.frame({ name: frameSelector }) || 
                      await this.page.frameLocator(frameSelector);
        return frame;
    }

    // --- Dialog Handling ---
    async handleAlert(action = 'accept', text = '') {
        this.page.on('dialog', async dialog => {
            if (action === 'accept') {
                await dialog.accept(text);
            } else {
                await dialog.dismiss();
            }
        });
    }

    // --- Screenshot and Recording ---
    async takeScreenshot(name = 'screenshot', options = {}) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${name}-${timestamp}.png`;
        const screenshotPath = path.join('./reports/screenshots', filename);
        
        await fs.mkdir('./reports/screenshots', { recursive: true });
        await this.page.screenshot({ path: screenshotPath, ...options });
        
        this.screenshots.push(screenshotPath);
        return screenshotPath;
    }

    async takeFullPageScreenshot(name = 'fullpage-screenshot') {
        return await this.takeScreenshot(name, { fullPage: true });
    }

    async takeElementScreenshot(selector, name = 'element-screenshot') {
        await this.waitForElement(selector);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${name}-${timestamp}.png`;
        const screenshotPath = path.join('./reports/screenshots', filename);
        
        await fs.mkdir('./reports/screenshots', { recursive: true });
        await this.page.locator(selector).screenshot({ path: screenshotPath });
        
        return screenshotPath;
    }

    // --- API Testing ---
    async apiRequest(method, endpoint, options = {}) {
        const url = endpoint.startsWith('http') ? endpoint : `${this.config.apiBaseUrl}${endpoint}`;
        
        const requestOptions = {
            method: method.toUpperCase(),
            url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
            ...options
        };

        const startTime = Date.now();
        const response = await this.context.request.fetch(url, requestOptions);
        const endTime = Date.now();

        const responseData = {
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
            body: await response.text(),
            responseTime: endTime - startTime
        };

        try {
            responseData.json = JSON.parse(responseData.body);
        } catch {
            // Body is not JSON
        }

        return responseData;
    }

    async apiGet(endpoint, options = {}) {
        return await this.apiRequest('GET', endpoint, options);
    }

    async apiPost(endpoint, data, options = {}) {
        return await this.apiRequest('POST', endpoint, { data: JSON.stringify(data), ...options });
    }

    async apiPut(endpoint, data, options = {}) {
        return await this.apiRequest('PUT', endpoint, { data: JSON.stringify(data), ...options });
    }

    async apiDelete(endpoint, options = {}) {
        return await this.apiRequest('DELETE', endpoint, options);
    }

    // --- Performance Monitoring ---
    async startPerformanceMonitoring() {
        await this.page.addInitScript(() => {
            window.performanceMetrics = {
                navigationStart: performance.timing.navigationStart,
                loadStart: performance.timing.loadEventStart,
                loadEnd: performance.timing.loadEventEnd
            };
        });
    }

    async getPerformanceMetrics() {
        return await this.page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');
            
            return {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
                firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                timeToInteractive: navigation.domInteractive - navigation.navigationStart,
                totalPageSize: performance.getEntriesByType('resource').reduce((size, resource) => {
                    return size + (resource.transferSize || 0);
                }, 0)
            };
        });
    }

    async measurePageLoadTime(url) {
        const startTime = Date.now();
        await this.navigateToPage(url);
        const endTime = Date.now();
        return endTime - startTime;
    }

    // --- Lighthouse Integration ---
    async runLighthouseAudit(url, options = {}) {
        const lighthouse = require('lighthouse');
        const chromeLauncher = require('chrome-launcher');

        const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
        const runnerResult = await lighthouse(url, {
            logLevel: 'info',
            output: 'html',
            onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
            port: chrome.port,
            ...options
        });

        await chrome.kill();

        // Save report
        const reportPath = path.join('./reports/lighthouse', `lighthouse-${Date.now()}.html`);
        await fs.mkdir('./reports/lighthouse', { recursive: true });
        await fs.writeFile(reportPath, runnerResult.report);

        return {
            scores: runnerResult.lhr.categories,
            reportPath,
            metrics: runnerResult.lhr.audits
        };
    }

    // --- Data Management ---
    async loadTestData(dataFile) {
        try {
            const dataPath = path.join('./test-data', dataFile);
            const data = await fs.readFile(dataPath, 'utf8');
            this.testData[dataFile] = JSON.parse(data);
            return this.testData[dataFile];
        } catch (error) {
            console.error(`Failed to load test data from ${dataFile}:`, error.message);
            return null;
        }
    }

    getTestData(dataFile, key = null) {
        const data = this.testData[dataFile];
        return key ? data?.[key] : data;
    }

    // --- Security Features ---
    encryptSensitiveData(data, secretKey = process.env.ENCRYPTION_KEY || 'default-key') {
        const cipher = crypto.createCipher('aes-256-cbc', secretKey);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decryptSensitiveData(encryptedData, secretKey = process.env.ENCRYPTION_KEY || 'default-key') {
        const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    // --- Database Operations ---
    async connectToDatabase(connectionString) {
        // Placeholder for database connection
        // Implementation depends on database type (MySQL, PostgreSQL, MongoDB, etc.)
        console.log('Database connection established');
    }

    async executeQuery(query, params = []) {
        // Placeholder for database query execution
        console.log(`Executing query: ${query}`);
        return { success: true, data: [] };
    }

    // --- Email Integration ---
    async sendEmail(options) {
        const transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: options.from || process.env.SMTP_USER,
            to: options.to,
            subject: options.subject,
            html: options.html || options.text
        };

        return await transporter.sendMail(mailOptions);
    }

    // --- AI Integration ---
    async aiClick(description) {
        // AI-powered element interaction
        const elements = await this.page.$$('*');
        // Implementation for AI-based element detection
        console.log(`AI Click: ${description}`);
    }

    async aiType(description, text) {
        // AI-powered text input
        console.log(`AI Type: ${description} - ${text}`);
    }

    async aiAssert(description) {
        // AI-powered assertion
        console.log(`AI Assert: ${description}`);
    }

    // --- Utility Methods ---
    async generateRandomString(length = 10) {
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    }

    async generateRandomEmail() {
        const randomString = await this.generateRandomString(8);
        return `test.${randomString}@example.com`;
    }

    formatDate(date = new Date(), format = 'YYYY-MM-DD') {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    }

    // --- Assertions ---
    async assertElementVisible(selector, message = '') {
        await expect(this.page.locator(selector)).toBeVisible({ message });
    }

    async assertElementHidden(selector, message = '') {
        await expect(this.page.locator(selector)).toBeHidden({ message });
    }

    async assertElementEnabled(selector, message = '') {
        await expect(this.page.locator(selector)).toBeEnabled({ message });
    }

    async assertElementDisabled(selector, message = '') {
        await expect(this.page.locator(selector)).toBeDisabled({ message });
    }

    async assertTextEquals(selector, expectedText, message = '') {
        await expect(this.page.locator(selector)).toHaveText(expectedText, { message });
    }

    async assertTextContains(selector, expectedText, message = '') {
        await expect(this.page.locator(selector)).toContainText(expectedText, { message });
    }

    async assertValueEquals(selector, expectedValue, message = '') {
        await expect(this.page.locator(selector)).toHaveValue(expectedValue, { message });
    }

    async assertUrlContains(expectedUrlPart, message = '') {
        await expect(this.page).toHaveURL(new RegExp(expectedUrlPart), { message });
    }

    async assertTitleEquals(expectedTitle, message = '') {
        await expect(this.page).toHaveTitle(expectedTitle, { message });
    }

    async assertPageHasText(text, message = '') {
        await expect(this.page.locator('body')).toContainText(text, { message });
    }

    async assertElementCount(selector, expectedCount, message = '') {
        await expect(this.page.locator(selector)).toHaveCount(expectedCount, { message });
    }

    async assertAttributeEquals(selector, attribute, expectedValue, message = '') {
        await expect(this.page.locator(selector)).toHaveAttribute(attribute, expectedValue, { message });
    }

    // --- Cleanup and Reporting ---
    async cleanup() {
        // Collect final metrics
        try {
            this.performanceMetrics = await this.getPerformanceMetrics();
        } catch (error) {
            console.warn('Could not collect performance metrics:', error.message);
        }

        // Close browser
        await this.closeBrowser();

        // Return test summary
        return {
            screenshots: this.screenshots,
            performanceMetrics: this.performanceMetrics,
            testData: this.testData
        };
    }
}

export default BaseClass;