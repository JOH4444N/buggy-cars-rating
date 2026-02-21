pipeline {
    agent none // No usamos agente global

    environment {
        REPO_URL = 'https://github.com/JOH4444N/buggy-cars-rating.git'
    }

    stages {

        stage('Parallel Cypress Tests') {
            parallel {

                stage('Cypress Agent 1') {
                    agent { label 'cypress1' }
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

            } // end parallel
        } // end stage 'Parallel Cypress Tests'

        stage('Archive Artifacts') {
            agent { label 'cypress1' } // cualquier nodo disponible
            steps {
                echo 'Archiving Cypress videos and screenshots...'
                archiveArtifacts artifacts: 'cypress/videos/**/*, cypress/screenshots/**/*', allowEmptyArchive: true
            }
        }

    } // end stages

    post {
        success {
            echo 'Build successful! ✅'
        }
        failure {
            echo 'Build failed ❌'
        }
    }

} // end pipeline