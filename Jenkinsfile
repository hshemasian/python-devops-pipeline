@Library('my-sharded-library') _

pipeline {
    agent any

    environment {
        APP_NAME    = 'python-devops-pipeline'
        DOCKER_USER = 'hillel456'
        IMAGE_NAME  = "${DOCKER_USER}/${APP_NAME}:${BUILD_NUMBER}"
    }

    stages {
        stage('Build') {
            steps {
                script {
                    myLibrary.buildApp(env.IMAGE_NAME)
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    myLibrary.testApp()
                }
            }
        }

        stage('Create Sonar Project') {
            steps {
                script {
                    // קריאה דרך codeQuality
                    codeQuality.sonarCreateProject(env.APP_NAME)
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    // קריאה דרך codeQuality (פותר את ה-NoSuchMethodError)
                    codeQuality.sonarLocalScan(env.APP_NAME)
                }
            }
        }

        stage('Deploy to Docker Hub') {
            steps {
                script {
                    myLibrary.deployToDockerHub()
                }
            }
        }
    }

    post {
        always {
            script {
                myLibrary.cleanup()
            }
        }
    }
}
