FROM node:18-alpine

WORKDIR /usr/src/app

RUN npm install -g vite

COPY client ./client

WORKDIR /usr/src/app/client

RUN if [ -f package.json ]; then npm install; fi

ENV NODE_ENV=development
EXPOSE 5174

CMD ["npm", "run", "dev"]
