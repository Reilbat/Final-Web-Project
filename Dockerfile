FROM node:latest

# Create app directory
WORKDIR /usr/app/ n


# Install app dependencies
COPY package*.json ./
COPY nodemon.json ./
COPY tsconfig.json ./

RUN npm install

# Bundle app source
COPY ./src ./src
COPY ./test ./test
VOLUME ["/usr/app/src"]


EXPOSE 3000
CMD [ "npm", "run", "dev" ]
