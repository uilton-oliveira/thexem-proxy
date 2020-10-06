FROM node:14-alpine
WORKDIR /thexem

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

#RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 3000
VOLUME /thexem/config

CMD [ "npm", "start" ]