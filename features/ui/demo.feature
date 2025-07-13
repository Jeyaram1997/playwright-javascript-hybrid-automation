@ui @demo @smoke
Feature: Demo Application Testing
  As a QA Engineer
  I want to test the framework with a demo application
  So that I can verify all components work correctly

  Background:
    Given I have configured the test environment

  @smoke @navigation
  Scenario: Navigate to demo page
    Given I navigate to the demo application
    When I verify the page loads successfully
    Then I should see the page title
    And I should take a screenshot

  @smoke @interaction
  Scenario: Basic element interaction
    Given I navigate to the demo application  
    When I interact with page elements
    Then I should verify element states
    And I should capture performance metrics

  @smoke @forms
  Scenario: Form interaction testing
    Given I navigate to the demo application
    When I fill out a sample form
    Then I should verify form submission
    And I should generate a test report
