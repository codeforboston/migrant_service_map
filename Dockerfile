# Builds an image to run the migrant services map app
# Run "docker-compose up" and open https://localhost:3000

FROM node:latest

WORKDIR /home/node/app
EXPOSE 3000

COPY package.json /home/node/app
RUN npm install

COPY . /home/node/app
CMD npm start
