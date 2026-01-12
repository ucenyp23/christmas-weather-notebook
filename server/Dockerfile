FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --only=production

COPY . .

ENV NODE_ENV=production
EXPOSE 4000

CMD ["npm", "run", "server"]
