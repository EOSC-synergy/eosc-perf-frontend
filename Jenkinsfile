#!/usr/bin/groovy

@Library(['github.com/indigo-dc/jenkins-pipeline-library@release/2.1.0']) _

def projectConfig

pipeline {
    agent any

    environment {
        dockerhub_credentials = "o3as-dockerhub-vykozlov"
    }

    stages {
        stage('SQA baseline dynamic stages') {
            environment {
                // get jenkins user id and group
                jenkins_user_id = sh (returnStdout: true, script: 'id -u').trim()
                jenkins_user_group = sh (returnStdout: true, script: 'id -g').trim()
            }
            steps {
                // execute 'backend'+'frontend' pipeline
                script {
                    projectConfig = pipelineConfig()
                    buildStages(projectConfig)
                }
            }
            post {
                always {
                    // FE: publish codestyle:
                    // replace path in the docker container with relative path
                    sh "sed -i 's/\\/perf-testing-frontend/./gi' eslint-codestyle.xml"
                    recordIssues(
                        enabledForFailure: true, aggregatingResults: true,
                        tool: checkStyle(pattern: 'eslint-codestyle.xml',
                                         reportEncoding:'UTF-8',
                                         name: 'FE - CheckStyle')
                    )

                    // publish BE+FE coverage reports:
                    // service_backend/tmp/be-coverage.xml +
                    // service_frontend/coverage/fe-cobertura-coverage.xml:
                    sh "cd coverage && mv cobertura-coverage.xml fe-cobertura-coverage.xml && cd -"
                    publishCoverage(adapters: [coberturaAdapter(path: '**/*-coverage.xml')],
                                    tag: 'Coverage', 
                                    failUnhealthy: false, failUnstable: false
                    )
                    // FE: publish the output of npm audit:
                    recordIssues(
                        enabledForFailure: true, aggregatingResults: true,
                        tool: issues(name: 'FE - NPM Audit', pattern:'npm-audit.json'),
                    )
                }
                cleanup {
                    cleanWs()
                }
            }
        }
    }
}
