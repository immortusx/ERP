#!/bin/bash

# Set the name pattern and BUILD_TAG variable for the server container
SERVER_NAME_PATTERN="server_img-${BUILD_TAG}"

# Check if the server container exists
if [ -n "$(docker ps -q -a -f name=$SERVER_NAME_PATTERN)" ]; then
  # Stop and remove the server container
  docker stop $(docker ps -q -a -f name=$SERVER_NAME_PATTERN)
  docker rm $(docker ps -q -a -f name=$SERVER_NAME_PATTERN)
  echo "Server container with name pattern $SERVER_NAME_PATTERN stopped and removed."
else
  echo "Server container with name pattern $SERVER_NAME_PATTERN not found. Script not executed."
fi

