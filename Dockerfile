FROM node:10.15.3

# Create a new folder
RUN mkdir -p /usr/src/ac 

WORKDIR /usr/src/ac 

COPY package.json /usr/src/ac/ 
RUN npm install 
COPY . /usr/src/ac 

EXPOSE 5000
EXPOSE 5001

ENTRYPOINT  npm run build && npm start
