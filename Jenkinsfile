@Library('my-shared-library') _

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
      runAsUser: 0
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
        stage('Prepare Tag') {
            steps {
                script {
                    // יצירת טאג קריא ומסודר הכולל את מספר הבולד, התאריך והשעה
                    env.IMAGE_TAG = "build-${env.BUILD_NUMBER}_${new Date().format('yyyy-MM-dd_HH-mm-ss')}"
                    echo "Generated Image Tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Code Quality & Linting') {
            steps {
                codeQuality(type: 'python')
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    myLibrary.buildApp("${IMAGE_NAME}:${env.IMAGE_TAG}")
                }
            }
        }

        stage('Security Scan') {
            steps {
                securityScan("${IMAGE_NAME}:${env.IMAGE_TAG}")
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh """
                    echo $DOCKERHUB_CRED_PSW | docker login -u $DOCKERHUB_CRED_USR --password-stdin
                    docker push ${IMAGE_NAME}:${env.IMAGE_TAG}
                """
            }
        }

        stage('Update & Render Helm Chart for ArgoCD') {
            steps {
                sh """
                    git config --global user.email "jenkins@ci-cd.com"
                    git config --global user.name "Jenkins CI"

                    rm -rf gitops-dir
                    git clone https://${GITHUB_CRED_USR}:${GITHUB_CRED_PSW}@${GITOPS_REPO} gitops-dir

                    # עדכון ה-Tag המעודכן ב-values.yaml
                    sed -i 's/tag: .*/tag: "${env.IMAGE_TAG}"/' gitops-dir/chart/values.yaml

                    # הורדה זמנית של Helm CLI לביצוע ה-template
                    curl -sSL https://get.helm.sh/helm-v3.16.1-linux-amd64.tar.gz | tar xz -C /tmp

                    # בדיקת ורינדור ה-Template עם הטאג החדש
                    /tmp/linux-amd64/helm template my-app gitops-dir/chart --set image.tag=${env.IMAGE_TAG}

                    # שמירה ודחיפה ל-GitOps Repository
                    cd gitops-dir
                    git add .
                    git commit -m "CI: Update image tag to ${env.IMAGE_TAG}"
                    git push https://${GITHUB_CRED_USR}:${GITHUB_CRED_PSW}@${GITOPS_REPO} main
                """
            }
        }
    }

    post {
        always {
            script {
                myLibrary.cleanup()
            }
            deleteDir()
        }
    }
}