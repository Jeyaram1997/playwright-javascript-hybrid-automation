/**
 * Test Data Constants
 * Centralized test data management for the automation framework
 * @author Automation Team
 * @version 1.0.0
 */

export class TestData {
    // User Data
    static USERS = {
        VALID_USER: {
            username: 'valid_user@example.com',
            password: 'ValidPassword123!',
            firstName: 'John',
            lastName: 'Doe'
        },
        INVALID_USER: {
            username: 'invalid_user@example.com',
            password: 'InvalidPassword'
        },
        ADMIN_USER: {
            username: 'admin@example.com',
            password: 'AdminPassword123!',
            role: 'administrator'
        },
        GUEST_USER: {
            username: 'guest@example.com',
            password: 'GuestPassword123!',
            role: 'guest'
        }
    };

    // API Test Data
    static API = {
        ENDPOINTS: {
            LOGIN: '/api/v1/auth/login',
            LOGOUT: '/api/v1/auth/logout',
            USERS: '/api/v1/users',
            PRODUCTS: '/api/v1/products',
            ORDERS: '/api/v1/orders'
        },
        HEADERS: {
            CONTENT_TYPE: 'application/json',
            ACCEPT: 'application/json',
            USER_AGENT: 'Playwright-Automation-Framework'
        },
        STATUS_CODES: {
            SUCCESS: 200,
            CREATED: 201,
            BAD_REQUEST: 400,
            UNAUTHORIZED: 401,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            INTERNAL_ERROR: 500
        }
    };

    // Mobile Test Data
    static MOBILE = {
        DEVICES: {
            IPHONE_12: {
                name: 'iPhone 12',
                viewport: { width: 390, height: 844 },
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
            },
            PIXEL_5: {
                name: 'Pixel 5',
                viewport: { width: 393, height: 851 },
                userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36'
            },
            IPAD: {
                name: 'iPad',
                viewport: { width: 768, height: 1024 },
                userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
            }
        }
    };

    // Performance Test Data
    static PERFORMANCE = {
        THRESHOLDS: {
            PAGE_LOAD_TIME: 3000,
            API_RESPONSE_TIME: 1000,
            LIGHTHOUSE_PERFORMANCE: 80,
            LIGHTHOUSE_ACCESSIBILITY: 90,
            LIGHTHOUSE_BEST_PRACTICES: 85,
            LIGHTHOUSE_SEO: 80
        },
        METRICS: {
            FIRST_CONTENTFUL_PAINT: 1500,
            LARGEST_CONTENTFUL_PAINT: 2500,
            CUMULATIVE_LAYOUT_SHIFT: 0.1,
            FIRST_INPUT_DELAY: 100
        }
    };

    // Test Environment Data
    static ENVIRONMENTS = {
        DEV: 'dev',
        TEST: 'test',
        STAGING: 'staging',
        PROD: 'prod'
    };

    // File Paths
    static PATHS = {
        TEST_DATA: './test-data',
        REPORTS: './reports',
        SCREENSHOTS: './reports/screenshots',
        VIDEOS: './reports/videos',
        DOWNLOADS: './downloads',
        UPLOADS: './test-data/files'
    };

    // Browser Configurations
    static BROWSERS = {
        CHROMIUM: 'chromium',
        FIREFOX: 'firefox',
        WEBKIT: 'webkit'
    };

    // Timeout Values
    static TIMEOUTS = {
        SHORT: 5000,
        MEDIUM: 10000,
        LONG: 30000,
        VERY_LONG: 60000
    };
}

export default TestData;
