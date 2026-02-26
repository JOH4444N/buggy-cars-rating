pipeline {
    agent any

    environment {
        IMAGE_NAME = "johanqa/cypress-tests"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
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

        stage('Run Tests in Docker') {
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

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    bat "docker login -u %USER% -p %PASS%"
                    bat "docker push %IMAGE_NAME%:%IMAGE_TAG%"
                }
            }
        }

        stage('Approval for Production') {
            steps {
                input message: 'Deploy to Production?', ok: 'Deploy'
            }
        }
    }
}