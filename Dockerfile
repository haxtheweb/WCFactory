FROM node:10

# Install Lerna globally
WORKDIR /home/node/html/
COPY package.json package.json
RUN npm install

# Copy package dependencies
COPY packages/cli/package.json /home/node/html/packages/cli/package.json
COPY packages/generator-rhelement/package.json /home/node/html/packages/generator-rhelement/package.json

# Lerna bootstrap
WORKDIR /home/node/html
COPY lerna.json lerna.json
RUN npm run bootstrap

# Copy over remaining packages
COPY packages /home/node/html/packages

# Copy everything over
ENTRYPOINT [ "bash" ]