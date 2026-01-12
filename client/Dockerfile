FROM node:18-alpine
WORKDIR /usr/src/app/client
COPY client/package.json ./ 
COPY client/package-lock.json* ./
RUN npm ci
COPY client/. .
EXPOSE 5174
CMD ["npm","run","dev"]
