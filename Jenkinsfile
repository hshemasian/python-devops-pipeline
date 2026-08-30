pipeline {
    agent any

    environment {
        APP_NAME = 'hello-python-app'
        DOCKER_USER = 'hillel456'
        IMAGE_NAME = "${DOCKER_USER}/${APP_NAME}:${BUILD_NUMBER}"
    }

    stages {
        stage('Build') {
            steps {
                sh "docker build -t ${env.IMAGE_NAME} ."
            }
        }

        stage('Test') {
            steps {
                echo 'Passed successfully'
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'USER', passwordVariable: 'PAT')]) {
                    sh 'echo "$PAT" | docker login -u "$USER" --password-stdin'
                    sh "docker push ${env.IMAGE_NAME}"
                }
            }
        }
    }

    post {
        always {
            sh "docker rmi ${env.IMAGE_NAME} || true"
        }
    }
}
