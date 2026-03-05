stage('Publish Report to reports branch') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: 'github-credentials',
            usernameVariable: 'GIT_USER',
            passwordVariable: 'GIT_PASS'
        )]) {
            sh '''
                cp -r cypress/reports /tmp/reports

                git config user.email "jenkins@local"
                git config user.name "Jenkins"

                git checkout --orphan reports || git checkout reports
                git rm -rf . || true

                cp -r /tmp/reports/. .

                git add .
                git commit -m "Automated test report" || true

                git push --force https://${GIT_USER}:${GIT_PASS}@github.com/JOH4444N/buggy-cars-rating.git reports
            '''
        }
    }
}