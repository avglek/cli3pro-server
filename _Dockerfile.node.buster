#FROM node:18-alpine

# for oracle client
FROM node:buster-slim

WORKDIR /opt/oracle

RUN apt-get update
RUN apt-get install -y libaio1 unzip wget
RUN wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip
RUN unzip instantclient-basiclite-linuxx64.zip
RUN rm -f instantclient-basiclite-linuxx64.zip
RUN cd instantclient*
RUN rm -f *jdbc* *occi* *mysql* *jar uidrvci genezi adrci
RUN echo /opt/oracle/instantclient* > /etc/ld.so.conf.d/oracle-instantclient.conf
RUN ldconfig

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

ENV ORACLE_HOME=/opt/oracle
ENV LD_LIBRARY_PATH=/opt/oracle
ENV TNS_ADMIN=/usr/src/app/config
ENV NLS_LANG=AMERICAN_AMERICA.UTF8

EXPOSE 5050
CMD [ "node", "index.js" ]
