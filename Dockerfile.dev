FROM node:10.15.3-alpine

WORKDIR /home/node/app
ADD package*.json ./

RUN npm i
RUN npm run build:database
RUN npm run start:db

USER node