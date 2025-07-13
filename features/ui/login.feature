@ui
Feature: User Login
  As a user
  I want to login to the application
  So that I can access my account

  Background:
    Given I am on the login page

  @smoke @regression
  Scenario: Successful login with valid credentials
    Given I have valid login credentials
    When I enter my username
    And I enter my password
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see the welcome message

  @negative
  Scenario: Login with invalid credentials
    When I enter invalid credentials
    Then I should see an error message

  @ai
  Scenario: AI-powered login
    When I use AI to login with "testuser@example.com" and "testpass123"
    Then I should be redirected to the dashboard

  @data-driven
  Scenario: Valid user login with data from file
    Given I have valid login credentials
    When I enter my username
    And I enter my password
    And I click the login button
    Then I should be redirected to the dashboard

  @ui @regression
  Scenario Outline: Login with different user roles
    Given I am on the login page
    When I enter username "<username>" and password "<password>"
    And I click on the login button
    Then I should be logged in successfully
    And I should see the "<role>" specific dashboard

    Examples:
      | username | password | role      |
      | admin    | admin123 | admin     |
      | user     | user123  | standard  |
      | manager  | mgr123   | manager   |