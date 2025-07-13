const JiraReporter = require('../core/utils/JiraReporter');
const fs = require('fs');
const path = require('path');

class JiraReportingScript {
    constructor() {
        this.jiraReporter = JiraReporter;
        this.jiraLinksFile = path.join(__dirname, '..', 'reports', 'jira-links.json');
        this.jiraLinks = [];
    }

    async reportFailedTests(testResults = []) {
        console.log('Processing failed tests for Jira reporting...');
        
        try {
            const failedTests = testResults.filter(test => test.status === 'failed');
            
            if (failedTests.length === 0) {
                console.log('No failed tests found. No Jira issues will be created.');
                return [];
            }

            console.log(`Found ${failedTests.length} failed test(s). Creating Jira issues...`);

            for (const test of failedTests) {
                const jiraLink = await this.createJiraIssue(test);
                if (jiraLink) {
                    this.jiraLinks.push(jiraLink);
                }
            }

            // Save Jira links to file for email reporting
            await this.saveJiraLinks();

            console.log(`Successfully created ${this.jiraLinks.length} Jira issue(s)`);
            return this.jiraLinks;

        } catch (error) {
            console.error('Error in Jira reporting process:', error);
            throw error;
        }
    }

    async createJiraIssue(testResult) {
        try {
            const summary = `[AUTOMATED] Test Failure: ${testResult.name || 'Unknown Test'}`;
            const description = this.generateIssueDescription(testResult);
            const screenshotPath = testResult.screenshot || null;

            const jiraLink = await this.jiraReporter.createIssue(summary, description, screenshotPath);
            
            if (jiraLink) {
                console.log(`✅ Created Jira issue: ${jiraLink}`);
                return jiraLink;
            } else {
                console.log(`❌ Failed to create Jira issue for test: ${testResult.name}`);
                return null;
            }
        } catch (error) {
            console.error(`Error creating Jira issue for test ${testResult.name}:`, error);
            return null;
        }
    }

    generateIssueDescription(testResult) {
        const timestamp = new Date().toISOString();
        
        return `
*Test Automation Failure Report*

*Test Details:*
• Test Name: ${testResult.name || 'Unknown'}
• Feature: ${testResult.feature || 'Unknown'}
• Test Type: ${testResult.type || 'UI'}
• Browser: ${testResult.browser || 'Chromium'}
• Environment: ${process.env.NODE_ENV || 'Test'}
• Timestamp: ${timestamp}

*Failure Information:*
• Status: ${testResult.status}
• Duration: ${testResult.duration || 'Unknown'}
• Error Message: ${testResult.error || 'No error message available'}

*Steps to Reproduce:*
${this.generateStepsToReproduce(testResult)}

*Expected Result:*
Test should pass without errors

*Actual Result:*
Test failed with the error mentioned above

*Additional Information:*
• Framework: Playwright Hybrid Framework
• Author: Jeyaram K
• Auto-generated: Yes
• Screenshot: ${testResult.screenshot ? 'Attached' : 'Not available'}

*Environment Details:*
• OS: ${process.platform}
• Node.js: ${process.version}
• Playwright Version: Latest

---
This issue was automatically created by the Playwright Hybrid Framework.
        `.trim();
    }

    generateStepsToReproduce(testResult) {
        // Generate basic steps based on test type
        if (testResult.type === 'API') {
            return `
1. Send ${testResult.method || 'GET'} request to ${testResult.endpoint || 'API endpoint'}
2. Verify response status and data
3. Check for expected response format`;
        } else if (testResult.type === 'Mobile') {
            return `
1. Open application on mobile device (${testResult.device || 'Mobile Device'})
2. Navigate to the test page
3. Perform the test actions
4. Verify expected behavior`;
        } else if (testResult.type === 'Performance') {
            return `
1. Navigate to the target page
2. Run performance analysis
3. Check Lighthouse scores
4. Verify Core Web Vitals`;
        } else {
            return `
1. Navigate to the application
2. Perform the test steps as defined in: ${testResult.feature || 'Test Suite'}
3. Verify expected behavior
4. Check for any console errors`;
        }
    }

    async saveJiraLinks() {
        try {
            const reportsDir = path.dirname(this.jiraLinksFile);
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            fs.writeFileSync(this.jiraLinksFile, JSON.stringify(this.jiraLinks, null, 2));
            console.log(`Jira links saved to: ${this.jiraLinksFile}`);
        } catch (error) {
            console.error('Error saving Jira links:', error);
        }
    }

    async loadExistingJiraLinks() {
        try {
            if (fs.existsSync(this.jiraLinksFile)) {
                const content = fs.readFileSync(this.jiraLinksFile, 'utf8');
                this.jiraLinks = JSON.parse(content);
                console.log(`Loaded ${this.jiraLinks.length} existing Jira link(s)`);
            }
        } catch (error) {
            console.warn('Error loading existing Jira links:', error);
            this.jiraLinks = [];
        }
    }

    async processTestResultsFile(filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`Test results file not found: ${filePath}`);
            }

            const content = fs.readFileSync(filePath, 'utf8');
            const testResults = JSON.parse(content);
            
            return await this.reportFailedTests(testResults);
        } catch (error) {
            console.error('Error processing test results file:', error);
            throw error;
        }
    }
}

// If this script is run directly
if (require.main === module) {
    const jiraScript = new JiraReportingScript();
    
    // Sample failed test data for demonstration
    const sampleFailedTests = [
        {
            name: 'Login functionality test',
            feature: 'Authentication',
            type: 'UI',
            status: 'failed',
            duration: '3.2s',
            browser: 'Chromium',
            error: 'Element [data-testid="login-button"] not found',
            screenshot: 'reports/screenshots/login_test_failure.png'
        },
        {
            name: 'API endpoint validation',
            feature: 'API Testing',
            type: 'API',
            status: 'failed',
            duration: '1.5s',
            method: 'POST',
            endpoint: '/api/users',
            error: 'Expected status 201, received 500'
        }
    ];

    jiraScript.loadExistingJiraLinks()
        .then(() => jiraScript.reportFailedTests(sampleFailedTests))
        .then((jiraLinks) => {
            console.log('Jira reporting completed successfully');
            if (jiraLinks.length > 0) {
                console.log('Created Jira issues:');
                jiraLinks.forEach(link => console.log(`- ${link}`));
            }
        })
        .catch((error) => {
            console.error('Jira reporting failed:', error);
            process.exit(1);
        });
}

module.exports = JiraReportingScript;
