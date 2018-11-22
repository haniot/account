# Docker


##  How to install

Follow all the steps present in the [official documentation](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce) starting from the **Install Docker CE** chapter


## Building the project container image


``docker build -t IMAGE_NAME:IMAGE_VERSION DOCKERFILE_PATH``

Example:

``docker build -t haniot-account-service:v0.1 .``

## Executing the project container image

``docker run -p HOST_PORT:CONTAINER_PORT -it IMAGE_NAME:IMAGE_VERSION``

Example:

``docker run -p 80:80 -it haniot-account-service:v0.1``

## Access API


``http://localhost:80/api/v1``




