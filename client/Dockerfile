# client/Dockerfile
FROM node:18-alpine AS deps
WORKDIR /usr/src/app
COPY client/package.json client/package-lock.json* ./ 
RUN npm ci

FROM node:18-alpine AS dev
WORKDIR /usr/src/app
ENV NODE_ENV=development
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY client/. .
EXPOSE 5174
# Start Vite dev server on port 5174
CMD ["npm", "run", "dev"]
