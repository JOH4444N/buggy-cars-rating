pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests & Generate Report') {
            steps {
                sh 'npm run test:report'
            }
        }

        stage('Publish Report to reports branch') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-credentials',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_PASS'
                )]) {

                    sh '''
                    git config user.email "jenkins@local"
                    git config user.name "Jenkins"

                    git checkout --orphan reports || true
                    git rm -rf . || true

                    cp cypress/reports/index.html index.html

                    git add index.html
                    git commit -m "Automated test report" || true

                    git push --force https://${GIT_USER}:${GIT_PASS}@github.com/JOH444N/buggy-cars-rating.git reports
                    '''
                }
            }
        }
    }
}