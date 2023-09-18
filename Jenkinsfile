pipeline {
  agent any
  parameters {
      string defaultValue: '3000', description: 'Choose custom port', name: 'port'
  }  
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    DOCKERHUB_CREDENTIALS_1 = credentials('dockerhub-1')
    DOCKERHUB_CREDENTIALS_2 = credentials('dockerhub-2')
  }
  
  stages {
    stage('Checkout Repo') {
      steps {
        checkout scm
      }
    }
    stage('Check port') {
      steps {
        sh 'export PORT=${port} '
        echo "port set to ${port} "
      }
    }    
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
  }
  post {
    always {
      sh 'docker logout'
    }
  }
}