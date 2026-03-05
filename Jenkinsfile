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
                    docker run --rm \
                      -v jenkins_home:/var/jenkins_home \
                      -w /var/jenkins_home/workspace/buggy-cars-rating \
                      -e CYPRESS_baseUrl=https://buggy.justtestit.org/ \
                      cypress/included:15.9.0 \
                      --headless \
                      --browser chrome || true

                    docker run --rm \
                      -v jenkins_home:/var/jenkins_home \
                      busybox \
                      chown -R 1000:1000 /var/jenkins_home/workspace/buggy-cars-rating/cypress/reports

                    npm run report:merge
                    npm run report:generate
                '''
            }
        }

                stage('Run Tests & Generate Report') {
            steps {
                sh '''
                    rm -rf cypress/reports
                    mkdir -p cypress/reports

                    docker run --rm \
                    -v jenkins_home:/var/jenkins_home \
                    -w /var/jenkins_home/workspace/buggy-cars-rating \
                    -e CYPRESS_baseUrl=https://buggy.justtestit.org/ \
                    cypress/included:15.9.0 \
                    --headless \
                    --browser electron || true

                    docker run --rm \
                    -v jenkins_home:/var/jenkins_home \
                    busybox \
                    chown -R 1000:1000 /var/jenkins_home/workspace/buggy-cars-rating/cypress/reports

                    npm run report:merge
                    npm run report:generate
                '''
            }
        }
    }
}