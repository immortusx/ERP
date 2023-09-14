pipeline {
  agent any
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
    stage('Login client docker') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_1_PSW | docker login -u $DOCKERHUB_CREDENTIALS_1_USR --password-stdin'
      }
    }
    stage('Push client image') {
      steps {
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
    stage('Login Server Docker') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_2_PSW | docker login -u $DOCKERHUB_CREDENTIALS_2_USR --password-stdin'
      }
    }    
    stage('Push server image') {
      steps {
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