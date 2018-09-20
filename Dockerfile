FROM node:8



# Cache stuff
WORKDIR /local-npm
ADD . /local-npm/

RUN groupadd -r local-npm --gid=999 \
    && useradd -r -g local-npm --uid=999 local-npm

RUN npm set progress=false && npm install --no-color && npm dedupe

EXPOSE 5080
EXPOSE 16984

VOLUME /data

ENV BASE_URL='http://127.0.0.1:5080'
ENV DATA_DIRECTORY='/data'
ENV REMOTE_REGISTRY='https://registry.npmjs.org'
ENV REMOTE_REGISTRY_SKIMDB='https://skimdb.npmjs.com/registry'

CMD mkdir -p "$DATA_DIRECTORY" chmod 700 "$DATA_DIRECTORY" \
    && chown -R local-npm "$DATA_DIRECTORY" \
    && npm start -- --remote $REMOTE_REGISTRY \
        --remote-skim $REMOTE_REGISTRY_SKIMDB --directory $DATA_DIRECTORY \
        --url-base $BASE_URL


# Setup node user
USER node
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin


# Install Globals
WORKDIR /home/node/html/
RUN npm install pm2 -g
RUN npm install local-npm -g

# Set up local npm for caching npm calls
WORKDIR /home/node/html/
COPY package.json package.json
RUN pm2 start local-npm
RUN npm install

# # Copy package dependencies
# WORKDIR /home/node/html
# COPY packages/cli/package.json /home/node/html/packages/cli/package.json
# COPY packages/generator-wcfactory/package.json /home/node/html/packages/generator-wcfactory/package.json

# # Now we are going to install all of the generators dependecies / weird I know but this will allow
# # The containers to be cached and save the npm install wait for the user
# WORKDIR /home/node/html/packages/generator-wcfactory/init/templates
# COPY packages/generator-wcfactory/generators/init/templates/package.json package.json
# RUN npm install

# # Copy over remaining packages
# WORKDIR /home/node/html
# COPY . .

# # Lerna bootstrap
# WORKDIR /home/node/html
# COPY lerna.json lerna.json
# RUN npm run bootstrap

# # Make local packages available globally
# WORKDIR /home/node/html/node_modules/lerna
# RUN npm link
# WORKDIR /home/node/html/packages/cli
# RUN npm link


# WORKDIR /home/node/html/local

# # Copy everything over
# ENTRYPOINT [ "bash" ]