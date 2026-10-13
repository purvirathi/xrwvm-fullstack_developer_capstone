FROM node:20.20.2-bullseye-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY app.js ./
COPY data ./data

EXPOSE 3030

CMD ["node", "app.js"]
