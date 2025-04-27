pipeline{
    agent any
    tools {
        nodejs "nodejs-22-6-0"
    }
    environment {
        docker_registry = 'iamroyalreddy/fusion-fe'
        DOCKERHUB_CREDENTIALS = credentials('docker-credentials')
        packageJsonVersion = ''
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
        stage('Install Dependencies'){
            steps{
                dir('/var/lib/jenkins/workspace/project-build-frontend'){
                    sh '''
                        npm install --no-audit
                    '''
                }
            }
        }
        
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
                dir('/var/lib/jenkins/workspace/project-build-frontend'){
                    dependencyCheck additionalArguments: '''
                    --scan \\\'./\\\' 
                    --out \\\'./\\\'  
                    --format \\\'ALL\\\' 
                    --prettyPrint''', nvdCredentialsId: 'NVD-access', odcInstallation: 'OWASP-DepCheck-10'
                }
            }
        }            


        // stage('Build and Package'){
        //     steps{
        //         dir('/var/lib/jenkins/workspace/project-build-frontend'){
        //             sh '''
        //                 npm install --no-audit
        //                 ng build --configuration=production
        //             '''
        //         }
        //     }
        // }

        // stage('containerization') {
        //     steps {
        //         script {
        //             def imageTag = "${docker_registry}:${packageJsonVersion}"
        //             echo "Building Docker image with tag: ${imageTag}"
        //             sh "docker build -t ${imageTag} ."
        //         }
        //     }
        // }

        // stage('Publish Docker Image') {
        //     steps {
        //         sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
        //         sh "docker push $docker_registry:$packageJsonVersion"
        //     }       
        // }

        // stage('Archive Image Version') {
        //     steps {
        //         archiveArtifacts artifacts: 'image-version.txt', onlyIfSuccessful: true
        //     }
        // }
    }
}