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

        stage('Run Tests') {
            steps {
                sh '''
                    rm -rf cypress/reports
                    mkdir -p cypress/reports

                    docker run --rm \
                      -v jenkins_home:/var/jenkins_home \
                      -w ${WORKSPACE_PATH} \
                      -e CYPRESS_baseUrl=${CYPRESS_BASE_URL} \
                      cypress/included:15.9.0 \
                      --headless \
                      --browser electron \
                      --reporter ${WORKSPACE_PATH}/node_modules/mochawesome \
                      --reporter-options "reportDir=cypress/reports,overwrite=false,html=false,json=true"
                    echo $? > /tmp/cypress_exit_code

                    docker run --rm \
                      -v jenkins_home:/var/jenkins_home \
                      busybox \
                      chown -R 1000:1000 ${WORKSPACE_PATH}/cypress/reports
                '''
            }
        }

        stage('Generate Report') {
            steps {
                sh '''
                    npm run report:merge
                    npm run report:generate
                '''
            }
        }

        stage('Publish Report') {
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
                        git commit -m "Report - Build #${BUILD_NUMBER} - $(date '+%Y-%m-%d %H:%M')" || true

                        git push --force https://${GIT_USER}:${GIT_PASS}@${REPO_URL#https://} reports

                        exit $(cat /tmp/cypress_exit_code)
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline exitoso - Todos los tests pasaron"
        }
        failure {
            echo "❌ Pipeline fallido - Revisar tests o logs"
        }
        always {
            echo "🔗 Reporte: https://joh4444n.github.io/buggy-cars-rating/"
        }
    }
}