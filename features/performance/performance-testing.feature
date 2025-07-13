@performance
Feature: Performance Testing
  As a QA engineer
  I want to test application performance
  So that I can ensure optimal user experience

  @lighthouse
  Scenario: Website performance audit
    Given I navigate to "https://example.com"
    When I run a Lighthouse performance audit
    Then the performance score should be above 80
    And the accessibility score should be above 90
    And the best practices score should be above 80
    And the SEO score should be above 80

  @loadtest
  Scenario: Load testing with multiple users
    Given I have 100 concurrent users
    When they all visit the home page simultaneously
    Then the average response time should be less than 2 seconds
    And no errors should occur

  @stresstest
  Scenario: Stress testing with high load
    Given I gradually increase load from 1 to 500 users
    When I monitor system performance
    Then the system should handle the load gracefully
    And memory usage should remain stable
    And CPU usage should not exceed 80%

  @monitoring
  Scenario: Performance monitoring during user journey
    Given I start performance monitoring
    When I perform a complete user journey:
      | step | action                    |
      | 1    | Navigate to home page     |
      | 2    | Search for products       |
      | 3    | View product details      |
      | 4    | Add product to cart       |
      | 5    | Proceed to checkout       |
    Then each step should complete within acceptable time limits
    And the overall journey time should be under 30 seconds
