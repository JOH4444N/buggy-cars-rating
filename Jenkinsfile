pipeline {
    agent any

    environment {
        GIT_CREDENTIALS_ID = 'github-credentials' 
        REPO_URL = 'https://github.com/JOH4444N/buggy-cars-rating.git'
    }

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Tests & Generate Report') {
            steps {
                bat 'npm run test:report'
            }
        }

        stage('Publish Report to reports branch') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${GIT_CREDENTIALS_ID}",
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_PASS'
                )]) {

                    bat '''
                    git config user.email "jenkins@local"
                    git config user.name "Jenkins"

                    git checkout --orphan reports
                    git rm -rf .
                    git clean -fdx

                    xcopy cypress\\reports\\index.html index.html*

                    git add index.html
                    git commit -m "Automated test report"

                    git push --force https://%GIT_USER%:%GIT_PASS%@github.com/JOH4444N/buggy-cars-rating.git reports
                    '''
                }
            }
        }
    }
}