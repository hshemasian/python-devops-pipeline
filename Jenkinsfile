pipeline {
    agent any

    environment {
        PYENV_HOME = "${WORKSPACE}/welcome/app/flask-volt-dashboard/.pyenv"
        PROJECT_HOME = "${WORKSPACE}/welcome/app/flask-volt-dashboard"
        FLASK_APP = 'run.py'
        FLASK_ENV = 'development'
    }

    stages {
        stage('Clone Flask Project') {
            steps {
                git branch: 'jenkins-workshop', url: 'https://github.com/yanivomc/devopshift-welcome.git'
            }
        }

        stage('Setup Python Environment and Install Dependencies') {
            steps {
                dir("${PROJECT_HOME}") {
                    script {
                        sh '''#!/bin/bash
                        if ! command -v virtualenv &> /dev/null; then
                            echo "Installing virtualenv..."
                            pip install virtualenv
                        fi

                        rm -rf $PYENV_HOME
                        virtualenv $PYENV_HOME
                        source $PYENV_HOME/bin/activate

                        pip install -r requirements.txt
                        '''
                    }
                }
            }
        }

        stage('Run Flask Application') {
            steps {
                dir("${PROJECT_HOME}") {
                    script {
                        sh '''#!/bin/bash
                        source $PYENV_HOME/bin/activate
                        
                        # עצירת תהליכים קודמים במידה וקיימים
                        pkill -f "flask run" || true

                        echo "Starting Flask application on 0.0.0.0:5005..."
                        # מונע מ-Jenkins להרוג את תהליך ה-nohup בסיום ה-Stage
                        JENKINS_NODE_COOKIE=dontKillMe nohup flask run --host=0.0.0.0 --port=5005 > flask_app.log 2>&1 &
                        '''
                    }
                }
            }
        }

        stage('Verify Application') {
            steps {
                dir("${PROJECT_HOME}") {
                    script {
                        sleep 5

                        // בדיקת תהליך בצורה בטוחה
                        def pid = sh(script: "pgrep -f 'flask run' || true", returnStdout: true).trim()

                        if (!pid) {
                            echo "There is a problem with our flask application - printing log below"
                            sh 'cat flask_app.log || true'
                            error "Flask application is not running!"
                        } else {
                            echo "Flask application is running successfully with PID: ${pid}"
                        }
                    }
                }
            }
        }

        stage('Run Application') {
            steps {
                echo 'Starting Flask application...'
            }
        }

        stage('Wait for User Approval') {
            steps {
                script {
                    def userInput = input message: 'Is the application running successfully?',
                                          parameters: [choice(name: 'Proceed', choices: 'Proceed\nAbort', description: 'Choose an option')]
                    env.USER_CHOICE = userInput
                }
            }
        }

        stage('Parallel Tests') {
            parallel {
                stage('Test on Chrome') {
                    steps {
                        echo 'Testing VOLT on Chrome...'
                    }
                }
                stage('Test on Firefox') {
                    steps {
                        echo 'Testing VOLT on Firefox...'
                    }
                }
            }
        }

        stage('Continue the pipeline') {
            when {
                expression { env.USER_CHOICE == 'Proceed' }
            }
            steps {
                script {
                    echo 'Continuing the pipeline...'
                }
            }
        }

        stage('Abort the Pipeline') {
            when {
                expression { env.USER_CHOICE == 'Abort' }
            }
            steps {
                script {
                    error 'Pipeline aborted by the user'
                }
            }
        }

        stage('Finalize the Pipeline') {
            steps {
                script {
                    if (env.USER_CHOICE == 'Proceed') {
                        echo 'Pipeline completed successfully'
                    } else {
                        echo 'Pipeline aborted by the user'
                    }
                }
            }
        }
    }

    post {
        always {
            dir("${PROJECT_HOME}") {
                echo 'Archiving logs and cleaning up workspace...'
                archiveArtifacts artifacts: 'flask_app.log', allowEmptyArchive: true
                sh 'rm -rf $PYENV_HOME'
            }
        }
    }
}