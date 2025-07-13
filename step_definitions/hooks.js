const { After, AfterAll, Status } = require('@cucumber/cucumber');
const BaseClass = require('../../core/base/BaseClass');
const JiraReporter = require('../../core/utils/JiraReporter');
const EmailSender = require('../../core/utils/EmailSender');

let jiraIssueLinks = [];

After(async function (scenario) {
    if (scenario.result.status === Status.FAILED) {
        const screenshotPath = `reports/screenshots/${scenario.pickle.name.replace(/ /g, "_")}.png`;
        await this.base.takeScreenshot(screenshotPath);
        
        const summary = `Test Failed: ${scenario.pickle.name}`;
        const description = `Test failed with the following error: \n${scenario.result.message}`;
        const jiraLink = await JiraReporter.createIssue(summary, description, screenshotPath);
        if(jiraLink) {
            jiraIssueLinks.push(jiraLink);
        }
    }
});

AfterAll(async function () {
    // This is a placeholder for where you might close browser instances if you manage them globally
    // For playwright-test, browser management is typically handled by the test runner.
    
    // Send email with reports
    await EmailSender.sendEmailWithReports(jiraIssueLinks);
});
