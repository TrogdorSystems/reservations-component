FROM node:9.9.0
RUN mkdir /reservations

WORKDIR /reservations

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081
CMD ["node", "./server/nodeServer.js"]
