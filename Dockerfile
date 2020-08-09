FROM node:12.18.3-alpine

WORKDIR /web
COPY ./pop-booking-web/package.json ./
COPY ./pop-booking-web/yarn.lock ./
COPY ./pop-booking-web/.snyk ./

RUN yarn global add snyk@1.370.1

RUN yarn install

ENV PATH="/web/node_modules/.bin:${PATH}"

#not necessary if running with a volume
COPY ./pop-booking-web/ .

CMD ["yarn", "run", "build"]

FROM maven:3.6.3-jdk-14

WORKDIR /api
COPY ./pop-booking-api/pom.xml ./

RUN mvn dependency:resolve

COPY ./pop-booking-api/ ./
CMD mvn package -P 'Production, Copy react app'

