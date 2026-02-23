pipeline {
    agent any

    environment {
        CYPRESS_RECORD_KEY = credentials('record-key-buggy-cars-rating')
    }

    stages {

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Run Cypress in Docker') {
            steps {
                bat '''
                docker run --rm ^
                  -v "%cd%:/e2e" ^
                  -w /e2e ^
                  -e CYPRESS_RECORD_KEY ^
                  cypress/included:13.6.0 ^
                  cypress run --record --config video=false,screenshotOnRunFailure=false
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
        }
        success {
            echo 'Build SUCCESS ✅'
        }
        failure {
            echo 'Build FAILED ❌'
        }
    }
}