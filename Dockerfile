FROM alpine:latest
MAINTAINER Luzian Zagadinow
LABEL Name=luzi/authenticator Version=1.0.0
ENV NODE_ENV production
ENV SERVICENAME authenticator
ENV PORT 80
COPY package.json /app/package.json
COPY build /app/build
COPY src/sql /app/src/sql
RUN apk add --update nodejs
WORKDIR /app
RUN npm install --production
RUN mkdir -p /app/data
RUN node build/scripts/init
EXPOSE $PORT
CMD npm start