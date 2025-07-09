FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN chmod +x node_modules/.bin/next

COPY . .

RUN npm run build

FROM node:18-slim

WORKDIR /app

COPY --from=builder /app ./

RUN npm install --omit=dev

EXPOSE 80
ENV NODE_ENV=production
ENV PORT=80

CMD ["npm", "start"]

