# Containerized Python Application - Step 1

This repository contains a simple Python Flask application running inside a Docker container.

## Project Structure:
- `app.py`: Main Python Flask application.
- `requirements.txt`: Python dependencies (Flask).
- `Dockerfile`: Instructions to build the Docker image.

## How to Build and Run:
1. Build the Docker image:
   `docker build . -t YOURNAME`

2. Run the container:
   `docker run -p 5000:5000 YOURNAME`