#client
FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./client
WORKDIR /usr/src/app/client
RUN npx update-browserslist-db@latest --yes
RUN npm install -g npm@latest --yes
RUN npm run build
RUN npm install --global serve
EXPOSE $PORT
#RUN echo REACT_APP_NODE_URL = $REACT_APP_NODE_URL > .env
CMD ["serve", "-s", "build"]
