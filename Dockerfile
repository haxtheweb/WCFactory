FROM node:10

# # Install yarn globally
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# Copy package dependencies
WORKDIR /home/node/html/
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY lerna.json lerna.json
COPY packages/cli/package.json /home/node/html/packages/cli/package.json
COPY packages/generator-wcfactory/package.json /home/node/html/packages/generator-wcfactory/package.json

# Install workspaces
WORKDIR /home/node/html
RUN yarn --pure-lockfile

# Link cli globally
WORKDIR /home/node/html/packages/cli
RUN yarn link

# Copy over remaining packages
WORKDIR /home/node/html
COPY . .

ENTRYPOINT [ "bash" ]