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
CMD ["serve", "-s", "build"]
