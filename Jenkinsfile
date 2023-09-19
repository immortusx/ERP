pipeline {
  agent any
    parameters {
      string (defaultValue: '3000', description: 'Choose custom port for client', name: 'PORT')
      string (defaultValue: '2223', description: 'Choose custom port for server', name: 'ENV_PORT')
      string (defaultValue: '95.216.144.126', description: 'Choose Host', name: 'ENV_HOST')
      string (defaultValue: 'vehical_crm_db', description: 'Choose Database for server', name: 'ENV_DATABASE')
      string (defaultValue: 'https://dev.balkrushna.com', description: 'Choose react app node url', name: 'REACT_APP_NODE_URL')
      string (defaultValue: "latest", description: 'Build Tag', name: 'BUILD_TAG')
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
            sh "docker build ./client/ -t raptor1702/client:${BUILD_TAG}"
          },
          build_server: {
            sh "docker build ./server/ -t raptor2103/server:${BUILD_TAG}"
          }          
        )
      }
    }
    stage('Push client image') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_1_PSW | docker login -u $DOCKERHUB_CREDENTIALS_1_USR --password-stdin'
        sh "docker push raptor1702/client:${BUILD_TAG}"
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
        sh "docker push raptor2103/server:${BUILD_TAG}"
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
        sh "docker-compose up -d"
        sh 'sleep 1m'
      }
    }
  }
  post {
    always {
      sh 'docker logout'
    }
  }
}