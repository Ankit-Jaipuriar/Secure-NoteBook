FROM node:18

WORKDIR /app
COPY BACKEND/package*.json ./
RUN npm install
COPY ./BACKEND/ .
EXPOSE 5000
CMD ["npm", "start"]
