pipeline {
    agent {
        docker {
            image 'cypress/included:13.6.0'
            args '-u root'
        }
    }

    environment {
        CYPRESS_RECORD_KEY = credentials('record-key-buggy-cars-rating')
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Cypress Tests') {
            steps {
                sh 'npx cypress run --record --parallel'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'cypress/videos/**, cypress/screenshots/**', allowEmptyArchive: true
        }
        success {
            echo 'Build successful ✅'
        }
        failure {
            echo 'Build failed ❌'
        }
    }
}