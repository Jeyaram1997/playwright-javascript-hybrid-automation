/**
 * Jira Integration for automatic bug reporting
 * @author Jeyaram K
 * @version 1.0.0
 */

const axios = require('axios');
const dotenv = require('dotenv');
const FormData = require('form-data');
const fs = require('fs');

dotenv.config();

class JiraReporter {
    constructor() {
        // Decrypt and load Jira credentials
        const encryptedConfig = process.env.JIRA_CONFIG;
        if (encryptedConfig) {
            const config = JSON.parse(decryptData(encryptedConfig));
            this.jiraBaseUrl = config.baseUrl;
            this.jiraProject = config.project;
            this.jiraUsername = config.username;
            this.jiraApiToken = config.apiToken;
        } else {
            this.jiraBaseUrl = process.env.JIRA_BASE_URL;
            this.jiraProject = process.env.JIRA_PROJECT;
            this.jiraUsername = process.env.JIRA_USERNAME;
            this.jiraApiToken = process.env.JIRA_API_TOKEN;
        }
        
        // Initialize Axios instance for Jira API
        this.jiraApi = axios.create({
            baseURL: this.jiraBaseUrl,
            auth: {
                username: this.jiraUsername,
                password: this.jiraApiToken
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Creates a new issue in Jira
     * @param {object} issueData - Data for creating the issue
     * @returns {Promise<string>} - Issue ID
     */
    async createJiraIssue(issueData) {
        const auth = Buffer.from(`${this.jiraUsername}:${this.jiraApiToken}`).toString('base64');
        const url = `${this.jiraBaseUrl}/rest/api/2/issue`;

        const { summary, description, attachments = [], labels = [], components = [] } = issueData;
        
        // Create the issue
        const issueData = {
            fields: {
                project: {
                    key: this.jiraProject
                },
                summary: summary,
                description: description,
                issuetype: {
                    name: 'Bug'
                },
                labels: ['automation-failure', ...labels],
                components: components.map(comp => ({ name: comp })),
                priority: {
                    name: 'Medium'
                }
            }
        };

        try {
            const response = await axios.post(url, issueData, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json',
                },
            });

            const issueKey = response.data.key;
            console.log(`Created Jira issue: ${issueKey}`);
            
            // Attach files if any
            if (attachments && attachments.length > 0) {
                await Promise.all(attachments.map(attachment => this.attachFileToIssue(issueKey, attachment)));
            }
            
            return `${this.jiraBaseUrl}/browse/${issueKey}`;
        } catch (error) {
            console.error('Error creating Jira issue:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    /**
     * Attaches a file to a Jira issue
     * @param {string} issueKey - Jira issue key
     * @param {string} filePath - Path to file to attach
     * @returns {Promise<void>}
     */
    async attachFileToIssue(issueKey, filePath) {
        const auth = Buffer.from(`${this.jiraUsername}:${this.jiraApiToken}`).toString('base64');
        const url = `${this.jiraBaseUrl}/rest/api/2/issue/${issueKey}/attachments`;
        const form = new FormData();

        form.append('file', fs.createReadStream(filePath));

        try {
            await axios.post(url, form, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'X-Atlassian-Token': 'no-check',
                    ...form.getHeaders(),
                },
            });
            console.log(`Attached file ${filePath} to Jira issue ${issueKey}`);
        } catch (error) {
            console.error('Error adding attachment to Jira issue:', error.response ? error.response.data : error.message);
        }
    }

    /**
     * Updates an existing Jira issue
     * @param {string} issueKey - Jira issue key
     * @param {object} updateData - Update data
     * @returns {Promise<void>}
     */
    async updateJiraIssue(issueKey, updateData) {
        try {
            const response = await this.jiraApi.put(`/rest/api/2/issue/${issueKey}`, {
                fields: updateData
            });
            
            console.log(`Updated Jira issue: ${issueKey}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to update Jira issue: ${error.message}`);
            throw error;
        }
    }

    /**
     * Adds a comment to a Jira issue
     * @param {string} issueKey - Jira issue key
     * @param {string} comment - Comment text
     * @returns {Promise<void>}
     */
    async addCommentToIssue(issueKey, comment) {
        try {
            await this.jiraApi.post(`/rest/api/2/issue/${issueKey}/comment`, {
                body: comment
            });
            
            console.log(`Added comment to Jira issue ${issueKey}`);
        } catch (error) {
            console.error(`Failed to add comment to Jira issue: ${error.message}`);
            throw error;
        }
    }

    /**
     * Gets a Jira issue by key
     * @param {string} issueKey - Jira issue key
     * @returns {Promise<object>} - Issue data
     */
    async getJiraIssue(issueKey) {
        try {
            const response = await this.jiraApi.get(`/rest/api/2/issue/${issueKey}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to get Jira issue: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new JiraReporter();