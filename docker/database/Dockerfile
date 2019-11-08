FROM node:10.15.3-alpine

WORKDIR /usr/src/app

ADD package*.json ./

RUN npm run build:database
