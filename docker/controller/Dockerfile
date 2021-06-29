FROM node:10.24.1-alpine

WORKDIR /usr/src/app

ADD package*.json ./
ADD nodemon.json ./

ADD src ./src

RUN npm i
RUN npm install dotenv --global

USER node