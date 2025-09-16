FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build        

FROM caddy:latest
COPY --from=builder /app/dist /srv/frontend
