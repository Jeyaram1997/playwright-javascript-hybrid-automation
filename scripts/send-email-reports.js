const EmailSender = require('../core/utils/EmailSender');
const AllureReportGenerator = require('./generate-allure-report');
const ExtentReportGenerator = require('./generate-extent-report');
const PerformanceReportGenerator = require('./generate-performance-report');
const fs = require('fs');
const path = require('path');

class ReportEmailSender {
    constructor() {
        this.emailSender = EmailSender;
        this.jiraLinks = this.loadJiraLinks();
    }

    loadJiraLinks() {
        const linksFile = path.join(__dirname, '..', 'reports', 'jira-links.json');
        if (fs.existsSync(linksFile)) {
            try {
                const content = fs.readFileSync(linksFile, 'utf8');
                return JSON.parse(content);
            } catch (error) {
                console.warn('Error reading Jira links file:', error);
                return [];
            }
        }
        return [];
    }

    async generateAllReports() {
        console.log('Generating all reports...');
        
        try {
            // Generate Allure report
            const allureGenerator = new AllureReportGenerator();
            await allureGenerator.generateReport();

            // Generate Extent report
            const extentGenerator = new ExtentReportGenerator();
            await extentGenerator.generateReport();

            // Generate Performance report
            const performanceGenerator = new PerformanceReportGenerator();
            await performanceGenerator.generateReport();

            console.log('All reports generated successfully');
            return true;
        } catch (error) {
            console.error('Error generating reports:', error);
            return false;
        }
    }

    async sendReports() {
        try {
            console.log('Preparing to send email with reports...');

            // Generate all reports first
            const reportsGenerated = await this.generateAllReports();
            if (!reportsGenerated) {
                throw new Error('Failed to generate one or more reports');
            }

            // Collect report attachments
            const attachments = this.collectReportAttachments();

            // Send email with all reports and Jira links
            await this.emailSender.sendEmailWithReports(this.jiraLinks, attachments);

            console.log('Reports sent successfully via email');
        } catch (error) {
            console.error('Error sending reports:', error);
            throw error;
        }
    }

    collectReportAttachments() {
        const attachments = [];
        
        // Allure report
        const allureReportPath = path.join(__dirname, '..', 'allure-report', 'index.html');
        if (fs.existsSync(allureReportPath)) {
            attachments.push({
                filename: 'allure-report.html',
                path: allureReportPath,
                contentType: 'text/html'
            });
        }

        // Extent report
        const extentReportPath = path.join(__dirname, '..', 'reports', 'extent-report', 'extent-report.html');
        if (fs.existsSync(extentReportPath)) {
            attachments.push({
                filename: 'extent-report.html',
                path: extentReportPath,
                contentType: 'text/html'
            });
        }

        // Performance report
        const performanceReportPath = path.join(__dirname, '..', 'reports', 'performance', 'performance-report.html');
        if (fs.existsSync(performanceReportPath)) {
            attachments.push({
                filename: 'performance-report.html',
                path: performanceReportPath,
                contentType: 'text/html'
            });
        }

        // CSV report
        const csvReportPath = path.join(__dirname, '..', 'reports', 'extent-report', 'test-results.csv');
        if (fs.existsSync(csvReportPath)) {
            attachments.push({
                filename: 'test-results.csv',
                path: csvReportPath,
                contentType: 'text/csv'
            });
        }

        // Screenshots (if any)
        const screenshotsDir = path.join(__dirname, '..', 'reports', 'screenshots');
        if (fs.existsSync(screenshotsDir)) {
            const screenshots = fs.readdirSync(screenshotsDir).filter(file => 
                file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
            );
            
            screenshots.slice(0, 5).forEach(screenshot => { // Limit to 5 screenshots
                attachments.push({
                    filename: screenshot,
                    path: path.join(screenshotsDir, screenshot),
                    contentType: 'image/png'
                });
            });
        }

        return attachments;
    }

    generateEmailContent() {
        const summary = this.generateTestSummary();
        
        return `
            <h1>🚀 Playwright Test Automation Report</h1>
            <p>Your comprehensive test execution report is ready!</p>
            
            <h2>📊 Test Summary</h2>
            <ul>
                <li><strong>Total Tests:</strong> ${summary.total}</li>
                <li><strong>✅ Passed:</strong> ${summary.passed}</li>
                <li><strong>❌ Failed:</strong> ${summary.failed}</li>
                <li><strong>⏭️ Skipped:</strong> ${summary.skipped}</li>
                <li><strong>⏱️ Duration:</strong> ${summary.duration}</li>
            </ul>

            <h2>📋 Reports Included</h2>
            <ul>
                <li><strong>Allure Report:</strong> Detailed test execution with step-by-step breakdown</li>
                <li><strong>Extent Report:</strong> Beautiful HTML report with charts and analytics</li>
                <li><strong>Performance Report:</strong> Lighthouse scores and Core Web Vitals</li>
                <li><strong>CSV Export:</strong> Test results in spreadsheet format</li>
            </ul>

            ${this.jiraLinks.length > 0 ? `
            <h2>🐛 Jira Issues Created</h2>
            <p>The following issues were automatically created for failed tests:</p>
            <ul>
                ${this.jiraLinks.map(link => `<li><a href="${link}">${link}</a></li>`).join('')}
            </ul>
            ` : ''}

            <h2>🔧 Framework Features</h2>
            <ul>
                <li>✅ UI Testing with Playwright</li>
                <li>✅ API Testing with REST endpoints</li>
                <li>✅ Mobile Testing with device emulation</li>
                <li>✅ Performance Testing with Lighthouse</li>
                <li>✅ Automatic Jira bug reporting</li>
                <li>✅ Multiple report formats (HTML, PDF, CSV)</li>
                <li>✅ AI-powered test enhancement</li>
                <li>✅ Data-driven testing with encrypted secrets</li>
            </ul>

            <hr>
            <p><em>This report was generated by the Playwright Hybrid Framework</em></p>
            <p><strong>Authored by Jeyaram K</strong></p>
        `;
    }

    generateTestSummary() {
        // In a real implementation, this would read from actual test results
        return {
            total: 12,
            passed: 9,
            failed: 2,
            skipped: 1,
            duration: '5m 23s'
        };
    }
}

// If this script is run directly
if (require.main === module) {
    const sender = new ReportEmailSender();
    sender.sendReports()
        .then(() => {
            console.log('Email sending process completed successfully');
        })
        .catch((error) => {
            console.error('Failed to send reports via email:', error);
            process.exit(1);
        });
}

module.exports = ReportEmailSender;
