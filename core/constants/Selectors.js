/**
 * Selectors Constants
 * Centralized selector management for UI automation
 * @author Automation Team
 * @version 1.0.0
 */

export class Selectors {
    // Login Page Selectors
    static LOGIN = {
        USERNAME_INPUT: '#username',
        PASSWORD_INPUT: '#password',
        LOGIN_BUTTON: '[data-testid="login-button"]',
        FORGOT_PASSWORD_LINK: '[data-testid="forgot-password"]',
        ERROR_MESSAGE: '.error-message',
        SUCCESS_MESSAGE: '.success-message',
        REMEMBER_ME_CHECKBOX: '#remember-me',
        SOCIAL_LOGIN: {
            GOOGLE: '[data-testid="google-login"]',
            FACEBOOK: '[data-testid="facebook-login"]',
            GITHUB: '[data-testid="github-login"]'
        }
    };

    // Dashboard Selectors
    static DASHBOARD = {
        HEADER: '.dashboard-header',
        NAVIGATION: '.main-navigation',
        SIDEBAR: '.sidebar',
        CONTENT_AREA: '.content-area',
        USER_MENU: '[data-testid="user-menu"]',
        LOGOUT_BUTTON: '[data-testid="logout"]',
        NOTIFICATIONS: '[data-testid="notifications"]',
        SEARCH_BOX: '[data-testid="search"]'
    };

    // Common UI Elements
    static COMMON = {
        LOADING_SPINNER: '.loading-spinner',
        MODAL: '.modal',
        MODAL_CLOSE: '.modal-close',
        TOAST_MESSAGE: '.toast',
        DROPDOWN: '.dropdown',
        DROPDOWN_ITEM: '.dropdown-item',
        PAGINATION: '.pagination',
        BREADCRUMB: '.breadcrumb',
        TABS: '.tabs',
        TAB_ITEM: '.tab-item',
        TOOLTIP: '.tooltip'
    };

    // Form Elements
    static FORMS = {
        INPUT_FIELD: 'input',
        TEXT_AREA: 'textarea',
        SELECT_DROPDOWN: 'select',
        CHECKBOX: 'input[type="checkbox"]',
        RADIO_BUTTON: 'input[type="radio"]',
        FILE_UPLOAD: 'input[type="file"]',
        SUBMIT_BUTTON: 'button[type="submit"]',
        CANCEL_BUTTON: '[data-testid="cancel"]',
        RESET_BUTTON: 'button[type="reset"]',
        REQUIRED_FIELD: '.required',
        VALIDATION_ERROR: '.validation-error'
    };

    // Table Elements
    static TABLE = {
        TABLE: 'table',
        HEADER: 'thead',
        HEADER_CELL: 'th',
        BODY: 'tbody',
        ROW: 'tr',
        CELL: 'td',
        SORT_BUTTON: '.sort-button',
        FILTER_INPUT: '.filter-input',
        ACTIONS_COLUMN: '.actions-column',
        EDIT_BUTTON: '[data-testid="edit"]',
        DELETE_BUTTON: '[data-testid="delete"]',
        VIEW_BUTTON: '[data-testid="view"]'
    };

    // Navigation Elements
    static NAVIGATION = {
        MAIN_MENU: '.main-menu',
        MENU_ITEM: '.menu-item',
        SUBMENU: '.submenu',
        BREADCRUMB: '.breadcrumb',
        BACK_BUTTON: '[data-testid="back"]',
        NEXT_BUTTON: '[data-testid="next"]',
        HOME_LINK: '[data-testid="home"]',
        LOGO: '.logo'
    };

    // Shopping Cart (E-commerce)
    static CART = {
        ADD_TO_CART: '[data-testid="add-to-cart"]',
        CART_ICON: '[data-testid="cart-icon"]',
        CART_COUNTER: '.cart-counter',
        CART_ITEMS: '.cart-items',
        CART_ITEM: '.cart-item',
        QUANTITY_INPUT: '.quantity-input',
        REMOVE_ITEM: '[data-testid="remove-item"]',
        CHECKOUT_BUTTON: '[data-testid="checkout"]',
        TOTAL_PRICE: '.total-price'
    };

    // Product Page
    static PRODUCT = {
        PRODUCT_TITLE: '.product-title',
        PRODUCT_PRICE: '.product-price',
        PRODUCT_DESCRIPTION: '.product-description',
        PRODUCT_IMAGE: '.product-image',
        SIZE_SELECTOR: '.size-selector',
        COLOR_SELECTOR: '.color-selector',
        QUANTITY_SELECTOR: '.quantity-selector',
        STOCK_STATUS: '.stock-status',
        REVIEWS_SECTION: '.reviews-section',
        RATING_STARS: '.rating-stars'
    };

    // Search Elements
    static SEARCH = {
        SEARCH_INPUT: '[data-testid="search-input"]',
        SEARCH_BUTTON: '[data-testid="search-button"]',
        SEARCH_RESULTS: '.search-results',
        SEARCH_RESULT_ITEM: '.search-result-item',
        NO_RESULTS: '.no-results',
        SEARCH_FILTERS: '.search-filters',
        FILTER_OPTION: '.filter-option',
        CLEAR_FILTERS: '[data-testid="clear-filters"]'
    };

    // Mobile Specific Selectors
    static MOBILE = {
        HAMBURGER_MENU: '.hamburger-menu',
        MOBILE_MENU: '.mobile-menu',
        SWIPE_CONTAINER: '.swipe-container',
        PULL_TO_REFRESH: '.pull-to-refresh',
        FLOATING_ACTION_BUTTON: '.fab',
        BOTTOM_NAVIGATION: '.bottom-navigation',
        TAB_BAR: '.tab-bar'
    };

    // Error and Status Messages
    static MESSAGES = {
        ERROR_CONTAINER: '.error-container',
        SUCCESS_CONTAINER: '.success-container',
        WARNING_CONTAINER: '.warning-container',
        INFO_CONTAINER: '.info-container',
        VALIDATION_MESSAGE: '.validation-message',
        SYSTEM_MESSAGE: '.system-message'
    };

    // Custom Attribute Selectors
    static ATTRIBUTES = {
        DATA_TESTID: (id) => `[data-testid="${id}"]`,
        DATA_ROLE: (role) => `[data-role="${role}"]`,
        ARIA_LABEL: (label) => `[aria-label="${label}"]`,
        TITLE: (title) => `[title="${title}"]`,
        CLASS_CONTAINS: (className) => `[class*="${className}"]`,
        ID_CONTAINS: (id) => `[id*="${id}"]`
    };

    // Dynamic Selectors (Methods)
    static getDynamicSelector(baseSelector, value) {
        return `${baseSelector}[data-value="${value}"]`;
    }

    static getByText(text) {
        return `text="${text}"`;
    }

    static getByPartialText(text) {
        return `text*="${text}"`;
    }

    static getByRole(role, options = {}) {
        let selector = `role=${role}`;
        if (options.name) selector += `[name="${options.name}"]`;
        if (options.level) selector += `[level=${options.level}]`;
        return selector;
    }
}

export default Selectors;
