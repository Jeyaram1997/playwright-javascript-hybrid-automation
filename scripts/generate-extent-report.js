const fs = require('fs');
const path = require('path');
const moment = require('moment');

class ExtentReportGenerator {
    constructor() {
        this.reportDir = 'reports/extent-report';
        this.templatePath = path.join(__dirname, 'templates', 'extent-template.html');
    }

    async generateReport(testResults = []) {
        try {
            console.log('Generating Extent report...');
            
            // Ensure report directory exists
            if (!fs.existsSync(this.reportDir)) {
                fs.mkdirSync(this.reportDir, { recursive: true });
            }

            const reportData = this.processTestResults(testResults);
            const htmlContent = this.generateHtmlReport(reportData);
            
            const reportPath = path.join(this.reportDir, 'extent-report.html');
            fs.writeFileSync(reportPath, htmlContent);
            
            console.log(`Extent report generated: ${path.resolve(reportPath)}`);
            return reportPath;
        } catch (error) {
            console.error('Error generating Extent report:', error);
            throw error;
        }
    }

    processTestResults(testResults) {
        const summary = {
            total: testResults.length,
            passed: testResults.filter(test => test.status === 'passed').length,
            failed: testResults.filter(test => test.status === 'failed').length,
            skipped: testResults.filter(test => test.status === 'skipped').length,
            startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            duration: '00:05:23' // This would be calculated from actual test execution
        };

        return {
            summary,
            tests: testResults
        };
    }

    generateHtmlReport(data) {
        const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playwright Test Automation Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .summary {
            display: flex;
            justify-content: space-around;
            padding: 30px;
            background: #f8f9fa;
        }
        .summary-item {
            text-align: center;
            padding: 20px;
            border-radius: 8px;
            background: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            min-width: 120px;
        }
        .summary-item h3 {
            margin: 0;
            font-size: 2em;
            color: #333;
        }
        .summary-item p {
            margin: 5px 0 0 0;
            color: #666;
            font-weight: bold;
        }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #ffc107; }
        .total { color: #007bff; }
        .test-results {
            padding: 30px;
        }
        .test-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 15px;
            overflow: hidden;
        }
        .test-header {
            padding: 15px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #ddd;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .test-header:hover {
            background: #e9ecef;
        }
        .test-status {
            padding: 5px 15px;
            border-radius: 20px;
            color: white;
            font-weight: bold;
            font-size: 0.8em;
        }
        .status-passed { background: #28a745; }
        .status-failed { background: #dc3545; }
        .status-skipped { background: #ffc107; color: #333; }
        .test-details {
            padding: 20px;
            background: white;
            display: none;
        }
        .test-details.show {
            display: block;
        }
        .footer {
            background: #343a40;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .charts {
            padding: 30px;
            text-align: center;
        }
        .chart-container {
            display: inline-block;
            margin: 20px;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Playwright Test Automation Report</h1>
            <p>Hybrid Framework - UI, API, Mobile & Performance Testing</p>
            <p>Generated on ${data.summary.startTime} | Duration: ${data.summary.duration}</p>
        </div>
        
        <div class="summary">
            <div class="summary-item">
                <h3 class="total">${data.summary.total}</h3>
                <p>Total Tests</p>
            </div>
            <div class="summary-item">
                <h3 class="passed">${data.summary.passed}</h3>
                <p>Passed</p>
            </div>
            <div class="summary-item">
                <h3 class="failed">${data.summary.failed}</h3>
                <p>Failed</p>
            </div>
            <div class="summary-item">
                <h3 class="skipped">${data.summary.skipped}</h3>
                <p>Skipped</p>
            </div>
        </div>

        <div class="charts">
            <div class="chart-container">
                <canvas id="pieChart" width="300" height="300"></canvas>
            </div>
        </div>

        <div class="test-results">
            <h2>Test Results</h2>
            ${this.generateTestItems(data.tests)}
        </div>

        <div class="footer">
            <p>&copy; 2025 Playwright Hybrid Framework | Authored by Jeyaram K</p>
        </div>
    </div>

    <script>
        // Toggle test details
        document.querySelectorAll('.test-header').forEach(header => {
            header.addEventListener('click', () => {
                const details = header.nextElementSibling;
                details.classList.toggle('show');
            });
        });

        // Pie chart
        const ctx = document.getElementById('pieChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Passed', 'Failed', 'Skipped'],
                datasets: [{
                    data: [${data.summary.passed}, ${data.summary.failed}, ${data.summary.skipped}],
                    backgroundColor: ['#28a745', '#dc3545', '#ffc107']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Test Results Distribution'
                    }
                }
            }
        });
    </script>
</body>
</html>`;
        return template;
    }

    generateTestItems(tests) {
        if (!tests || tests.length === 0) {
            return '<p>No test results available</p>';
        }

        return tests.map(test => `
            <div class="test-item">
                <div class="test-header">
                    <span>${test.name || 'Test Name'}</span>
                    <span class="test-status status-${test.status || 'passed'}">${(test.status || 'passed').toUpperCase()}</span>
                </div>
                <div class="test-details">
                    <p><strong>Duration:</strong> ${test.duration || '0ms'}</p>
                    <p><strong>Feature:</strong> ${test.feature || 'Unknown'}</p>
                    ${test.error ? `<p><strong>Error:</strong> <code>${test.error}</code></p>` : ''}
                    ${test.screenshot ? `<p><strong>Screenshot:</strong> <a href="${test.screenshot}" target="_blank">View</a></p>` : ''}
                </div>
            </div>
        `).join('');
    }

    async generateCsvReport(testResults, filename = 'test-results.csv') {
        const csvPath = path.join(this.reportDir, filename);
        const headers = 'Test Name,Status,Duration,Feature,Error\n';
        const rows = testResults.map(test => 
            `"${test.name || ''}","${test.status || ''}","${test.duration || ''}","${test.feature || ''}","${test.error || ''}"`
        ).join('\n');
        
        fs.writeFileSync(csvPath, headers + rows);
        console.log(`CSV report generated: ${path.resolve(csvPath)}`);
        return csvPath;
    }
}

// If this script is run directly
if (require.main === module) {
    const generator = new ExtentReportGenerator();
    
    // Sample test data for demonstration
    const sampleResults = [
        { name: 'Login Test', status: 'passed', duration: '2.3s', feature: 'Authentication' },
        { name: 'API Test', status: 'passed', duration: '1.1s', feature: 'API' },
        { name: 'Mobile Test', status: 'failed', duration: '3.2s', feature: 'Mobile', error: 'Element not found' },
        { name: 'Performance Test', status: 'passed', duration: '5.7s', feature: 'Performance' }
    ];
    
    generator.generateReport(sampleResults)
        .then(() => {
            console.log('Extent report generation completed');
            return generator.generateCsvReport(sampleResults);
        })
        .then(() => {
            console.log('CSV report generation completed');
        })
        .catch((error) => {
            console.error('Failed to generate reports:', error);
            process.exit(1);
        });
}

module.exports = ExtentReportGenerator;
