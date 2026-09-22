pipeline {
    agent any

    environment {
        // מזהי המפתחות המוגדרים בתוך Manage Jenkins -> Credentials
        DOCKERHUB_CRED = credentials('')
        GITHUB_CRED    = credentials(')

        // פרטי האימג' וה-GitOps Repo
        IMAGE_NAME     = 'hillel456/python-devops-pipeline'
        GITOPS_REPO    = 'github.com/hshemasian/gitops.git'
    }

    stages {
        stage('Parallel Checks') {
            parallel {
                stage('Linting') {
                    steps {
                        echo 'Running Linting checks...'
                        // sh 'flake8 app.py || true'
                    }
                }
                stage('Security Scan') {
                    steps {
                        echo 'Running Security Scans...'
                        // sh 'trivy image ${IMAGE_NAME}:${BUILD_NUMBER} || true'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
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

        stage('Update GitOps Repo for ArgoCD') {
            steps {
                sh """
                    git config --global user.email "jenkins@ci-cd.com"
                    git config --global user.name "Jenkins CI"

                    # ניקוי ושיפול ה-GitOps Repo
                    rm -rf gitops-dir
                    git clone https://${GITHUB_CRED_USR}:${GITHUB_CRED_PSW}@${GITOPS_REPO} gitops-dir

                    # עדכון תגית האימג' ב-values.yaml של סביבת dev
                    cd gitops-dir/flask-aws-monitor/dev
                    sed -i 's/tag: .*/tag: "${BUILD_NUMBER}"/' values.yaml

                    # דחיפת השינוי חזרה ל-GitHub
                    git add values.yaml
                    git commit -m "CI: Update image tag to build ${BUILD_NUMBER}"
                    git push https://${GITHUB_CRED_USR}:${GITHUB_CRED_PSW}@${GITOPS_REPO} main
                """
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
            cleanWs()
        }
    }
}
