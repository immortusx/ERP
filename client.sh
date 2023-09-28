#!/bin/bash

# Set the name pattern and BUILD_TAG variable for the client container
CLIENT_NAME_PATTERN="client_img-${BUILD_TAG}"

# Check if the client container exists
if [ -n "$(docker ps -q -a -f name=$CLIENT_NAME_PATTERN)" ]; then
  # Stop and remove the client container
  docker stop $(docker ps -q -a -f name=$CLIENT_NAME_PATTERN)
  docker rm $(docker ps -q -a -f name=$CLIENT_NAME_PATTERN)
  echo "Client container with name pattern $CLIENT_NAME_PATTERN stopped and removed."
else
  echo "Client container with name pattern $CLIENT_NAME_PATTERN not found. Script not executed."
fi

