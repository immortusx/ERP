<h1 align="center" id="title">CI/CD pipeline using Jenkins</h1>

<p id="description">Deploy a NodeJs and MySQL based application using CI/CD pipelines</p>

<p align="center"><img src="https://img.shields.io/badge/Documentation-8A2BE2" alt="shields"></p>

<h2>🛠️ Jenkins Installation Steps:</h2>

<p>1. Download Repo</p>

```
sudo wget -O /etc/yum.repos.d/jenkins.repo \     https://pkg.jenkins.io/redhat-stable/jenkins.repo
```

<p>2. Add key to PATH</p>

```
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
```

<p>3. Update</p>

```
sudo yum upgrade
```

<p>4. Install Java</p>

```
sudo yum install java-17-openjdk
```

<p>5. Install Jenkins server</p>

```
sudo yum install jenkins
```

<p>6. Reload daemon</p>

```
sudo systemctl daemon-reload
```

<h2>🛠️ Jenkins Setup </h2>

<p>1. Now that jenkins is running on your system. You need to enable it aand start it to keep it always running</p>

```
sudo systemctl enable jenkins
sudo systemctl start jenkins
```

<p>2. Check Status of Jenkins service</p>

```
sudo systemctl status jenkins
```

<p>3. If everything is installed correctly. Then output would be somthing like this </p>

```
● jenkins.service - Jenkins Continuous Integration Server
   Loaded: loaded (/usr/lib/systemd/system/jenkins.service; enabled; vendor preset: disabled)
   Active: active (running) since Thu 2023-09-14 06:32:42 UTC; 8sec ago
 Main PID: 32018 (java)
    Tasks: 61
   Memory: 1001.6M
   CGroup: /system.slice/jenkins.service
           └─32018 /usr/bin/java -Djava.awt.headless=true -jar /usr/share/java/jenkins.war --webroot=%C/jenkins/war -...
```

<p>4. By defualt jenkins is installed on port 8080. You can access your Jenkins server like below</p>

```
http://localhost:8080
http://<IP_ADDRESS_OF_MACHINE>:8080
```

__Note: Your may require setting up reverse proxy configuration to access your jenkins from a virtual instance or assigning a custom domain__



<p>5. Unlock Jenkins</p>

Browse to http://localhost:8080 (On your machine OFC). It should look like this

[![53186893665-cfefa18555-b-1.jpg](https://i.postimg.cc/v821qQY7/53186893665-cfefa18555-b-1.jpg)](https://postimg.cc/23v83NB3)

You can get the password by 

```
sudo cat /var/lib/jenkins/secrets/initialAdminPassword 
```
<p>6. Install Plugins and Set admin account by giving username and password</p>

<p>7. Give the jenkins url which is present in the address bar (you can change this in future if you setup custom domain)</p>

<h2>🛠️ Docker Installation Steps:</h2>  

Now that your Jenkins is installed and configured. Lets install docker and docker compose on our machine

<p>1. Add official Repository and download latest version</p>

```
curl -fsSL https://get.docker.com/ | sh
```

<p>2. After installation, enable Docker</p>

```
sudo systemctl start docker
```

<p>3. Check docker status</p>

```
sudo systemctl status docker
```
The output should be like 

```
Output
● docker.service - Docker Application Container Engine
   Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
   Active: active (running) since Thur 2023-09-14 06:53:52 CDT; 5 seconds ago
     Docs: https://docs.docker.com
 Main PID: 749 (docker)

```

<p>5. Make sure docker is running at every reboot</p>

```
sudo systemctl enable docker
```

<p>6. We also need to make sure that docker is running without sudo to allow Jenkins to use docker directly via shell commands and so do jenkins </p>

```
sudo usermod -a -G docker $USER
sudo usermod -a -G jenkins $USER
sudo reboot
```
**Reboot is necessary to update the settings**

<h2>🛠️ How it Works ? 🛠️</h2>

<u><p>1. In the CRM project</p></u>

Inside the project there will be Jenkinsfile, Dockerfile in the folder of client and server. Different for each. And a docker-compose.yml file.
Now let's get into how this things work as we know the path of all the files where they are.

<u><p>2. Let's start with Jenkinsfile</p></u>
Its the heart of the Jenkins pipeline. It's where we define the commands like where and what to do and when to do. But before getting more into jenkinsfile we need to know about of Docker and Dockerfile.


<u><p>3. Docker and Dockerfile</p></u>
Docker containers are lightweight, portable, and provide a consistent environment for applications, making it easier to manage and deploy software across different systems and environments. These containers package an application and its dependencies, ensuring reliable and reproducible deployment. Docker basically creates a isolated environmnet for our application to work independently without getting affected from the outer system. Similar to jenkins, Dockerfile is the heart of the Docker container. It includes all commands required to setup the container.

Let's take a look inside the client Dockerfile

```
#client
FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./client
WORKDIR /usr/src/app/client
RUN npm run build
RUN npm install --global serve
EXPOSE $PORT
CMD ["server", "-s", "build"]
```

```FROM node:18``` This command is the basic command to include when a app uses any type of coding language. So if your app uses python you need to call python. All these basic and major coding languages are already available on dockerhub repository. So using ```FROM node:18``` instals node version 18 inside the container we are going to use.

```WORKDIR``` command defines the working dir of the app and the location inside the container. It can be anything. Any path you want.

Now we need to get all our source file inside the container so we use ```COPY . ./client```. ALSO note that we first used ```COPY package*.json ./``` and ```RUN npm install``` to make sure that we have all the dependencies installed inside the container before we copy the other source code. Once this command executes ```COPY . ./client```,the content of client folder is in /usr/src/app/client. 

Then we use ```RUN npm run build``` to make the build folder and later use it to server the folder using ```CMD ["server", "-s", "build"]```. 

This ```CMD ["server", "-s", "build"]``` command is the trigger point which will execute when we are about to run our container.

**Similary we made Dockerfile for server folder.**

<u><p>4. Back to Jenkinsfile</p></u>

It uses groovy script to execute commands
At first we define all the parameters and their defualt values and also there name, which we will use to call it later.

```
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    DOCKERHUB_CREDENTIALS_1 = credentials('dockerhub-1')
    DOCKERHUB_CREDENTIALS_2 = credentials('dockerhub-2')
  }
```
This sets up and defines how many builds to keep in history and imports credentials for dockerhub private repository which we will use to push our images built using dockerfile for client and server each.

```
  stages {
    stage('SCM checkout') {
      steps {
        checkout scm
      }
    }
```
This clones out project into jenkins workspace. **Note jenkins workspace also has a parameter, which can be called using $WORKSPACE. This is applicable only while using jenkins service**

Jenkins uses Stages to bifergate all the steps needs for a complete successfull build. 

To build Docker images we use ```docker build ./client/ -t raptor1702/client:${BUILD_TAG}``` & 
```docker build --build-arg WORKSPACE=${WORKSPACE} ./server/ -t raptor2103/server:${BUILD_TAG}```.

Now we push our images to dockerhub repo using
```docker push <username>/client:${BUILD_TAG}```. Using credentials from saved credentials
And we use ```docker logout``` to logout and similarly upload server image

Now since this would a first run of clean jenkins and docker and repo setup. There won't be any existing containers. But as we use this to update. We need to search, stop and remove the existing containers to make room for the new one hence we use two scripts to do so the ```client.sh``` & ```server.sh```. This script will gracefully stop and remove the containers.

To learn and understand how the docker images are run let's look into docker-compose.yml file

<u>5. Inside docker-compose.yml</u>

```
version: '3.3'
services:
    server:
        restart: unless-stopped
        container_name: "server_img-${BUILD_TAG}"
        network_mode: host
        volumes:
            - '/upload/${BUILD_TAG}:/usr/src/app/server/upload'
        environment:
            - 'BUILD_TAG=${BUILD_TAG}'
            - 'BUILD_ID=${BUILD_ID}'
            - 'ENV_PORT=${ENV_PORT}'
            - 'ENV_DATABASE=${ENV_DATABASE}'
            - 'ENV_HOST=${ENV_HOST}'
        image: "<username-2>/server:${BUILD_TAG}"
    client:
        restart: unless-stopped
        container_name: "client_img-${BUILD_TAG}"
        network_mode: host
        environment:
            - 'PORT=${PORT}'
            - 'REACT_APP_NODE_URL=${REACT_APP_NODE_URL}'
        image: "<username-1>/client:${BUILD_TAG}"
```

This file defines which container to run. Now the magical thing of docker is that if we don't have the images in local. It will fetch from the dockerhub repository. But here since we had build the image locally and then uploaded to repository we already have the image so docker will use thar instead for now. It is facilated by 
```image: "<username-2>/server:${BUILD_TAG}"``` 

i) To set up the environment we use 

```
environment:
   - 'BUILD_TAG=${BUILD_TAG}'
   - 'BUILD_ID=${BUILD_ID}'
   - 'ENV_PORT=${ENV_PORT}'
   - 'ENV_DATABASE=${ENV_DATABASE}'
   - 'ENV_HOST=${ENV_HOST}'

```
similarly for client image

ii) To create a path between local machine and docker we used

```
volumes:
   - '/upload/${BUILD_TAG}:/usr/src/app/server/upload'
```
This was created to get the user data from the web application and store it inside a static path of our system /upload (rather than storing it inside a container which is not static and can be destroyed on updates)

iii) On error

```restart: unless-stopped``` This will restart our container untill we manually stop it. Else it would stop on getting first error.


iv) Network mode

By defualt docker installs a network driver for docker.service but as we want the apps to be accessible to the internet we use 

```network_mode: host```

```container_name``` : Defines the name for the container and makes it easier for use to navigate and track the containers

<p>6. Once again back to Jenkinsfile</p>

To run the images we created we use ```COMPOSE_PROJECT_NAME=${BUILD_TAG} docker-compose up -d```. This will gracefully run containers

And at last
```
  post {
    always {
      sh 'docker logout'
      catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS'){
        sh "sudo rm -rf ${WORKSPACE}" 
      }
    }
  }
```
This is post declaration stage which will logout from the docker and also clear the jenkins workspace on completion of pipeline run.

<u><p>7. Andoroid app build</p></u>

```
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
        sh "cd ${WORKSPACE}/Vehicle_app && sudo sh ./app-name.sh ${APP_NAME}"
        sh "sudo mv ${WORKSPACE}/Vehicle_app/android/app/src/main/java/com/vehicle_crm ${WORKSPACE}/Vehicle_app/android/app/src/main/java/com/${BUILD_TAG}"
        sh "sudo mv ${WORKSPACE}/Vehicle_app/android/app/src/release/java/com/vehicle_crm ${WORKSPACE}/Vehicle_app/android/app/src/release/java/com/${BUILD_TAG}"
        sh "cd ${WORKSPACE}/Vehicle_app/android && sudo ./gradlew --stop"
        sh "cd ${WORKSPACE}/Vehicle_app/android && sudo ./gradlew clean assembleRelease"
        sh 'cd ../..'
        sh 'cp ${WORKSPACE}/Vehicle_app/android/app/build/outputs/apk/release/app-release.apk ${WORKSPACE}/server/'
    }
}

```
This function defines whether to run the android compilation, based on the params passed before building. These commands used in android app build are just sh commands and it complies the android project using gradlew and copies it inside the server folder just before the dockerfile for server is copying the files into the container. So out apk will be packed within server folder and can be used to download later.

**That's it for the CI/CD tools !**

**Note: We have edited the main source code slightly to make it work with docker and jenkins**
 <h2>Main code changes</h2>

__<p>1. Index.js</p>__

```
app.get('/api/download', (req, res) => {
  const fileName = `Vehicle-ERP-${moment().format("YYYYMMDD")}-${process.env.BUILD_TAG}-${process.env.BUILD_ID}.apk`;
  const filePath = path.join(__dirname, 'server', 'app-release.apk'); // Assuming your server folder is in the same directory as your script

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist, send plain text response with error
      console.error('Application not found');
      res.status(404).send('Application not found');
      return;
    }

    // File exists, set headers and send the file
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    res.sendFile(filePath, (err) => {
      if (err) {
        // Handle any errors here, like 500 Internal Server Error.
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    });
  });
});

```
Added this snippet into sever/index.js to add an endpoint to download the apk built.

**And Here in the source code the .env files are as useless and indentations in python ;)**

 <h2>💻 Built with</h2>
Technologies used in the project:

*   Jenkins
*   Docker
*   NodeJs
*   ReacJs
*   Shell Script
