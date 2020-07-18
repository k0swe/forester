### STAGE 1: Build ###
FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build-prod

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY src/assets/test.json /usr/share/nginx/html/assets/test.json
COPY --from=build /usr/src/app/dist/k0s-log /usr/share/nginx/html
