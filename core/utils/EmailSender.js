/**
 * Email Sender utility for the framework
 * @author Jeyaram K
 * @version 1.0.0
 */

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

class EmailSender {
    constructor() {
        // Create transporter
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    /**
     * Sends email with test reports
     * @param {object} options - Email options
     * @returns {Promise<boolean>} - Success status
     */
    async sendEmail(options) {
        try {
            const { subject, body, attachments = [], recipients = process.env.EMAIL_TO.split(',') } = options;
            
            // Prepare attachments
            const emailAttachments = await Promise.all(attachments.map(async (attachment) => {
                if (typeof attachment === 'string') {
                    // If attachment is just a path string
                    const filename = path.basename(attachment);
                    return {
                        filename,
                        path: attachment
                    };
                } else {
                    // If attachment is an object with path property
                    const filename = attachment.filename || path.basename(attachment.path);
                    return {
                        filename,
                        path: attachment.path,
                        contentType: attachment.contentType
                    };
                }
            }));
            
            // Send email
            const info = await this.transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: recipients.join(','),
                subject: subject,
                html: body,
                attachments: emailAttachments
            });
            
            console.log(`Email sent: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error(`Failed to send email: ${error.message}`);
            return false;
        }
    }

    /**
     * Sends test reports email
     * @param {object} testResults - Test results data
     * @returns {Promise<boolean>} - Success status
     */
    async sendTestReportsEmail(testResults) {
        const { passed, failed, skipped, total, duration, reportPaths = {}, jiraIssues = [] } = testResults;
        
        // Format duration nicely
        const formatDuration = (ms) => {
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        };
        
        // Create HTML content for email
        const htmlBody = `
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              .summary { background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
              .passed { color: green; }
              .failed { color: red; }
              .skipped { color: orange; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Test Automation Report</h1>
            <div class="summary">
              <h2>Execution Summary</h2>
              <p><strong>Total Tests:</strong> ${total}</p>
              <p><strong>Passed:</strong> <span class="passed">${passed}</span></p>
              <p><strong>Failed:</strong> <span class="failed">${failed}</span></p>
              <p><strong>Skipped:</strong> <span class="skipped">${skipped}</span></p>
              <p><strong>Duration:</strong> ${formatDuration(duration)}</p>
            </div>
            
            ${jiraIssues.length > 0 ? `
            <h2>Jira Issues Created</h2>
            <table>
              <tr>
                <th>Issue Key</th>
                <th>Summary</th>
                <th>Link</th>
              </tr>
              ${jiraIssues.map(issue => `
              <tr>
                <td>${issue.key}</td>
                <td>${issue.summary}</td>
                <td><a href="${this.jiraBaseUrl}/browse/${issue.key}">View Issue</a></td>
              </tr>
              `).join('')}
            </table>
            ` : ''}
            
            <p>Please find attached reports for more details.</p>
          </body>
          </html>
        `;
        
        // Prepare attachments
        const attachments = [];
        
        if (reportPaths.allure) {
          attachments.push({
            filename: 'allure-report.zip',
            path: reportPaths.allure
          });
        }
        
        if (reportPaths.extent) {
          attachments.push({
            filename: 'extent-report.html',
            path: reportPaths.extent
          });
        }
        
        if (reportPaths.performance) {
          attachments.push({
            filename: 'performance-report.html',
            path: reportPaths.performance
          });
        }
        
        if (reportPaths.excel) {
          attachments.push({
            filename: 'test-results.xlsx',
            path: reportPaths.excel
          });
        }
        
        if (reportPaths.pdf) {
          attachments.push({
            filename: 'test-report.pdf',
            path: reportPaths.pdf
          });
        }
        
        // Send email with attachments
        return await this.sendEmail({
          subject: `Test Automation Report - ${new Date().toLocaleDateString()}`,
          body: htmlBody,
          attachments
        });
      }

      /**
       * Sends email with reports and Jira links
       * @param {array} jiraLinks - Array of Jira issue links
       * @returns {Promise<void>}
       */
      async sendEmailWithReports(jiraLinks = []) {
        const allureReportPath = path.join(__dirname, '..', '..', 'allure-report', 'index.html');
        const extentReportPath = path.join(__dirname, '..', '..', 'reports', 'extent-report', 'report.html');
        const lighthouseReportPath = path.join(__dirname, '..', '..', 'reports', 'lighthouse', 'lighthouse-report.html'); // Assuming this is the path

        let attachments = [];
        if (fs.existsSync(allureReportPath)) {
            attachments.push({
                filename: 'allure-report.html',
                path: allureReportPath,
            });
        }
        if (fs.existsSync(extentReportPath)) {
            attachments.push({
                filename: 'extent-report.html',
                path: extentReportPath,
            });
        }
        if (fs.existsSync(lighthouseReportPath)) {
            attachments.push({
                filename: 'lighthouse-report.html',
                path: lighthouseReportPath,
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            subject: 'Playwright Test Automation Report',
            html: `
                <h1>Test Automation Execution Report</h1>
                <p>Please find the attached reports.</p>
                ${jiraLinks.length > 0 ? '<h2>Jira Issues Created:</h2>' : ''}
                <ul>
                    ${jiraLinks.map(link => `<li><a href="${link}">${link}</a></li>`).join('')}
                </ul>
            `,
            attachments: attachments,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully.');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}

module.exports = new EmailSender();