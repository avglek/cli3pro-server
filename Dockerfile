FROM node:16

WORKDIR /opt/oracle

RUN apt-get update
RUN apt-get install -y libaio1 unzip wget
RUN wget https://download.oracle.com/otn_software/linux/instantclient/1917000/instantclient-basic-linux.x64-19.17.0.0.0dbru.zip
RUN unzip instantclient-basic-linux.x64-19.17.0.0.0dbru.zip
RUN rm -f instantclient-basic-linux.x64-19.17.0.0.0dbru.zip

RUN cd instantclient*

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

EXPOSE 5000
CMD [ "node", "index.js" ]
