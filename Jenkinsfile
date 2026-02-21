pipeline {
    agent none // Cada stage define su propio agente

    environment {
        REPO_URL = 'https://github.com/JOH4444N/buggy-cars-rating.git'
    }

    stages {

        stage('Parallel Cypress Tests') {
            parallel {

                stage('Cypress Agent 1') {
                    agent { label 'cypress1' }
                    steps {
                        // Usar credenciales seguras para GitHub y Cypress Cloud
                        withCredentials([
                            string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN'),
                            string(credentialsId: 'record-key-buggy-cars-rating', variable: 'CYPRESS_RECORD_KEY')
                        ]) {
                            // Descargar repo
                            git url: "${REPO_URL}", branch: 'main', credentialsId: 'github-token'

                            // Instalar dependencias
                            bat 'npm ci'

                            // Ejecutar tests en paralelo con Cypress Cloud
                            bat "npx cypress run --record --key %CYPRESS_RECORD_KEY% --parallel"
                        }
                    }
                }

                stage('Cypress Agent 2') {
                    agent { label 'cypress2' }
                    steps {
                        withCredentials([
                            string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN'),
                            string(credentialsId: 'record-key-buggy-cars-rating', variable: 'CYPRESS_RECORD_KEY')
                        ]) {
                            git url: "${REPO_URL}", branch: 'main', credentialsId: 'github-token'
                            bat 'npm ci'
                            bat "npx cypress run --record --key %CYPRESS_RECORD_KEY% --parallel"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            // Guardar artifacts de Cypress
            archiveArtifacts artifacts: 'cypress/videos/**/*, cypress/screenshots/**/*', allowEmptyArchive: true
        }
        success {
            echo 'Build successful! ✅'
        }
        failure {
            echo 'Build failed ❌'
        }
    }
}