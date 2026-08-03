# 🐳 Containerized Python Application

A simple Python web application built using **Flask** and running inside a **Docker** container.

---

## 📁 Project Structure

- `app.py`: Main Python Flask application code.
- `requirements.txt`: List of Python dependencies (`Flask`).
- `Dockerfile`: Instructions to build the Docker image.
- `README.md`: Project documentation and setup instructions.

---

## 🚀 How to Build and Run

### 1. Build the Docker Image
To build the Docker image from the Dockerfile, open your terminal in the project directory and run:
```bash
docker build -t hshemasian-app .
```

### 2. Run the Container
To start the container and map port 5000 on your machine to port 5000 inside the container, run:
```bash
docker run -p 5000:5000 hshemasian-app
```

---

## 🌐 How to Access the App

Once the container is running, open your web browser and go to:
👉 **http://localhost:5000**

You should see the message from the Python app running inside the container!

---

## 📌 Useful Docker Commands

| Command | Description |
| :--- | :--- |
| `docker build -t hshemasian-app .` | Builds the project Docker image |
| `docker run -p 5000:5000 hshemasian-app` | Runs the container and maps port 5000 |
| `docker ps` | Shows all currently running containers |
| `docker stop <CONTAINER_ID>` | Stops a running container |

---

## 👤 Author
* **Hillel Hai Shemasian** - [GitHub Profile](https://github.com/hshemasian)