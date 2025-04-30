pipeline{
    agent any
    tools {
        nodejs "nodejs-22-6-0"
    }
    environment {
        docker_registry = 'iamroyalreddy/fusion-fe'
        DOCKERHUB_CREDENTIALS = credentials('docker-credentials')
        packageJsonVersion = ''
        imageTag = ''
    }
    parameters {
        booleanParam(name: 'CodeAnalysisDependencyCheck', defaultValue: false, description: 'is it required Code Analysis and Dependency Check')
        // choice(name: 'DeployToStage', choices: ['yes', 'no'], description: 'is it required Deploy to stage')
    }
    stages{
        stage('Read JSON') {
            steps {
                script {
                    def packageJson = readJSON file: 'package.json'
                    packageJsonVersion = packageJson.version
                    writeFile file: 'image-version.txt', text: packageJsonVersion
                    echo "${packageJsonVersion}"
                }
            }
        }
        stage('Build and Package'){
            steps{
                dir('/var/lib/jenkins/workspace/project-build-frontend'){
                    sh '''
                        npm install --no-audit
                        ng build --configuration=production
                    '''
                }
            }
        }
        stage('Code Analysis and Testing'){
             when {
                expression{
                    params.CodeAnalysisDependencyCheck == true
                }
            }
            parallel{
                stage('NPM Dependency Audit') {
                    steps {
                        sh '''
                            npm audit --audit-level=critical
                            echo $?
                        '''
                    }
                }
                
                stage('OWASP Dependency Check') {
                    steps {
                            withCredentials([string(credentialsId: 'NVD-access', variable: 'NVD_API_KEY')]) {
                                dependencyCheck additionalArguments: """
                                    --scan ./ 
                                    --out ./  
                                    --format ALL 
                                    --disableYarnAudit
                                    --prettyPrint
                                    --noupdate                                    
                                """, odcInstallation: 'OWASP-DepCheck-10'
                               dependencyCheckPublisher failedTotalCritical: 1, pattern: 'dependency-check-report.xml', stopBuild: false
                        }
                    }
                }
  

                stage('Unit Testing'){
                    steps{
                        sh 'sleep 5s'
                    }
                }

                stage ("SAST - SonarQube") {
                    // currently skip test cases
                    steps {
                            sh 'sleep 5s'
                        // script {
                        //     withSonarQubeEnv('sonarqube') {
                        //         withCredentials([string(credentialsId: 'sonar-credentials', variable: 'SONAR_TOKEN')]){
                        //             withEnv(["PATH+SONAR=$SONAR_SCANNER_HOME/bin"]) {
                        //                 sh '''
                        //                     mvn clean verify sonar:sonar -DskipTests \
                        //                         -Dsonar.projectKey=fusion-be \
                        //                         -Dsonar.projectName='fusion-be' \
                        //                         -Dsonar.host.url=$SONAR_HOST_URL \
                        //                         -Dsonar.token=$SONAR_TOKEN
                        //                 '''
                        //             }
                        //         }
                        //     }
                        // }
                    }
                }
            }
        }

        stage('containerization') {
            steps {
                script {
                    imageTag = "${docker_registry}:${packageJsonVersion}"
                    // EXISTING_IMAGE=$(docker images -q $imageTag)
                    //     if [ ! -z "$EXISTING_IMAGE" ]; then
                    //         echo "previous build Image '$IMAGE_NAME' found. Removing..."
                    //         docker rmi -f $EXISTING_IMAGE
                    //         echo "previous build image is removed."
                    //     else
                    //         echo "No existing image found for '$IMAGE_NAME'."
                    //     fi
                    echo "Building Docker image with tag: ${imageTag}"
                    sh "docker build -t ${imageTag} ."
                }
            }
        }

        stage('Trivy Vulnerability Scanner') {
            steps {
                sh  """
                    trivy image $imageTag \
                        --severity LOW,MEDIUM,HIGH \
                        --exit-code 0 \
                        --quiet \
                        --format json -o trivy-image-MEDIUM-results.json

                    trivy image $imageTag \
                        --severity CRITICAL \
                        --exit-code 1 \
                        --quiet \
                        --format json -o trivy-image-CRITICAL-results.json || true
                """
            }
             post {
                always {
                    sh '''
                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                            --output trivy-image-MEDIUM-results.html trivy-image-MEDIUM-results.json 

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                            --output trivy-image-CRITICAL-results.html trivy-image-CRITICAL-results.json

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
                            --output trivy-image-MEDIUM-results.xml  trivy-image-MEDIUM-results.json 

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
                            --output trivy-image-CRITICAL-results.xml trivy-image-CRITICAL-results.json          
                    '''
                }
            }
        }


        stage('Publish Docker Image') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh "docker push $docker_registry:$packageJsonVersion"
            }       
        }

        stage('Archive Image Version') {
            steps {
                archiveArtifacts artifacts: 'image-version.txt', onlyIfSuccessful: true
            }
        }
    }

    post { 
        always { 
            junit allowEmptyResults: true, stdioRetention: '', testResults: 'dependency-check-junit.xml' 
            junit allowEmptyResults: true, stdioRetention: '', testResults: 'trivy-image-CRITICAL-results.xml'
            junit allowEmptyResults: true, stdioRetention: '', testResults: 'trivy-image-MEDIUM-results.xml'            
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependency Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'trivy-image-CRITICAL-results.html', reportName: 'Trivy Image Critical Vul Report', reportTitles: '', useWrapperFileDirectly: true])
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'trivy-image-MEDIUM-results.html', reportName: 'Trivy Image Medium Vul Report', reportTitles: '', useWrapperFileDirectly: true])
            echo "\033[34mJob completed. Cleaning up workspace...\033[0m"
            deleteDir()
        }
        success {
            echo "\033[33mPipeline completed successfully. Performing success actions...\033[0m"
            // Add additional actions here if needed, like sending success notifications
        }
        failure { 
            echo "\033[35mPipeline failed. Triggering failure response...\033[0m"
            // send notification
        }
        unstable {
            echo "\033[34mPipeline marked as unstable. Reviewing issues...\033[0m"
            // Send notification or take action for unstable builds, if needed
        }
        aborted {
            echo "\033[33mPipeline was aborted. Clearing any partial artifacts...\033[0m"
            // Any specific actions for aborted jobs
        }
    }
}