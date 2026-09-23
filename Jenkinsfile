pipeline {
    agent any

    environment {
        // מזהי המפתחות המוגדרים בתוך Manage Jenkins -> Credentials
        DOCKERHUB_CRED = credentials('dockerhub-credentials')
        GITHUB_CRED    = credentials('github-credentials')

        // פרטי האימג' וה-GitOps Repo
        IMAGE_NAME     = 'hillel456/python-devops-pipeline'
        GITOPS_REPO    = 'github.com/hshemasian/gitops.git'
    }

    stages {
        stage('Code Quality & Linting') {
            steps {
                echo 'Running Code Quality checks on python code...'
                // בדיקת איכות הקוד לפני הבנייה
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
                // הסריקה מבוצעת רק לאחר שהאימג' נבנה בהצלחה
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

                    # ניקוי ושיפול ה-GitOps Repo
                    rm -rf gitops-dir
                    git clone https://${GITHUB_CRED_USR}:${GITHUB_CRED_PSW}@${GITOPS_REPO} gitops-dir

                    # 1. עדכון תגית האימג' ב-values.yaml
                    cd gitops-dir/flask-aws-monitor/dev
                    sed -i 's/tag: .*/tag: "${BUILD_NUMBER}"/' values.yaml

                    # 2. אריזת ה-Helm Chart לקובץ אחד (.tgz)
                    cd ..
                    helm package dev/

                    # 3. דחיפת השינויים (הן ה-values והן קובץ ה-Helm הארוז) ל-GitHub
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
            cleanWs()
        }
    }
}
