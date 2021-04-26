#!/bin/bash
unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN:${unameOut}"
esac

install () {
	yarn global add symlink-dir
	yarn global add @wcfactory/cli
	yarn global add polymer-cli
	yarn global add lerna
	yarn global add web-component-analyzer 
	yarn global add http-server
}

# make sure node is installed
if ! command -v node;then
	echo "Install node and npm first then re-run script"
	echo "Go to https://nodejs.org/en/download/ to download and install"
	exit
fi

# if yarn isn't installed install it
if ! command -v yarn;then
	npm -g install yarn
fi

if [ "${machine}" == "Cygwin" ]; then
	git config --global core.autocrlf true
	install
elif [ "${machine}" == "MinGw" ]; then
	git config --global core.autocrlf true
	install
else
	install
fi