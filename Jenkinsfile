pipeline {
    agent any

    environment {
        CYPRESS_RECORD_KEY = credentials('record-key-buggy-cars-rating')
    }

    stages {
        stage('Install deps') {
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
                  cypress/included:13.6.0
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'cypress/videos/**,cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}