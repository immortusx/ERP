#!/bin/bash

# Define your Docker Compose YAML file
COMPOSE_FILE="docker-compose.yml"
CLIENT_NAME_PATTERN="client_img-${BUILD_TAG}"
SERVER_NAME_PATTERN="server_img-${BUILD_TAG}"

# Check if the containers are already created and stopped
if [ "$(docker ps -q -a -f name=$CLIENT_NAME_PATTERN)" && "$(docker ps -q -a -f name=$SERVER_NAME_PATTERN)" -gt 0 ]; then
  # There are existing stopped containers, so use "docker-compose start"
  echo "Starting existing stopped containers..."
  docker-compose start
else
  # No existing stopped containers, use "docker-compose up"
  echo "No existing stopped containers found. Creating and starting new containers..."
  docker-compose up -d
fi
