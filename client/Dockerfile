#STAGE 1
FROM node:alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

#STAGE 2
FROM nginx:alpine
## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/client /usr/share/nginx/html
EXPOSE 80
