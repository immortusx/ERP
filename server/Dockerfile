FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
ENV BUILD_ID=${BUILD_ID}
ENV BUILD_TAG=${BUILD_TAG}
ARG WORKSPACE
COPY . ./server
WORKDIR /usr/src/app/server
EXPOSE $PORT
CMD ["node", "index.js"]
