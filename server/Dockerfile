FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
ENV BUILD_ID=$BUILD_ID
ARG WORKSPACE
COPY . ./server
WORKDIR /usr/src/app/server
RUN echo "BUILD_ID= $BUILD_ID" >> .env
EXPOSE $PORT
CMD ["node", "index.js"]
