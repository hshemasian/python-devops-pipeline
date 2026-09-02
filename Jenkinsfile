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
                myLibrary.buildApp(env.IMAGE_NAME)
            }
        }

        stage('Test') {
            steps {
                myLibrary.testApp()
            }
        }

        stage('Deploy to Docker Hub') {
            steps {
                myLibrary.deployToDockerHub()
            }
        }
    }

    post {
        always {
            myLibrary.cleanup()
        }
    }
}
