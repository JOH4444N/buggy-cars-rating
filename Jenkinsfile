pipeline {
    agent any

    environment {
        IMAGE_NAME = "joh4444n/buggy-cars-rating"
        IMAGE_TAG  = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t $IMAGE_NAME:$IMAGE_TAG .
                    docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest
                """
            }
        }

        stage('Run Cypress Tests (inside image)') {
            steps {
                sh """
                    docker run --rm $IMAGE_NAME:$IMAGE_TAG
                """
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh """
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $IMAGE_NAME:$IMAGE_TAG
                        docker push $IMAGE_NAME:latest
                    """
                }
            }
        }

        stage('Approval for Production') {
            steps {
                input message: 'Deploy to Production?', ok: 'Approve'
            }
        }

        stage('Deploy to Production') {
            steps {
                sh """
                    docker stop buggy-cars || true
                    docker rm buggy-cars || true
                    docker run -d --name buggy-cars -p 8080:80 $IMAGE_NAME:latest
                """
            }
        }
    }

    post {
        success {
            echo 'CD Pipeline Completed Successfully ✅'
        }
        failure {
            echo 'CD Pipeline Failed ❌'
        }
    }
}