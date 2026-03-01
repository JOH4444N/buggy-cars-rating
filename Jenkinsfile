pipeline {
    agent {
        docker {
            image 'cypress/included:13.6.0'
            args '-u root'
        }
    }

    environment {
        DOCKER_IMAGE = "TU_USUARIO_DOCKERHUB/buggy-cars-cypress"
        VERSION = "${BUILD_NUMBER}"
        TESTING_URL = "https://buggy.justtestit.org/"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Cypress Tests') {
            steps {
                sh 'mkdir -p results'
                sh 'npx cypress run --reporter junit --reporter-options "mochaFile=results/results.xml"'
            }
            post {
                always {
                    junit 'results/*.xml'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t $DOCKER_IMAGE:$VERSION .
                    docker tag $DOCKER_IMAGE:$VERSION $DOCKER_IMAGE:latest
                """
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $DOCKER_IMAGE:$VERSION
                        docker push $DOCKER_IMAGE:latest
                    """
                }
            }
        }

        stage('Deploy to Testing (Auto)') {
            steps {
                sh "npx cypress run --config baseUrl=$TESTING_URL"
            }
        }
    }

    post {
        failure {
            echo "CD failed ❌"
        }
        success {
            echo "CD completed automatically ✅"
        }
    }
}