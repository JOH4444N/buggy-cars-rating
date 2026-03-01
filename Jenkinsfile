pipeline {
    agent any

    environment {
        IMAGE_NAME = "joh4444n/buggy-cars-rating"
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME:$IMAGE_TAG ."
            }
        }

        stage('Run Cypress Tests (inside image)') {
            steps {
                sh "docker run --rm $IMAGE_NAME:$IMAGE_TAG"
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push $IMAGE_NAME:$IMAGE_TAG
                    '''
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