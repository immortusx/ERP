pipeline {
  agent any
  environment {

    // Define your Docker registry credentials
    DOCKER_REGISTRY_CREDENTIALS = credentials('dockerhub')
    // Define the image names and their corresponding Dockerfile paths
    IMAGES = [
        ['client:latest', 'client/Dockerfile'],
        ['server:latest', 'server/Dockerfile']
    ]

  }

  stages {
    stage('Get Source'){
        steps{
            checkout scm
        }
    }

    stage('Build and Push Docker Images') {
        steps {
            script {
                // Login to Docker registry
                docker.withRegistry('https://hub.docker.com', DOCKER_REGISTRY_CREDENTIALS) {
                    // Loop through the list of images and build/push each one
                    for (image in IMAGES) {
                        def imageName = image[0]
                        def dockerfilePath = image[1]

                        // Build and push the Docker image
                        docker.build(imageName, "-f ${dockerfilePath} .").push()
                    }
                }
            }
        }
    }    
    // stage('Docker Build') {
    //   agent any
    //   steps {
    //     script {
    //       dockerImage = docker.build registry + ":latest"
    //     }
    //   }
    // }
    // stage('Push Image') {
    //   steps {
    //     script {
    //       docker.withRegistry('', registryCredential) {
    //         dockerImage.push()
    //       }
    //     }
    //   }
    // }
  }
}