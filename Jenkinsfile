pipeline {
    agent any
    
    parameters {
        choice(
            name: 'TEST_TYPE',
            choices: ['smoke', 'regression', 'ui', 'api', 'mobile', 'performance'],
            description: 'Type of tests to run'
        )
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Browser to run tests on'
        )
        choice(
            name: 'ENVIRONMENT',
            choices: ['test', 'staging', 'production'],
            description: 'Environment to test'
        )
    }
    
    environment {
        NODE_VERSION = '18'
        CI = 'true'
    }
    
    stages {
        stage('🔧 Setup') {
            steps {
                script {
                    echo "🎭 Starting Playwright Test Execution"
                    echo "📋 Test Type: ${params.TEST_TYPE}"
                    echo "🌐 Browser: ${params.BROWSER}"
                    echo "🎯 Environment: ${params.ENVIRONMENT}"
                }
                
                // Install Node.js
                nodejs(nodeJSInstallationName: "${NODE_VERSION}") {
                    sh 'node --version'
                    sh 'npm --version'
                }
            }
        }
        
        stage('📦 Install Dependencies') {
            steps {
                nodejs(nodeJSInstallationName: "${NODE_VERSION}") {
                    sh 'npm ci'
                    sh 'npx playwright install --with-deps'
                }
            }
        }
        
        stage('🔧 Framework Setup') {
            steps {
                nodejs(nodeJSInstallationName: "${NODE_VERSION}") {
                    sh 'cp .env.example .env'
                    sh 'npm run init'
                    sh 'npm run doctor'
                }
            }
        }
        
        stage('🧪 Execute Tests') {
            parallel {
                stage('Chromium Tests') {
                    when {
                        anyOf {
                            equals expected: 'chromium', actual: params.BROWSER
                            equals expected: 'all', actual: params.BROWSER
                        }
                    }
                    steps {
                        nodejs(nodeJSInstallationName: "${NODE_VERSION}") {
                            sh "node cli.js test:${params.TEST_TYPE} --browser chromium --env ${params.ENVIRONMENT}"
                        }
                    }
                    post {
                        always {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'reports/allure-report',
                                reportFiles: 'index.html',
                                reportName: 'Chromium Test Report'
                            ])
                        }
                    }
                }
                
                stage('Firefox Tests') {
                    when {
                        anyOf {
                            equals expected: 'firefox', actual: params.BROWSER
                            equals expected: 'all', actual: params.BROWSER
                        }
                    }
                    steps {
                        nodejs(nodeJSInstallationName: "${NODE_VERSION}") {
                            sh "node cli.js test:${params.TEST_TYPE} --browser firefox --env ${params.ENVIRONMENT}"
                        }
                    }
                }
                
                stage('WebKit Tests') {
                    when {
                        anyOf {
                            equals expected: 'webkit', actual: params.BROWSER
                            equals expected: 'all', actual: params.BROWSER
                        }
                    }
                    steps {
                        nodejs(nodeJSInstallationName: "${NODE_VERSION}") {
                            sh "node cli.js test:${params.TEST_TYPE} --browser webkit --env ${params.ENVIRONMENT}"
                        }
                    }
                }
            }
        }
        
        stage('📊 Generate Reports') {
            steps {
                nodejs(nodeJSInstallationName: "${NODE_VERSION}") {
                    sh 'npm run report:all'
                }
            }
        }
        
        stage('📤 Publish Reports') {
            parallel {
                stage('Allure Report') {
                    steps {
                        allure([
                            includeProperties: false,
                            jdk: '',
                            properties: [],
                            reportBuildPolicy: 'ALWAYS',
                            results: [[path: 'reports/allure-results']]
                        ])
                    }
                }
                
                stage('Archive Artifacts') {
                    steps {
                        archiveArtifacts(
                            artifacts: 'reports/**/*',
                            allowEmptyArchive: true,
                            fingerprint: true
                        )
                    }
                }
            }
        }
        
        stage('🐛 Report Failures') {
            when {
                not { equals expected: 'SUCCESS', actual: currentBuild.result }
            }
            steps {
                nodejs(nodeJSInstallationName: "${NODE_VERSION}") {
                    sh 'npm run jira:report'
                }
            }
        }
        
        stage('📧 Send Notifications') {
            steps {
                nodejs(nodeJSInstallationName: "${NODE_VERSION}") {
                    sh 'npm run send:reports'
                }
                
                // Slack notification
                slackSend(
                    channel: '#test-results',
                    color: currentBuild.result == 'SUCCESS' ? 'good' : 'danger',
                    message: """
🎭 *Playwright Test Results*
📋 Type: ${params.TEST_TYPE}
🌐 Browser: ${params.BROWSER}
🎯 Environment: ${params.ENVIRONMENT}
📊 Result: ${currentBuild.result}
📈 Report: ${BUILD_URL}allure
                    """,
                    teamDomain: 'your-workspace',
                    token: 'your-slack-token'
                )
            }
        }
    }
    
    post {
        always {
            echo "🏁 Test execution completed with result: ${currentBuild.result}"
            
            // Clean workspace
            cleanWs()
        }
        
        failure {
            echo "❌ Tests failed. Check the reports for details."
            
            // Additional failure handling
            emailext(
                subject: "🚨 Test Failure - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
Test execution failed for ${env.JOB_NAME}

Build: ${env.BUILD_NUMBER}
Branch: ${env.GIT_BRANCH}
Commit: ${env.GIT_COMMIT}

View details: ${env.BUILD_URL}
                """,
                to: '${DEFAULT_RECIPIENTS}',
                attachLog: true
            )
        }
        
        success {
            echo "✅ All tests passed successfully!"
        }
    }
}
