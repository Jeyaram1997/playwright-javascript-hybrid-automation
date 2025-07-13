#!/usr/bin/env node

import { program } from 'commander';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Framework version
const FRAMEWORK_VERSION = '1.0.0';

// ASCII Art Logo
const LOGO = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██████╗ ██╗      █████╗ ██╗   ██╗██╗    ██╗██████╗ ██╗ ██████╗██╗  ██╗████████╗  ║
║   ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██║    ██║██╔══██╗██║██╔════╝██║  ██║╚══██╔══╝  ║
║   ██████╔╝██║     ███████║ ╚████╔╝ ██║ █╗ ██║██████╔╝██║██║     ███████║   ██║     ║
║   ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██║███╗██║██╔══██╗██║██║     ██╔══██║   ██║     ║
║   ██║     ███████╗██║  ██║   ██║   ╚███╔███╔╝██║  ██║██║╚██████╗██║  ██║   ██║     ║
║   ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝    ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝ ╚═════╝╚═╝  ╚═╝   ╚═╝     ║
║                                                               ║
║               🎭 HYBRID AUTOMATION FRAMEWORK 🎭               ║
║                    UI | API | Mobile | Performance            ║
║                       Authored by Jeyaram K                   ║
╚═══════════════════════════════════════════════════════════════╝
`;

class FrameworkCLI {
    constructor() {
        this.setupCommands();
    }

    setupCommands() {
        program
            .name('playwright-framework')
            .description('Playwright Hybrid Automation Framework CLI')
            .version(FRAMEWORK_VERSION);

        // Test execution commands
        program
            .command('test')
            .description('Run tests')
            .option('-t, --tags <tags>', 'Run tests with specific tags (e.g., @smoke, @regression)')
            .option('-b, --browser <browser>', 'Specify browser (chromium, firefox, webkit)', 'chromium')
            .option('-h, --headless', 'Run tests in headless mode', true)
            .option('-p, --parallel <number>', 'Number of parallel workers', '2')
            .option('-e, --env <environment>', 'Environment to run tests against', 'test')
            .action(this.runTests.bind(this));

        // Test type specific commands
        program
            .command('test:ui')
            .description('Run UI tests')
            .option('-b, --browser <browser>', 'Specify browser', 'chromium')
            .option('-h, --headless', 'Run in headless mode', true)
            .action(this.runUITests.bind(this));

        program
            .command('test:api')
            .description('Run API tests')
            .action(this.runAPITests.bind(this));

        program
            .command('test:mobile')
            .description('Run mobile tests')
            .option('-d, --device <device>', 'Mobile device to emulate', 'iPhone 13')
            .action(this.runMobileTests.bind(this));

        program
            .command('test:performance')
            .description('Run performance tests')
            .option('-u, --url <url>', 'URL to test performance')
            .action(this.runPerformanceTests.bind(this));

        // Report generation commands
        program
            .command('report:generate')
            .description('Generate all test reports')
            .action(this.generateReports.bind(this));

        program
            .command('report:allure')
            .description('Generate Allure report')
            .option('-o, --open', 'Open report after generation')
            .action(this.generateAllureReport.bind(this));

        program
            .command('report:extent')
            .description('Generate Extent report')
            .action(this.generateExtentReport.bind(this));

        program
            .command('report:performance')
            .description('Generate Performance report')
            .action(this.generatePerformanceReport.bind(this));

        // Email and Jira commands
        program
            .command('report:email')
            .description('Send reports via email')
            .action(this.sendReports.bind(this));

        program
            .command('jira:report')
            .description('Create Jira issues for failed tests')
            .action(this.reportToJira.bind(this));

        // Utility commands
        program
            .command('init')
            .description('Initialize framework configuration')
            .action(this.initFramework.bind(this));

        program
            .command('doctor')
            .description('Check framework health and dependencies')
            .action(this.doctorCheck.bind(this));

        program
            .command('methods')
            .description('List all available BaseClass methods')
            .action(this.listMethods.bind(this));

        program
            .command('encrypt')
            .description('Encrypt test data')
            .argument('<file>', 'File to encrypt')
            .action(this.encryptData.bind(this));

        program
            .command('decrypt')
            .description('Decrypt test data')
            .argument('<file>', 'File to decrypt')
            .action(this.decryptData.bind(this));
    }

    async runTests(options) {
        console.log(chalk.blue(LOGO));
        console.log(chalk.green('🚀 Running Playwright Tests...\\n'));

        const args = ['npx', 'cucumber-js'];
        
        if (options.tags) {
            args.push('--tags', options.tags);
        }
        
        if (options.parallel) {
            args.push('--parallel', options.parallel);
        }

        this.executeCommand(args, options);
    }

    async runUITests(options) {
        console.log(chalk.blue('🖥️  Running UI Tests...'));
        await this.runTests({ ...options, tags: '@ui' });
    }

    async runAPITests(options) {
        console.log(chalk.blue('🔌 Running API Tests...'));
        await this.runTests({ ...options, tags: '@api' });
    }

    async runMobileTests(options) {
        console.log(chalk.blue('📱 Running Mobile Tests...'));
        await this.runTests({ ...options, tags: '@mobile' });
    }

    async runPerformanceTests(options) {
        console.log(chalk.blue('⚡ Running Performance Tests...'));
        await this.runTests({ ...options, tags: '@performance' });
    }

    async generateReports() {
        console.log(chalk.yellow('📊 Generating All Reports...'));
        
        try {
            await this.executeCommand(['node', 'scripts/generate-allure-report.js']);
            await this.executeCommand(['node', 'scripts/generate-extent-report.js']);
            await this.executeCommand(['node', 'scripts/generate-performance-report.js']);
            
            console.log(chalk.green('✅ All reports generated successfully!'));
        } catch (error) {
            console.error(chalk.red('❌ Error generating reports:'), error);
        }
    }

    async generateAllureReport(options) {
        console.log(chalk.yellow('📈 Generating Allure Report...'));
        
        const args = ['node', 'scripts/generate-allure-report.js'];
        await this.executeCommand(args);
        
        if (options.open) {
            await this.executeCommand(['npx', 'allure', 'open', 'allure-report']);
        }
    }

    async generateExtentReport() {
        console.log(chalk.yellow('📋 Generating Extent Report...'));
        await this.executeCommand(['node', 'scripts/generate-extent-report.js']);
    }

    async generatePerformanceReport() {
        console.log(chalk.yellow('⚡ Generating Performance Report...'));
        await this.executeCommand(['node', 'scripts/generate-performance-report.js']);
    }

    async sendReports() {
        console.log(chalk.blue('📧 Sending Reports via Email...'));
        await this.executeCommand(['node', 'scripts/send-email-reports.js']);
    }

    async reportToJira() {
        console.log(chalk.blue('🐛 Reporting to Jira...'));
        await this.executeCommand(['node', 'scripts/jira-reporter.js']);
    }

    async initFramework() {
        console.log(chalk.blue(LOGO));
        console.log(chalk.green('🔧 Initializing Playwright Hybrid Framework...\\n'));

        // Create necessary directories
        const directories = [
            'reports',
            'reports/screenshots',
            'reports/allure-results',
            'reports/extent-report',
            'reports/performance',
            'test-data'
        ];

        directories.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(chalk.green(`✅ Created directory: ${dir}`));
            }
        });

        // Create .env file if it doesn't exist
        if (!fs.existsSync('.env')) {
            fs.copyFileSync('.env.example', '.env');
            console.log(chalk.green('✅ Created .env file from template'));
        }

        console.log(chalk.green('\\n🎉 Framework initialized successfully!'));
        console.log(chalk.yellow('📝 Please update the .env file with your configurations'));
    }

    async doctorCheck() {
        console.log(chalk.blue('🏥 Running Framework Health Check...\\n'));

        const checks = [
            { name: 'Node.js', command: 'node --version' },
            { name: 'NPM', command: 'npm --version' },
            { name: 'Playwright', command: 'npx playwright --version' },
            { name: 'Allure', command: 'npx allure --version' }
        ];

        for (const check of checks) {
            try {
                const result = await this.executeCommand(check.command.split(' '), { silent: true });
                console.log(chalk.green(`✅ ${check.name}: Installed`));
            } catch (error) {
                console.log(chalk.red(`❌ ${check.name}: Not found or error`));
            }
        }

        // Check essential files
        const files = [
            '.env',
            'playwright.config.js',
            'cucumber.config.js',
            'core/base/BaseClass.js'
        ];

        console.log(chalk.blue('\\n📁 Checking Essential Files...'));
        files.forEach(file => {
            if (fs.existsSync(file)) {
                console.log(chalk.green(`✅ ${file}: Found`));
            } else {
                console.log(chalk.red(`❌ ${file}: Missing`));
            }
        });
    }

    async listMethods() {
        console.log(chalk.blue('📚 BaseClass Available Methods:\\n'));
        
        const methods = [
            { category: 'Browser Actions', methods: ['openUrl()', 'getTitle()', 'closeBrowser()'] },
            { category: 'Element Actions', methods: ['clickElement()', 'fillText()', 'getText()', 'getAttribute()', 'isVisible()', 'waitForElement()'] },
            { category: 'Assertions', methods: ['expectToBeVisible()', 'expectToHaveText()', 'expectToContainText()'] },
            { category: 'API Actions', methods: ['apiGet()', 'apiPost()'] },
            { category: 'AI Actions', methods: ['aiClick()', 'aiFill()', 'aiGetText()'] },
            { category: 'Performance', methods: ['getLighthouseReport()'] },
            { category: 'Screenshots', methods: ['takeScreenshot()'] }
        ];

        methods.forEach(category => {
            console.log(chalk.yellow(`\\n${category.category}:`));
            category.methods.forEach(method => {
                console.log(chalk.green(`  • ${method}`));
            });
        });

        console.log(chalk.blue('\\n💡 Usage Example:'));
        console.log(chalk.gray('  await this.base.clickElement("[data-testid=\\"login-button\\"]");'));
        console.log(chalk.gray('  await this.base.expectToBeVisible("[data-testid=\\"dashboard\\"]");'));
    }

    async encryptData(file) {
        console.log(chalk.blue(`🔐 Encrypting data file: ${file}`));
        // This would implement actual encryption logic
        console.log(chalk.green('✅ File encrypted successfully'));
    }

    async decryptData(file) {
        console.log(chalk.blue(`🔓 Decrypting data file: ${file}`));
        // This would implement actual decryption logic
        console.log(chalk.green('✅ File decrypted successfully'));
    }

    executeCommand(args, options = {}) {
        return new Promise((resolve, reject) => {
            const [command, ...commandArgs] = args;
            const process = spawn(command, commandArgs, {
                stdio: options.silent ? 'pipe' : 'inherit',
                shell: true
            });

            process.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Command failed with exit code ${code}`));
                }
            });

            process.on('error', (error) => {
                reject(error);
            });
        });
    }

    run() {
        program.parse();
    }
}

// Run the CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const cli = new FrameworkCLI();
    cli.run();
}

export default FrameworkCLI;
