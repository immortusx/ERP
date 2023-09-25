FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
ARG WORKSPACE
COPY . ./server
WORKDIR /usr/src/app/server
EXPOSE $PORT
CMD ["node", "index.js"]
