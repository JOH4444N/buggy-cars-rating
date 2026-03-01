pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "tuusuario/buggy-cars-cypress"
        VERSION = "${env.BUILD_NUMBER}"
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
                sh 'npx cypress run'
            }
            post {
                always {
                    junit '**/results/*.xml'
                }
            }
        }

        stage('Build Docker Image') {
            when {
                branch 'main'
            }
            steps {
                sh "docker build -t $DOCKER_IMAGE:$VERSION ."
            }
        }

        stage('Push Docker Image') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $DOCKER_IMAGE:$VERSION
                    """
                }
            }
        }

        stage('Approval for Production') {
            when {
                branch 'main'
            }
            steps {
                input message: "Deploy tests to Production environment?", ok: "Approve"
            }
        }

        stage('Run Against Production') {
            when {
                branch 'main'
            }
            steps {
                sh 'npx cypress run --config baseUrl=https://produccion.com'
            }
        }
    }
}