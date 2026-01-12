FROM node:18-alpine AS deps
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

FROM node:18-alpine AS runner
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
EXPOSE 4000
CMD ["npm", "run", "server"]
