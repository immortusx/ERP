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
    stage('Build Client') {
      steps {
        sh 'docker build ./client/ -t raptor1702/client:latest '
      }
    }
    stage('Login docker & push client image') {
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
    stage('Build Server') {
      steps {
        sh 'docker build ./server/ -t raptor2103/server:latest '
      }
    }
    stage('Login Docker and push server image') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_2_PSW | docker login -u $DOCKERHUB_CREDENTIALS_2_USR --password-stdin'
        sh 'docker push raptor2103/server:latest'
      }
    }
    // stage('Remove Existng Docker Containers') {
    //   steps{
    //     catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
    //       sh 'docker rm $(docker ps -a -f name=client_img) -f && sleep 2s'
    //       sh 'docker rm $(docker ps -a -f name=server_img) -f && sleep 2s'
    //     }  
    //   }
    // }
    stage('Run Client Image') {
      steps {
        sh 'docker rm $(docker ps -a -f name=client_img) -f'
        sh 'sleep 5s'
        sh 'docker run -d --name client_img --network host --env PORT=${PORT_client} raptor1702/client:latest'
      }
    }
    stage('Run Server Image') {
      steps {
        sh 'docker rm $(docker ps -a -f name=server_img) -f'
        sh 'sleep 5s'
        sh 'docker run -d --name server_img --network host --env PORT=${PORT_server} raptor2103/server:latest'
      }
    }    

  }
  post {
    always {
      sh 'docker logout'
    }
  }
}