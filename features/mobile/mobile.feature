@mobile
Feature: Mobile Device Testing
  As a QA engineer
  I want to test the application on mobile devices
  So that I can ensure mobile user experience is optimal

  Background:
    Given I launch a mobile device "iPhone 13 Pro"

  @mobile-navigation
  Scenario: Basic mobile navigation
    Given I am on the "example.com" page
    When I tap on the menu button
    And I scroll down the page
    Then I should see the mobile layout
    And the page should be responsive

  @mobile-gestures
  Scenario: Mobile gesture interactions
    Given I am on the "example.com" page
    When I perform a swipe gesture "left"
    And I perform a pinch to zoom gesture
    And I perform a long press on an element
    Then the gestures should be recognized
    And the interface should respond appropriately

  @device-rotation
  Scenario: Device orientation testing
    Given I am on the "example.com" page
    When I rotate the device to "landscape"
    Then the layout should adapt to landscape mode
    When I rotate the device to "portrait" 
    Then the layout should adapt to portrait mode
    And all elements should remain accessible

  @cross-device
  Scenario Outline: Cross-device compatibility testing
    Given I launch a mobile device "<device>"
    And I am on the "example.com" page
    When I interact with the page elements
    Then the page should display correctly on "<device>"
    And all functionality should work as expected

    Examples:
      | device           |
      | iPhone 13 Pro    |
      | iPhone 12        |
      | Samsung Galaxy S21 |
      | iPad Pro         |

  @mobile-performance
  Scenario: Mobile performance validation
    Given I launch a mobile device "iPhone 13 Pro"
    And I start mobile performance monitoring
    When I navigate through multiple pages:
      | page     | action          |
      | home     | Load page       |
      | products | Browse items    |
      | details  | View product    |
      | cart     | Add to cart     |
    Then the mobile performance should meet standards
    And the page load times should be acceptable
    And memory usage should be within limits
