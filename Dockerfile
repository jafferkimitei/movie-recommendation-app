FROM node:20-bookworm-slim

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]