pipeline{
    agent any
    tools {
        nodejs "nodejs-22-6-0"
    }
    // environment {
    //     docker_registry = 'iamroyalreddy/fusion-fe'
    //     DOCKERHUB_CREDENTIALS = credentials('docker-credentials')
    // }
    stages{
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

        // stage('containerization') {
        //     steps {
        //         script{
        //             sh '''
        //                 EXISTING_IMAGE=$(docker images -q $docker_registry)
        //                 if [ ! -z "$EXISTING_IMAGE" ]; then
        //                     echo "previous build Image '$IMAGE_NAME' found. Removing..."
        //                     docker rmi -f $EXISTING_IMAGE
        //                     echo "previous build image is removed."
        //                 else
        //                     echo "No existing image found for '$IMAGE_NAME'."
        //                 fi
        //                 docker build -t $docker_registry:$GIT_COMMIT .
        //             '''
        //         }
        //     }
        // }

        // stage('Publish Docker Image') {
        //     steps {
        //         sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
        //         sh "docker push $docker_registry:$GIT_COMMIT"
        //     }       
        // }
    }
}