pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: jnlp
    image: jenkins/inbound-agent:latest
    securityContext:
      privileged: true
    volumeMounts:
    - name: docker-sock
      mountPath: /var/run/docker.sock
    - name: docker-bin
      mountPath: /usr/bin/docker
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
  - name: docker-bin
    hostPath:
      path: /usr/bin/docker
'''
        }
    }

    environment {
        DOCKERHUB_CRED = credentials('dockerhub-credentials')
        GITHUB_CRED    = credentials('github-cred')

        IMAGE_NAME     = 'hillel456/python-devops-pipeline'
        GITOPS_REPO    = 'github.com/hshemasian/gitops.git'
    }

    stages {
        stage('Code Quality & Linting') {
            steps {
                echo 'Running Code Quality checks on python code...'
                sh 'flake8 app.py || true'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Running Security Scan on the built image...'
                sh "trivy image ${IMAGE_NAME}:${BUILD_NUMBER} || true"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh """
                    echo $DOCKERHUB_CRED_PSW | docker login -u $DOCKERHUB_CRED_USR --password-stdin
                    docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                """
            }
        }

        stage('Update & Package Helm Chart for ArgoCD') {
            steps {
                sh """
                    git config --global user.email "jenkins@ci-cd.com"
                    git config --global user.name "Jenkins CI"

                    rm -rf gitops-dir
                    git clone https://${GITHUB_CRED_USR}:${GITHUB_CRED_PSW}@${GITOPS_REPO} gitops-dir

                    sed -i 's/tag: .*/tag: "${BUILD_NUMBER}"/' gitops-dir/chart/values.yaml

                    helm package gitops-dir/chart/ -d gitops-dir/

                    cd gitops-dir
                    git add .
                    git commit -m "CI: Update image tag to build ${BUILD_NUMBER} and package helm chart"
                    git push https://${GITHUB_CRED_USR}:${GITHUB_CRED_PSW}@${GITOPS_REPO} main
                """
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
            deleteDir()
        }
    }
}
