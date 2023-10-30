pipeline {
  agent any
    parameters {
      string (defaultValue: 'dev', description: 'Branch', name: 'BRANCH')
      string (defaultValue: '3000', description: 'Choose custom port for client', name: 'PORT')
      string (defaultValue: '2223', description: 'Choose custom port for server', name: 'ENV_PORT')
      string (defaultValue: '95.216.144.126', description: 'Choose Host', name: 'ENV_HOST')
      string (defaultValue: 'vehical_crm_db', description: 'Choose Database for server', name: 'ENV_DATABASE')
      string (defaultValue: 'https://dev.balkrushna.com', description: 'Choose react app node url', name: 'REACT_APP_NODE_URL')
      editableChoice(defaultValue: 'dev',name: 'BUILD_TAG',choices: ['winners-capital', 'newkeshav', 'crm'], description: 'Build Tag',restrict: true,filterConfig: filterConfig(prefix: true, caseInsensitive: false))
      //string (defaultValue: "dev", description: 'Build Tag', name: 'BUILD_TAG')
      string (defaultValue: "Vehicle_crm", description: 'App Name', name: 'APP_NAME')
      booleanParam(name: 'skip_app_building', defaultValue: false, description: 'Set to true to skip Apk building')
    }  
  options {
    skipDefaultCheckout true
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  // environment {
  //   DOCKERHUB_CREDENTIALS_1 = credentials('dockerhub-1')
  //   DOCKERHUB_CREDENTIALS_2 = credentials('dockerhub-2')
  // }
  
  stages {
    stage('SCM Checkout') {
      steps {
        checkout scm
      }
    }    
    stage('Defining Stage...') {
      steps {
        execute_stage('Build Android APP', params.skip_app_building)

      }
    }
     stage('Build Images') {
      steps {
        parallel(
          build_client: {
            sh "echo REACT_APP_NODE_URL = ${REACT_APP_NODE_URL} > client/.env"
            sh "docker build ./client/ -t raptor1702/client:${BUILD_TAG}"
          },
          build_server: {
            sh "docker build --build-arg WORKSPACE=${WORKSPACE} ./server/ -t raptor2103/server:${BUILD_TAG}"
          }          
        )
      }
    }
    // stage('Push client image') {
    //   steps {
    //     sh 'echo $DOCKERHUB_CREDENTIALS_1_PSW | docker login -u $DOCKERHUB_CREDENTIALS_1_USR --password-stdin'
    //     sh "docker push <username-1>/client:${BUILD_TAG}"
    //   }
    // }
    // stage('Logout') {
    //   steps {
    //     sh 'docker logout'
    //   }
    // }
    // stage('Push server image') {
    //   steps {
    //     sh 'echo $DOCKERHUB_CREDENTIALS_2_PSW | docker login -u $DOCKERHUB_CREDENTIALS_2_USR --password-stdin'
    //     sh "docker push <username-2>/server:${BUILD_TAG}"
    //   }
    // }


    /*To enable the functionality of pushing the docker images to dockerhub repository. Uncomment the three stages above and post action of docker logout at the end of jenkins commands
      And you add dockerhub username in place of <username-1> & <username-2>. Also set up the jenkins credentials to according to your username and password. !*/


    stage('Remove Current Images') {
      steps {

        catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS'){
          //sh 'docker stop $(docker ps -aqf name=client_img-${BUILD_TAG}) && docker rm $(docker ps -aqf name=client_img-${BUILD_TAG}) && docker stop $(docker ps -aqf name=server_img-${BUILD_TAG}) && docker rm $(docker ps -aqf name=server_img-${BUILD_TAG})'
          sh "bash client.sh"
          sh "bash server.sh"
          sh 'sleep 10s'
        }
                  
      }
    }    
    stage('Run Images') {
      steps {
        sh "COMPOSE_PROJECT_NAME=${BUILD_TAG} docker-compose up -d"
        //sh "docker run --restart unless-stopped --name server_img-${BUILD_TAG} --network host -v /home/jenkins/upload/${BUILD_TAG}:/usr/src/app/server/upload -e BUILD_TAG=${BUILD_TAG} -e BUILD_ID=${BUILD_ID} -e ENV_PORT=${ENV_PORT} -e ENV_DATABASE=${ENV_DATABASE} -e ENV_HOST=${ENV_HOST} -d raptor2103/server:${BUILD_TAG}"
        //sh "docker run --restart unless-stopped --name client_img-${BUILD_TAG} --network host -e PORT=${PORT} -e REACT_APP_NODE_URL=${REACT_APP_NODE_URL} -d raptor1702/client:${BUILD_TAG} "
        sh 'sleep 7s'
      }
    }
  }
  post {
    always {
      // sh 'docker logout'
      catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS'){
        sh 'docker image prune  -f'
        sh "sudo rm -rf ${WORKSPACE}" 
      }
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
        sh "export BUILD_ID=${BUILD_ID}"
        sh "echo 'API_URL=${REACT_APP_NODE_URL}' > ${WORKSPACE}/Vehicle_app/.env"
        sh "cd ${WORKSPACE}/Vehicle_app && sudo chmod +x package-name.sh && sudo chmod +x app-name.sh"
        sh "cd ${WORKSPACE}/Vehicle_app && sudo sh ./package-name.sh com.${BUILD_TAG}"
        sh "cd ${WORKSPACE}/Vehicle_app && sudo sh ./app-name.sh \"${APP_NAME}\""
        sh "sudo chmod +x insert-version-name.sh"
        sh "bash insert-version-name.sh"
        sh "sudo mv ${WORKSPACE}/Vehicle_app/android/app/src/main/java/com/vehicle_crm ${WORKSPACE}/Vehicle_app/android/app/src/main/java/com/${BUILD_TAG}"
        sh "sudo mv ${WORKSPACE}/Vehicle_app/android/app/src/release/java/com/vehicle_crm ${WORKSPACE}/Vehicle_app/android/app/src/release/java/com/${BUILD_TAG}"
        sh "cd ${WORKSPACE}/Vehicle_app/android && sudo ./gradlew --stop"
        sh "cd ${WORKSPACE}/Vehicle_app/android && sudo ./gradlew clean assembleRelease"
        sh 'cd ../..'
        sh 'cp ${WORKSPACE}/Vehicle_app/android/app/build/outputs/apk/release/app-release.apk ${WORKSPACE}/server/'
    }
}
