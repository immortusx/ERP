pipeline {
  agent any
    parameters {
      string (defaultValue: 'dev', description: 'Branch', name: 'BRANCH')
      string (defaultValue: '3000', description: 'Choose custom port for client', name: 'PORT')
      string (defaultValue: '2223', description: 'Choose custom port for server', name: 'ENV_PORT')
      string (defaultValue: '95.216.144.126', description: 'Choose Host', name: 'ENV_HOST')
      string (defaultValue: 'vehical_crm_db', description: 'Choose Database for server', name: 'ENV_DATABASE')
      string (defaultValue: 'https://dev.balkrushna.com', description: 'Choose react app node url', name: 'REACT_APP_NODE_URL')
      string (defaultValue: "dev", description: 'Build Tag', name: 'BUILD_TAG')
      booleanParam(name: 'skip_app_building', defaultValue: false, description: 'Set to true to skip Apk building')
    }  
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    DOCKERHUB_CREDENTIALS_1 = credentials('dockerhub-1')
    DOCKERHUB_CREDENTIALS_2 = credentials('dockerhub-2')
  }
  
  stages {
    stage('Defining Stage...') {
      steps {
        execute_stage('Build Android APP', params.skip_app_building)

      }
    }
     stage('Build Images') {
      steps {
        parallel(
          build_client: {
            sh "docker build ./client/ -t raptor1702/client:${BUILD_TAG}"
          },
          build_server: {
            sh "docker build --build-arg WORKSPACE=${WORKSPACE} ./server/ -t raptor2103/server:${BUILD_TAG}"
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

        catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS'){
          sh 'docker stop $(docker ps -aqf name=client_img-${BUILD_TAG}) && docker rm $(docker ps -aqf name=client_img-${BUILD_TAG}) && docker stop $(docker ps -aqf name=server_img-${BUILD_TAG}) && docker rm $(docker ps -aqf name=server_img-${BUILD_TAG})'
          sh 'sleep 10s'
        }
                  
      }
    }    
    stage('Run Images') {
      steps {
        sh "docker run --restart unless-stopped --name server_img-${BUILD_TAG} --network host -e ENV_PORT=${ENV_PORT} -e ENV_DATABASE=${ENV_DATABASE} -e ENV_HOST=${ENV_HOST} -d raptor2103/server:${BUILD_TAG}"
        sh "docker run --restart unless-stopped --name client_img-${BUILD_TAG} --network host -e PORT=${PORT} -e REACT_APP_NODE_URL=${REACT_APP_NODE_URL} -d raptor1702/client:${BUILD_TAG} "
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

def execute_stage(stage_name, skip) {
    stage(stage_name) {
        if(skip) {
            echo "Skipping ${stage_name} stage"
            return
        }
        sh 'cd ${WORKSPACE}/Vehicle_app && npm install'
        sh 'export ANDROID_HOME=$HOME/android/sdk'
        sh 'export PATH=$ANDROID_HOME/cmdline-tools/tools/bin/:$PATH'
        sh 'export PATH=$ANDROID_HOME/emulator/:$PATH'
        sh 'export PATH=$ANDROID_HOME/platform-tools/:$PATH'
        sh 'cd ${WORKSPACE}/Vehicle_app/android && ./gradlew clean assembleRelease'
        sh 'cd ../..'
        sh 'cp ${WORKSPACE}/Vehicle_app/android/app/build/outputs/apk/release/app-release.apk ${WORKSPACE}/server/'
    }
}
