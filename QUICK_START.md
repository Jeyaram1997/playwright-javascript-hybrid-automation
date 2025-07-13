# 🎭 Playwright Hybrid Framework - Quick Start Guide

**Authored by Jeyaram K**

## 🚀 Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Install browsers
npm run install:browsers

# 3. Initialize framework
npm run init

# 4. Check health
npm run doctor
```

## 🎯 Running Tests

### Using NPM Scripts
```bash
# Run all tests
npm test

# Run specific test types
npm run test:ui
npm run test:api
npm run test:mobile
npm run test:perf

# Run by tags
npm run test:smoke
npm run test:regression
```

### Using CLI Tool
```bash
# Basic test execution
node cli.js test

# With specific options
node cli.js test --tags @smoke --browser firefox --headless
node cli.js test:ui --browser chromium
node cli.js test:api
node cli.js test:mobile --device "iPhone 13"
node cli.js test:performance --url "https://example.com"
```

## 📊 Generate Reports

```bash
# Generate all reports
node cli.js report:generate

# Individual reports
node cli.js report:allure --open
node cli.js report:extent
node cli.js report:performance

# Send reports via email
node cli.js report:email
```

## 🔧 Framework Features

### ✅ Test Types Supported
- **UI Testing**: Web application automation
- **API Testing**: REST API validation
- **Mobile Testing**: Mobile app simulation
- **Performance Testing**: Lighthouse integration

### ✅ Reporting & Analytics
- **Allure Reports**: Interactive HTML reports
- **Extent Reports**: Detailed test execution reports
- **Performance Reports**: Lighthouse scores and metrics
- **Multi-format Export**: HTML, PDF, Excel, CSV

### ✅ Data Management
- **Encrypted Storage**: Secure test data handling
- **Multiple Formats**: JSON, CSV, Excel, Properties
- **Environment Support**: Dev, Test, Staging, Prod

### ✅ Integration & Automation
- **Jira Integration**: Auto bug reporting
- **Email Notifications**: Automated report delivery
- **AI Testing**: Intelligent element interaction
- **CI/CD Ready**: Pipeline integration

## 📁 Project Structure

```
playwright-framework/
├── 📁 config/                 # Configuration files
├── 📁 core/
│   ├── 📁 base/               # BaseClass with reusable methods
│   └── 📁 utils/              # Utilities (DataReader, EmailSender, etc.)
├── 📁 features/               # Feature files (.feature)
├── 📁 step_definitions/       # Step definition files
├── 📁 scripts/               # Report generation scripts
├── 📁 test-data/             # Test data files
├── 📁 reports/               # Generated reports
└── 📄 cli.js                 # CLI tool
```

## 🎨 BaseClass Methods Reference

```bash
# List all available methods
npm run methods
# or
node cli.js methods
```

### Popular Methods:
```javascript
// Element interactions
await this.base.clickElement('[data-testid="login-btn"]');
await this.base.fillText('#username', 'testuser');
await this.base.getText('.welcome-message');

// AI-powered actions
await this.base.aiClick('Login button');
await this.base.aiFill('Username field', 'testuser');

// API testing
const response = await this.base.apiGet('/api/users');
await this.base.apiPost('/api/login', userData);

// Assertions
await this.base.expectToBeVisible('.dashboard');
await this.base.expectToHaveText('.title', 'Welcome');
```

## 🔐 Environment Configuration

Create `.env` file with your settings:
```env
# Test Environment
TEST_URL=https://your-test-app.com
API_BASE_URL=https://api.your-app.com

# Jira Configuration
JIRA_HOST=your-company.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Encryption
SECRET_KEY=your-secret-key-for-encryption
```

## 🏃‍♂️ Example Test Execution

```bash
# 1. Run smoke tests with screenshots
node cli.js test --tags "@smoke" --browser chromium

# 2. Generate and view reports
node cli.js report:allure --open

# 3. Send results to team
node cli.js report:email

# 4. Auto-report bugs to Jira
node cli.js jira:report
```

## 🛠️ Troubleshooting

### Common Issues:

**1. Browsers not installed**
```bash
npm run install:browsers
```

**2. Missing dependencies**
```bash
npm install
npm run doctor
```

**3. Permission issues (Windows)**
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📞 Support

For issues or questions:
- Check the main README.md for detailed documentation
- Run `npm run doctor` to diagnose issues
- Use `node cli.js methods` for BaseClass reference

---

**Happy Testing! 🎭✨**

*Framework developed by Jeyaram K*
