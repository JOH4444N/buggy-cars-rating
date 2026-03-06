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
                sh '''
                    rm -f mochawesome*.json report.json
                    rm -rf cypress/reports
                    mkdir -p cypress/reports

                    docker run --rm \
                      -v jenkins_home:/var/jenkins_home \
                      -w /var/jenkins_home/workspace/buggy-cars-rating \
                      -e CYPRESS_baseUrl=https://buggy.justtestit.org/ \
                      cypress/included:15.9.0 \
                      --headless \
                      --browser electron \
                      --reporter /var/jenkins_home/workspace/buggy-cars-rating/node_modules/mochawesome \
                      --reporter-options "reportDir=cypress/reports,overwrite=false,html=false,json=true" || true

                    docker run --rm \
                      -v jenkins_home:/var/jenkins_home \
                      busybox \
                      chown -R 1000:1000 /var/jenkins_home/workspace/buggy-cars-rating/cypress/reports

                    npm run report:merge
                    npm run report:generate
                '''
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
                        cp -r cypress/reports /tmp/reports

                        git config user.email "jenkins@local"
                        git config user.name "Jenkins"

                        git checkout --orphan reports || git checkout reports
                        git rm -rf . || true

                        cp -r /tmp/reports/index.html .
                        cp -r /tmp/reports/assets .

                        echo "<!-- $(date) -->" >> index.html

                        echo "node_modules/" > .gitignore
                        echo "cypress/" >> .gitignore
                        echo "reports/" >> .gitignore

                        git add -A
                        git commit -m "Automated test report $(date)" || true

                        git push --force https://${GIT_USER}:${GIT_PASS}@github.com/JOH4444N/buggy-cars-rating.git reports
                    '''
                }
            }
        }
    }
}