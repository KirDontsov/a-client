# Docker Setup for Vue.js Application

This project is containerized using Docker and Docker Compose. Follow these instructions to run the application using Docker.

## Prerequisites

- Docker Engine (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

To build and run the application:

```bash
docker-compose up -d
```

The application will be accessible at `http://localhost:3001`

## Building the Image

To build the Docker image manually:

```bash
docker build -t vue-app .
```

## Running with Docker Compose

To start the application:

```bash
docker-compose up -d
```

To stop the application:

```bash
docker-compose down
```

To view logs:

```bash
docker-compose logs -f
```

## Configuration

The application is configured with the following:

- Nginx serves the built Vue.js application
- Port 8080 is exposed on the host machine
- Environment variables can be passed using the .env file

## Architecture

The Docker setup uses a multi-stage build process:

1. **Build Stage**: Uses Node.js 20-alpine to install dependencies and build the Vue.js application
2. **Serve Stage**: Uses Nginx to serve the built application

## Troubleshooting

- If you encounter issues with the build, make sure you have the .yarnrc.yml file and the .yarn directory
- Ensure that port 8080 is available on your host machine
- Check logs with `docker-compose logs` if the application doesn't start correctly