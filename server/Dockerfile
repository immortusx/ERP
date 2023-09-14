FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./server
WORKDIR /usr/src/app/server
#RUN npm run build
CMD ["node", "index.js"]
