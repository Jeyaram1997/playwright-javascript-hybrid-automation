const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class AllureReportGenerator {
    constructor() {
        this.allureResultsDir = 'allure-results';
        this.allureReportDir = 'allure-report';
    }

    async generateReport() {
        return new Promise((resolve, reject) => {
            console.log('Generating Allure report...');
            
            // Ensure allure-results directory exists
            if (!fs.existsSync(this.allureResultsDir)) {
                fs.mkdirSync(this.allureResultsDir, { recursive: true });
                console.log('Created allure-results directory');
            }

            // Generate the report
            const allureProcess = spawn('npx', ['allure', 'generate', this.allureResultsDir, '--clean', '-o', this.allureReportDir], {
                stdio: 'inherit',
                shell: true
            });

            allureProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('Allure report generated successfully');
                    console.log(`Report available at: ${path.resolve(this.allureReportDir)}/index.html`);
                    resolve();
                } else {
                    console.error(`Allure report generation failed with exit code ${code}`);
                    reject(new Error(`Allure generation failed: ${code}`));
                }
            });

            allureProcess.on('error', (error) => {
                console.error('Error generating Allure report:', error);
                reject(error);
            });
        });
    }

    async openReport() {
        return new Promise((resolve, reject) => {
            console.log('Opening Allure report...');
            
            const allureProcess = spawn('npx', ['allure', 'open', this.allureReportDir], {
                stdio: 'inherit',
                shell: true
            });

            allureProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('Allure report opened successfully');
                    resolve();
                } else {
                    console.error(`Failed to open Allure report with exit code ${code}`);
                    reject(new Error(`Allure open failed: ${code}`));
                }
            });

            allureProcess.on('error', (error) => {
                console.error('Error opening Allure report:', error);
                reject(error);
            });
        });
    }
}

// If this script is run directly
if (require.main === module) {
    const generator = new AllureReportGenerator();
    generator.generateReport()
        .then(() => {
            console.log('Allure report generation completed');
        })
        .catch((error) => {
            console.error('Failed to generate Allure report:', error);
            process.exit(1);
        });
}

module.exports = AllureReportGenerator;
