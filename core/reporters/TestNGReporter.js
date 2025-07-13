const { Reporter } = require('@playwright/test/reporter');
const xmlbuilder = require('xmlbuilder');
const fs = require('fs');
const path = require('path');

class TestNGReporter extends Reporter {
    constructor(options) {
        super(options);
        this.outputFile = this.options.outputFile || 'reports/testng/testng-results.xml';
        this.tests = [];
    }

    onTestEnd(test, result) {
        this.tests.push({ test, result });
    }

    onEnd(result) {
        const root = xmlbuilder.create('testng-results', { encoding: 'UTF-8' });
        let passed = 0;
        let failed = 0;
        let skipped = 0;

        const suiteNode = root.ele('suite', { name: 'Playwright Test Suite' });

        for (const { test, result: testResult } of this.tests) {
            if (testResult.status === 'passed') passed++;
            if (testResult.status === 'failed') failed++;
            if (testResult.status === 'skipped') skipped++;

            const testNode = suiteNode.ele('test', { name: test.title });
            const classNode = testNode.ele('class', { name: path.relative(process.cwd(), test.location.file) });
            const testMethodNode = classNode.ele('test-method', {
                'status': testResult.status.toUpperCase(),
                'name': test.title,
                'duration-ms': testResult.duration,
            });

            if (testResult.status === 'failed') {
                testMethodNode.ele('exception', { class: 'java.lang.AssertionError' }) // Simplified
                    .ele('message')
                    .dat(testResult.error.message || '');
                testMethodNode.ele('full-stacktrace')
                    .dat(testResult.error.stack || '');
            }
        }
        
        const total = this.tests.length;
        root.att('total', total);
        root.att('passed', passed);
        root.att('failed', failed);
        root.att('skipped', skipped);


        const reportPath = path.dirname(this.outputFile);
        if (!fs.existsSync(reportPath)) {
            fs.mkdirSync(reportPath, { recursive: true });
        }
        fs.writeFileSync(this.outputFile, root.end({ pretty: true }));
        console.log(`TestNG report generated at ${this.outputFile}`);
    }
}

module.exports = TestNGReporter;
