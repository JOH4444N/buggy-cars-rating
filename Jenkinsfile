pipeline {
    agent any

    environment {
        IMAGE_NAME = "JOH4444N/buggy-cars-rating"
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Run Cypress Tests') {
            steps {
                bat '''
                docker run --rm ^
                  -v "%cd%:/e2e" ^
                  -w /e2e ^
                  cypress/included:13.6.0 ^
                  cypress run
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% ."
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'joh4444n', passwordVariable: 'PASS')]) {
                    bat "docker login -u %USER% -p %PASS%"
                    bat "docker push %IMAGE_NAME%:%IMAGE_TAG%"
                }
            }
        }

        stage('Approval for Production') {
            steps {
                input message: 'Deploy to Production?', ok: 'Approve'
            }
        }
    }

    post {
        success {
            echo 'Build and Delivery Successful'
        }
        failure {
            echo 'Build Failed'
        }
    }
}