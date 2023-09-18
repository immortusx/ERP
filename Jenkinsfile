pipeline {
  agent any
  parameters {
      string defaultValue: '3000', description: 'Choose custom port for client', name: 'PORT_client'
      string defaultValue: '2223', description: 'Choose custom port for server', name: 'PORT_server'
  }  
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    DOCKERHUB_CREDENTIALS_1 = credentials('dockerhub-1')
    DOCKERHUB_CREDENTIALS_2 = credentials('dockerhub-2')
  }
  
  stages {    
    stage('Build Images') {
      steps {
        parallel(
          build_client: {
            sh 'docker build ./client/ -t raptor1702/client:latest'
          },
          build_server: {
            sh 'docker build ./server/ -t raptor2103/server:latest'
          }          
        )
      }
    }
    stage('Push client image') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_1_PSW | docker login -u $DOCKERHUB_CREDENTIALS_1_USR --password-stdin'
        sh 'docker push raptor1702/client:latest'
      }
    }
    stage('Logout') {
      steps {
        sh 'docker logout'
      }
    }
    stage('Push server image') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_2_PSW | docker login -u $DOCKERHUB_CREDENTIALS_2_USR --password-stdin'
        sh 'docker push raptor2103/server:latest'
      }
    }
    stage('Remove Current Images') {
      steps {
        parallel(
          remove_client: {
            catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS'){
              sh 'docker rm $(docker ps -a -f name=client_img) -f'
              sh 'sleep 5s' 
            }
          },
          remove_server: {
            catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS'){
              sh 'docker rm $(docker ps -a -f name=server_img) -f'
              sh 'sleep 5s'
            }
          }          
        )
      }
    }    
    stage('Run Images') {
      steps {
        sh 'docker run -d --name client_img --network host --env PORT=${PORT_client} raptor1702/client:latest'
        sh 'docker run -d --name server_img --network host --env ENV_PORT=${PORT_server} raptor2103/server:latest'
      }
    }
  }
  post {
    always {
      sh 'docker logout'
    }
  }
}