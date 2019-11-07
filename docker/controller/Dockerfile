FROM node:10.15.3-alpine

WORKDIR /home/node/app
ADD package*.json ./
ADD nodemon.json ./

ADD src ./src

RUN npm i
RUN npm run build:database
RUN npm install dotenv --global

USER node