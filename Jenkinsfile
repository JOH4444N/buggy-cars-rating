pipeline {
    agent any

    options {
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        REPO_URL = 'https://github.com/JOH4444N/buggy-cars-rating.git'
        CYPRESS_BASE_URL = 'https://buggy.justtestit.org/'
        WORKSPACE_PATH = '/var/jenkins_home/workspace/buggy-cars-rating'
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'CYPRESS_INSTALL_BINARY=0 npm install'
            }
        }

        stage('Run Cypress Tests Parallel') {

            steps {
                script {

                    withCredentials([string(credentialsId: 'cypress_cloud', variable: 'CYPRESS_KEY')]) {

                        parallel(

                            "Runner 1": {

                                sh """
                                    docker run --rm \
                                      -v jenkins_home:/var/jenkins_home \
                                      -w ${WORKSPACE_PATH} \
                                      -e CYPRESS_baseUrl=${CYPRESS_BASE_URL} \
                                      cypress/included:15.9.0 \
                                      --record \
                                      --key ${CYPRESS_KEY} \
                                      --parallel \
                                      --ci-build-id ${BUILD_NUMBER} \
                                      --headless \
                                      --browser electron
                                """

                            },

                            "Runner 2": {

                                sh """
                                    docker run --rm \
                                      -v jenkins_home:/var/jenkins_home \
                                      -w ${WORKSPACE_PATH} \
                                      -e CYPRESS_baseUrl=${CYPRESS_BASE_URL} \
                                      cypress/included:15.9.0 \
                                      --record \
                                      --key ${CYPRESS_KEY} \
                                      --parallel \
                                      --ci-build-id ${BUILD_NUMBER} \
                                      --headless \
                                      --browser electron
                                """

                            }

                        )

                    }

                }
            }
        }

        stage('Generate Mochawesome Report') {
            steps {
                sh '''
                    npm run report:merge
                    npm run report:generate
                '''
            }
        }

        stage('Publish Report to GitHub Pages') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-credentials',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_PASS'
                )]) {
                    sh '''
                        rm -rf /tmp/reports
                        cp -r cypress/reports /tmp/reports

                        git config user.email "jenkins@local"
                        git config user.name "Jenkins"

                        git checkout --orphan reports || git checkout reports
                        git rm -rf . || true

                        cp /tmp/reports/index.html .
                        cp -r /tmp/reports/assets .

                        echo "<!-- Generated: $(date) | Build: ${BUILD_NUMBER} -->" >> index.html

                        echo "node_modules/" > .gitignore
                        echo "cypress/" >> .gitignore
                        echo "reports/" >> .gitignore

                        git add -A
                        git commit -m "Test Report - Build #${BUILD_NUMBER}" || true

                        git push --force https://${GIT_USER}:${GIT_PASS}@${REPO_URL#https://} reports
                    '''
                }
            }
        }
    }

    post {

        always {

            archiveArtifacts artifacts: 'cypress/screenshots/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'cypress/videos/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'cypress/reports/**', allowEmptyArchive: true

            echo "🔗 Reporte disponible en:"
            echo "https://joh4444n.github.io/buggy-cars-rating/"
        }

        success {
            echo "✅ Todos los tests pasaron"
        }

        failure {
            echo "❌ Algunos tests fallaron - revisar reporte"
        }
    }
}