def appname = "hello-newapp"
def repo = "hillel456"
def appimage = "${repo}/${appname}"

podTemplate(containers: [
    containerTemplate(name: 'jnlp', image: 'jenkins/inbound-agent', ttyEnabled: true),
    containerTemplate(
        name: 'docker', 
        image: 'docker:26-dind',
        privileged: true,
        envVars: [
            envVar(key: 'DOCKER_TLS_CERTDIR', value: ''),
            envVar(key: 'DOCKER_HOST', value: 'tcp://localhost:2375')
        ],
        args: '--storage-driver=vfs'
    ),
    containerTemplate(
        name: 'deployer', 
        image: 'elevy99927/k8s-deployer:latest',
        ttyEnabled: true,
        command: 'cat',
        envVars: [
            envVar(key: 'DOCKER_HOST', value: 'tcp://localhost:2375')
        ]
    )
  ]
) {
    node(POD_LABEL) {
        def apptag = "${env.BUILD_NUMBER}"

        stage('Checkout') {
            container('deployer') {
                sh '/usr/bin/git config --global http.sslVerify false'
                checkout scm
            }
        }

        stage('Build') {
            container('docker') {
                sh """
                    until docker info > /dev/null 2>&1; do
                        echo "Waiting for Docker daemon..."
                        sleep 1
                    done
                    docker build . -t ${appimage}:${apptag} -t ${appimage}:latest
                """
            }
        }

        stage('Parallel Tasks') {
            parallel(
                "Task 1": {
                    container('deployer') {
                        sh "echo 'Running parallel checks...'"
                    }
                },
                "Task 2 - Trivy Scan": {
                    container('deployer') {
                        // שימוש בפורמט JSON שנתמך בגרסה המותקנת בקונטיינר
                        sh "trivy image --format json --output trivy-report.json ${appimage}:${apptag}"
                    }

                    // שמירת הדו"ח כ-Artifact ב-Jenkins
                    archiveArtifacts artifacts: 'trivy-report.json', allowEmptyArchive: true

                    container('deployer') {
                        // הרצת הסריקה עם exit-code 0 כדי שהפלייסט ימשיך למרות ממצאי האבטחה
                        sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${appimage}:${apptag}"
                    }
                }
            )
        }

        stage('Push to DockerHub') {
            container('docker') {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker push ${appimage}:${apptag}"
                    sh "docker push ${appimage}:latest"
                }
            }
        }

        stage('Deploy') {
            container('deployer') {
                sh "helm template hello-newapp ./chart > hello-newapp.yaml"
            }
        }
    }
}
