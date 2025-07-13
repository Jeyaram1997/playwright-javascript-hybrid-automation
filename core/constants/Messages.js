/**
 * Messages Constants
 * Centralized message management for test validation and reporting
 * @author Automation Team
 * @version 1.0.0
 */

export class Messages {
    // Success Messages
    static SUCCESS = {
        LOGIN_SUCCESS: 'Successfully logged in',
        LOGOUT_SUCCESS: 'Successfully logged out',
        REGISTRATION_SUCCESS: 'Account created successfully',
        PASSWORD_CHANGED: 'Password changed successfully',
        PROFILE_UPDATED: 'Profile updated successfully',
        DATA_SAVED: 'Data saved successfully',
        EMAIL_SENT: 'Email sent successfully',
        UPLOAD_SUCCESS: 'File uploaded successfully',
        DELETE_SUCCESS: 'Item deleted successfully',
        PAYMENT_SUCCESS: 'Payment processed successfully',
        ORDER_PLACED: 'Order placed successfully',
        SUBSCRIPTION_ACTIVE: 'Subscription activated successfully'
    };

    // Error Messages
    static ERROR = {
        LOGIN_FAILED: 'Invalid username or password',
        NETWORK_ERROR: 'Network connection error',
        SERVER_ERROR: 'Internal server error',
        UNAUTHORIZED: 'Unauthorized access',
        FORBIDDEN: 'Access forbidden',
        NOT_FOUND: 'Page not found',
        VALIDATION_ERROR: 'Please check your input',
        EMAIL_INVALID: 'Please enter a valid email address',
        PASSWORD_WEAK: 'Password must be at least 8 characters',
        REQUIRED_FIELD: 'This field is required',
        FILE_TOO_LARGE: 'File size exceeds limit',
        UNSUPPORTED_FORMAT: 'Unsupported file format',
        PAYMENT_FAILED: 'Payment processing failed',
        EXPIRED_SESSION: 'Session has expired',
        ACCOUNT_LOCKED: 'Account has been locked'
    };

    // Warning Messages
    static WARNING = {
        UNSAVED_CHANGES: 'You have unsaved changes',
        LOW_STOCK: 'Low stock available',
        EXPIRING_SOON: 'Subscription expiring soon',
        MAINTENANCE_MODE: 'System maintenance scheduled',
        BROWSER_COMPATIBILITY: 'Browser not fully supported',
        SLOW_CONNECTION: 'Slow network connection detected',
        COOKIES_DISABLED: 'Please enable cookies',
        JAVASCRIPT_DISABLED: 'JavaScript must be enabled',
        MOBILE_EXPERIENCE: 'Mobile app available for better experience'
    };

    // Information Messages
    static INFO = {
        LOADING: 'Loading...',
        PROCESSING: 'Processing your request...',
        SAVING: 'Saving changes...',
        UPLOADING: 'Uploading file...',
        SENDING: 'Sending email...',
        CALCULATING: 'Calculating results...',
        SEARCHING: 'Searching...',
        CONNECTING: 'Connecting to server...',
        VERIFYING: 'Verifying information...',
        UPDATING: 'Updating data...',
        REDIRECTING: 'Redirecting...',
        PLEASE_WAIT: 'Please wait...'
    };

    // Validation Messages
    static VALIDATION = {
        EMAIL_REQUIRED: 'Email address is required',
        PASSWORD_REQUIRED: 'Password is required',
        NAME_REQUIRED: 'Name is required',
        PHONE_REQUIRED: 'Phone number is required',
        ADDRESS_REQUIRED: 'Address is required',
        TERMS_REQUIRED: 'Please accept terms and conditions',
        EMAIL_FORMAT: 'Please enter a valid email format',
        PHONE_FORMAT: 'Please enter a valid phone number',
        PASSWORD_LENGTH: 'Password must be at least 8 characters long',
        PASSWORD_COMPLEXITY: 'Password must contain uppercase, lowercase, and numbers',
        PASSWORDS_MATCH: 'Passwords do not match',
        AGE_VERIFICATION: 'You must be 18 or older',
        NUMERIC_ONLY: 'Please enter numbers only',
        ALPHA_ONLY: 'Please enter letters only',
        DATE_FORMAT: 'Please enter a valid date (MM/DD/YYYY)'
    };

    // Test Automation Messages
    static TEST = {
        TEST_STARTED: 'Test execution started',
        TEST_COMPLETED: 'Test execution completed',
        TEST_PASSED: 'Test passed successfully',
        TEST_FAILED: 'Test failed',
        TEST_SKIPPED: 'Test skipped',
        ELEMENT_FOUND: 'Element found successfully',
        ELEMENT_NOT_FOUND: 'Element not found',
        PAGE_LOADED: 'Page loaded successfully',
        ACTION_PERFORMED: 'Action performed successfully',
        ASSERTION_PASSED: 'Assertion passed',
        ASSERTION_FAILED: 'Assertion failed',
        SCREENSHOT_TAKEN: 'Screenshot captured',
        VIDEO_RECORDED: 'Video recording completed',
        REPORT_GENERATED: 'Test report generated'
    };

    // API Messages
    static API = {
        REQUEST_SENT: 'API request sent',
        RESPONSE_RECEIVED: 'API response received',
        AUTHENTICATION_SUCCESS: 'API authentication successful',
        AUTHENTICATION_FAILED: 'API authentication failed',
        RATE_LIMIT_EXCEEDED: 'API rate limit exceeded',
        INVALID_ENDPOINT: 'Invalid API endpoint',
        MALFORMED_REQUEST: 'Malformed API request',
        TIMEOUT_ERROR: 'API request timeout',
        CONNECTION_REFUSED: 'API connection refused',
        INVALID_RESPONSE: 'Invalid API response format'
    };

    // Mobile App Messages
    static MOBILE = {
        APP_LAUNCHED: 'Mobile app launched successfully',
        APP_CRASHED: 'Mobile app crashed',
        PERMISSION_GRANTED: 'Permission granted',
        PERMISSION_DENIED: 'Permission denied',
        NETWORK_UNAVAILABLE: 'Network unavailable',
        GPS_DISABLED: 'GPS is disabled',
        CAMERA_UNAVAILABLE: 'Camera not available',
        STORAGE_FULL: 'Device storage full',
        BATTERY_LOW: 'Low battery warning',
        UPDATE_AVAILABLE: 'App update available'
    };

    // Performance Messages
    static PERFORMANCE = {
        PERFORMANCE_GOOD: 'Performance within acceptable limits',
        PERFORMANCE_POOR: 'Performance below threshold',
        LOAD_TIME_SLOW: 'Page load time exceeds threshold',
        MEMORY_HIGH: 'High memory usage detected',
        CPU_HIGH: 'High CPU usage detected',
        NETWORK_SLOW: 'Slow network performance',
        LIGHTHOUSE_PASSED: 'Lighthouse audit passed',
        LIGHTHOUSE_FAILED: 'Lighthouse audit failed',
        METRICS_COLLECTED: 'Performance metrics collected'
    };

    // Security Messages
    static SECURITY = {
        SECURE_CONNECTION: 'Secure connection established',
        INSECURE_CONNECTION: 'Insecure connection detected',
        CERTIFICATE_VALID: 'SSL certificate valid',
        CERTIFICATE_INVALID: 'SSL certificate invalid',
        TWO_FACTOR_REQUIRED: 'Two-factor authentication required',
        ACCOUNT_SUSPENDED: 'Account suspended for security reasons',
        PASSWORD_EXPIRED: 'Password has expired',
        SUSPICIOUS_ACTIVITY: 'Suspicious activity detected'
    };

    // Confirmation Messages
    static CONFIRMATION = {
        DELETE_CONFIRM: 'Are you sure you want to delete this item?',
        LOGOUT_CONFIRM: 'Are you sure you want to logout?',
        CANCEL_CONFIRM: 'Are you sure you want to cancel?',
        DISCARD_CONFIRM: 'Discard unsaved changes?',
        OVERRIDE_CONFIRM: 'This will override existing data. Continue?',
        PERMANENT_ACTION: 'This action cannot be undone. Proceed?',
        RESET_CONFIRM: 'Reset all settings to default?',
        CLEAR_CONFIRM: 'Clear all data?'
    };

    // Navigation Messages
    static NAVIGATION = {
        PAGE_NOT_FOUND: 'The requested page was not found',
        ACCESS_DENIED: 'You do not have permission to access this page',
        REDIRECTING: 'Redirecting to login page...',
        SESSION_EXPIRED: 'Your session has expired. Please login again',
        COMING_SOON: 'This feature is coming soon',
        UNDER_CONSTRUCTION: 'This page is under construction'
    };

    // Helper Methods
    static getCustomMessage(template, ...args) {
        return template.replace(/{(\d+)}/g, (match, index) => {
            return typeof args[index] !== 'undefined' ? args[index] : match;
        });
    }

    static getRandomMessage(messageArray) {
        return messageArray[Math.floor(Math.random() * messageArray.length)];
    }

    static formatMessage(message, type = 'info') {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    }
}

export default Messages;
