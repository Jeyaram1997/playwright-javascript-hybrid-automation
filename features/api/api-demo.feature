@api @demo @smoke
Feature: API Testing Demo
  As a QA Engineer
  I want to test API functionality
  So that I can verify API testing capabilities

  @api @get
  Scenario: Test API GET request
    Given I have API testing configured
    When I send a GET request to a public API
    Then I should receive a successful response
    And I should verify response time

  @api @headers
  Scenario: Test API with headers
    Given I have API testing configured
    When I send a request with custom headers
    Then I should verify the response headers
    And I should log the response details
