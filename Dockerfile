# Download Node image from Docker Hub Repository
FROM node:11.2.0 

# Create a new folder
RUN mkdir -p /usr/src/ac 

WORKDIR /usr/src/ac 

COPY package.json /usr/src/ac/ 
RUN npm install 
COPY . /usr/src/ac 

EXPOSE 80
EXPOSE 443

# ENTRYPOINT  npm run build && npm start 
ENTRYPOINT  npm run build && npm run start:dev
# ENTRYPOINT npm run build && npm run test:integration
# ENTRYPOINT npm run build && npm run test:cov
# ENTRYPOINT npm run build && npm run build:doc
# ENTRYPOINT npm run build && npm run test:unit