#!/bin/bash

if [ -n "$SNAKE_DIR" ] && [ "$SNAKE_DIR" != "$PWD" ]
then
	cd $SNAKE_DIR
fi

if [ -e ./server.js ]
then
	node ./server.js > ./run-server.log
else
	echo "You need to open the SNAKE directory and run this command from there again"
fi