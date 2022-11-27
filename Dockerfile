FROM oraclelinux:7-slim

RUN yum install -y oracle-nodejs-release-el7 oracle-release-el7
RUN yum -y install nodejs
RUN yum -y install wget
RUN wget https://download.oracle.com/otn_software/linux/instantclient/1917000/oracle-instantclient19.17-basic-19.17.0.0.0-1.x86_64.rpm
RUN yum -y install oracle-instantclient19.17-basic-19.17.0.0.0-1.x86_64.rpm
RUN rm -f oracle-instantclient19.17-basic-19.17.0.0.0-1.x86_64.rpm
#RUN yum-config-manager --disable ol7_developer_nodejs\*
#RUN yum-config-manager --enable ol7_developer_nodejs

#RUN yum install node-oracledb-node*
RUN rm -rf /var/cache/yum/*


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

EXPOSE 5000
CMD [ "node", "index.js" ]
