@mobile
Feature: Mobile Testing
  As a QA engineer
  I want to test mobile web applications
  So that I can ensure mobile functionality works correctly

  Background:
    Given I am using a mobile device "iPhone 13"

  @smoke
  Scenario: Login on mobile device
    Given I navigate to the login page
    When I enter username "testuser@example.com"
    And I enter password "testpass123"
    And I tap the login button
    Then I should see the dashboard page

  @regression
  Scenario: Mobile navigation menu
    Given I am on the home page
    When I tap the hamburger menu
    Then the navigation menu should slide out
    And I should see all navigation options

  @regression
  Scenario: Mobile responsive design
    Given I am on the product page
    When I rotate the device to landscape
    Then the layout should adjust to landscape mode
    When I rotate the device to portrait
    Then the layout should adjust to portrait mode

  @performance
  Scenario: Mobile page load performance
    Given I am on the home page
    When I measure the page load time
    Then the page should load within 3 seconds
    And the performance score should be above 80
