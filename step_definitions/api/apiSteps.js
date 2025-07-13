const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const BaseClass = require('../../core/base/BaseClass');

let apiResponse;
let baseURL;
let postData;

Given('I have API base URL {string}', function (url) {
    baseURL = url;
});

Given('I have post data:', function (dataTable) {
    const data = dataTable.rowsHash();
    postData = {
        title: data.title,
        body: data.body,
        userId: parseInt(data.userId)
    };
});

Given('I have existing post with id {string}', function (postId) {
    this.postId = postId;
});

Given('I have updated post data:', function (dataTable) {
    const data = dataTable.rowsHash();
    postData = {
        id: parseInt(this.postId),
        title: data.title,
        body: data.body,
        userId: 1
    };
});

When('I send GET request to {string}', async function (endpoint) {
    const url = baseURL + endpoint;
    apiResponse = await this.base.apiGet(url);
});

When('I send POST request to {string} with the data', async function (endpoint) {
    const url = baseURL + endpoint;
    apiResponse = await this.base.apiPost(url, postData);
});

When('I send PUT request to {string} with the data', async function (endpoint) {
    const url = baseURL + endpoint;
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(postData),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });
    apiResponse = {
        status: () => response.status,
        json: () => response.json()
    };
});

When('I send DELETE request to {string}', async function (endpoint) {
    const url = baseURL + endpoint;
    const response = await fetch(url, {
        method: 'DELETE',
    });
    apiResponse = {
        status: () => response.status,
        json: () => response.json()
    };
});

Then('the response status should be {int}', async function (expectedStatus) {
    const actualStatus = await apiResponse.status();
    expect(actualStatus).to.equal(expectedStatus);
});

Then('the response should contain a list of posts', async function () {
    const responseData = await apiResponse.json();
    expect(responseData).to.be.an('array');
    expect(responseData.length).to.be.greaterThan(0);
    expect(responseData[0]).to.have.property('title');
    expect(responseData[0]).to.have.property('body');
    expect(responseData[0]).to.have.property('userId');
});

Then('the response should contain the created post data', async function () {
    const responseData = await apiResponse.json();
    expect(responseData).to.have.property('title', postData.title);
    expect(responseData).to.have.property('body', postData.body);
    expect(responseData).to.have.property('userId', postData.userId);
});

Then('the response should contain the updated post data', async function () {
    const responseData = await apiResponse.json();
    expect(responseData).to.have.property('title', postData.title);
    expect(responseData).to.have.property('body', postData.body);
    expect(responseData).to.have.property('id', postData.id);
});
