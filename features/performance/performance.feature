@performance
Feature: Performance Testing
  As a QA engineer
  I want to validate application performance
  So that users have a fast and responsive experience

  @lighthouse-audit
  Scenario: Lighthouse performance audit
    Given I am on the "example.com" page
    When I run a Lighthouse performance audit
    Then the performance score should be above 80
    And the accessibility score should be above 85
    And the best practices score should be above 80
    And the SEO score should be above 75

  @load-testing
  Scenario: Basic load testing
    Given I have 100 concurrent users
    When they all visit the home page simultaneously
    Then the average response time should be less than 3 seconds
    And no errors should occur

  @user-journey-performance
  Scenario: Complete user journey performance
    Given I start performance monitoring
    When I perform a complete user journey:
      | step | action                  |
      | 1    | Navigate to home page   |
      | 2    | Search for products     |
      | 3    | View product details    |
      | 4    | Add product to cart     |
      | 5    | Proceed to checkout     |
    Then each step should complete within acceptable time limits
    And the overall journey time should be under 15 seconds

  @performance-regression
  Scenario: Performance regression testing
    Given I am on the "example.com" page
    And I start performance monitoring
    When I run a Lighthouse performance audit
    And I perform typical user interactions
    Then the performance metrics should meet baseline requirements
    And no performance regressions should be detected

  @core-web-vitals
  Scenario: Core Web Vitals validation
    Given I am on the "example.com" page
    When I run a Lighthouse performance audit
    Then the Largest Contentful Paint should be under 2.5 seconds
    And the First Input Delay should be under 100 milliseconds
    And the Cumulative Layout Shift should be under 0.1
    And the First Contentful Paint should be under 1.8 seconds
