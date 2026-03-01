pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "joh4444n/buggy-cars-cypress"
        VERSION = "${BUILD_NUMBER}"
        TESTING_URL = "https://buggy.justtestit.org/"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Run Cypress Tests (Docker)') {
            steps {
                sh '''
                docker run --rm \
                  -v $PWD:/e2e \
                  -w /e2e \
                  cypress/included:13.6.0 \
                  npx cypress run \
                  --reporter junit \
                  --reporter-options "mochaFile=results/results.xml"
                '''
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
                sh '''
                docker run --rm \
                  -v $PWD:/e2e \
                  -w /e2e \
                  cypress/included:13.6.0 \
                  npx cypress run --config baseUrl=$TESTING_URL
                '''
            }
        }
    }

    post {
        success {
            echo "CD completed automatically ✅"
        }
        failure {
            echo "CD failed ❌"
        }
    }
}