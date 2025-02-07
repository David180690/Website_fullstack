#!/bin/bash

DOCKER_USERNAME="david8bullet"
services=(
  "frontend:./Dockerfile.frontend"
  "backend:./Dockerfile.server"
  "backend-python:./Dockerfile.python"
  "upload-service:./Dockerfile.upload"
)

for service in "${services[@]}"; do
  IFS=":" read -r service_name dockerfile <<< "$service"

  echo "Building image for $service_name using $dockerfile..."
  if ! docker build -t "$DOCKER_USERNAME/$service_name:latest" -f "$dockerfile" .; then
    echo "Error: Failed to build image for $service_name. Exiting..."
    exit 1
  fi

  echo "Pushing $DOCKER_USERNAME/$service_name:latest to Docker Hub..."
  if ! docker push "$DOCKER_USERNAME/$service_name:latest"; then
    echo "Error: Failed to push image for $service_name. Exiting..."
    exit 1
  fi

  echo "Successfully built and pushed $service_name!"
  echo "--------------------------------------"
done

echo "All images have been successfully built and pushed!"
