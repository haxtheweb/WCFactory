FROM node:10

ENV YARN_VERSION 1.10.1

RUN set -ex \
  && for key in \
    6A010C5166006599AA17F08146C2130DFD2497F5 \
  ; do \
    gpg --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys "$key" || \
    gpg --keyserver hkp://ipv4.pool.sks-keyservers.net --recv-keys "$key" || \
    gpg --keyserver hkp://pgp.mit.edu:80 --recv-keys "$key" ; \
  done \
  && curl -fsSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
  && curl -fsSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz.asc" \
  && gpg --batch --verify yarn-v$YARN_VERSION.tar.gz.asc yarn-v$YARN_VERSION.tar.gz \
  && mkdir -p /opt \
  && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
  && ln -sf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
  && ln -sf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
  && rm yarn-v$YARN_VERSION.tar.gz.asc yarn-v$YARN_VERSION.tar.gz

# Copy package dependencies
WORKDIR /home/node/html
COPY package.json package.json
COPY lerna.json lerna.json
COPY packages/cli/package.json /home/node/html/packages/cli/package.json
COPY packages/generator-wcfactory/package.json /home/node/html/packages/generator-wcfactory/package.json

# Install workspaces
WORKDIR /home/node/html
RUN yarn

# Link cli globally
WORKDIR /home/node/html/packages/cli
RUN yarn link

# Copy over remaining packages
WORKDIR /home/node/html
COPY . .

# Default to a tmp directory for volume mounting
WORKDIR /home/node/tmp

ENTRYPOINT [ "wcf" ]
