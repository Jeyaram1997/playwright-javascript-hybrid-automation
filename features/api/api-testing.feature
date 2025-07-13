@api
Feature: API Testing
  As a QA engineer
  I want to test REST APIs
  So that I can ensure API functionality works correctly

  Background:
    Given I have API base URL "https://jsonplaceholder.typicode.com"

  @regression
  Scenario: Get all posts
    When I send GET request to "/posts"
    Then the response status should be 200
    And the response should contain a list of posts

  @smoke
  Scenario: Create a new post
    Given I have post data:
      | title  | Sample Post           |
      | body   | This is a sample post |
      | userId | 1                     |
    When I send POST request to "/posts" with the data
    Then the response status should be 201
    And the response should contain the created post data

  @regression
  Scenario: Update existing post
    Given I have existing post with id "1"
    And I have updated post data:
      | title  | Updated Post           |
      | body   | This is an updated post |
    When I send PUT request to "/posts/1" with the data
    Then the response status should be 200
    And the response should contain the updated post data

  @regression
  Scenario: Delete existing post
    Given I have existing post with id "1"
    When I send DELETE request to "/posts/1"
    Then the response status should be 200
