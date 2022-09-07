FROM oraclelinux:7-slim

RUN yum -y install oracle-nodejs-release-el7 oracle-instantclient-release-el7 && \
    yum-config-manager --disable ol7_developer_nodejs\* && \
    yum-config-manager --enable ol7_developer_nodejs16 && \
    yum -y install nodejs node-oracledb-node16 && \
    rm -rf /var/cache/yum/*

ENV NODE_PATH=/usr/lib/node_modules/

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

#ENV ORACLE_HOME=/opt/oracle
#ENV LD_LIBRARY_PATH=/opt/oracle
ENV TNS_ADMIN=/usr/src/app/config
ENV NLS_LANG=AMERICAN_AMERICA.UTF8

EXPOSE 5050
CMD [ "node", "index.js" ]

