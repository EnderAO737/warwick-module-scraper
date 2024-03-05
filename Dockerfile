FROM node:current-alpine
WORKDIR /app
COPY . .
ENTRYPOINT [ "node", "index.js" ]