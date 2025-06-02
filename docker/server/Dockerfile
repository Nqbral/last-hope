FROM node:slim

WORKDIR /home

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./workspaces/server ./workspaces/server
COPY ./workspaces/shared ./workspaces/shared

EXPOSE 3000

RUN yarn install

CMD ["yarn", "start:prod:server"]