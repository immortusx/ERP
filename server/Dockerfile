FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./server
COPY /var/lib/jenkins/workspace/vehicle-crm/Vehicle_app/android/app/build/outputs/apk/release/app-release.apk ./server
WORKDIR /usr/src/app/server
EXPOSE $PORT
CMD ["node", "index.js"]
