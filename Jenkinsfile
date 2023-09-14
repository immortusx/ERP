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
    // stage('Get Source') {
    //   steps {
    //     sh ' git clone https://x-token-auth:ATCTT3xFfGN0LjLLCuVkZBrwucG29DfOgUpNzjueYhenVQILMSm2fmKw2gY7R48BHxxqnVVRCtKOai0KMaTtxWKGlag0hG1EfDVIPiPMZ2idD-3a7y3tNEoTsdUgdrufKtUaBp7o7HuNXWgWv_n4C4DXNiLV7snaY2vs4mw8mACOQs4YV0b9oAE=FE9E4BE5@bitbucket.org/balkrushnatechnologies-admin/vehicle-erp-system.git && cd vehicle-erp-deployment/ '
    //   }
    // }
    stage('Build Client') {
      steps {
        sh 'docker build ./client/ -t raptor1702/client:latest '
      }
    }
    stage('Login-1') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_1_PSW | docker login -u $DOCKERHUB_CREDENTIALS_1_USR --password-stdin'
      }
    }
    stage('Push-1') {
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
    stage('Login-2') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_2_PSW | docker login -u $DOCKERHUB_CREDENTIALS_2_USR --password-stdin'
      }
    }    
    stage('Push-2') {
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