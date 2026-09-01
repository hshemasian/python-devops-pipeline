# 🚀 Python DevOps Pipeline

A end-to-end Python Flask web application containerized with **Docker**, automated via **Jenkins**, and deployed to **Kubernetes** using **Helm**.

---

## 📁 Project Structure

```text
.
├── Dockerfile              # Instructions to build the Docker image
├── Jenkinsfile             # CI/CD pipeline configuration
├── README.md               # Project documentation
├── app.py                  # Main Python Flask application
├── requirements.txt        # Python dependencies
└── chart/                  # Helm chart definitions
    ├── Chart.yaml
    ├── values.yaml
    └── templates/
        ├── deployment.yaml
        ├── service.yaml
        ├── ingress.yaml
        └── _helpers.tpl
🐳 Docker Commands
1. Build the Docker Image
Bash
docker build -t hillel456/python-devops-pipeline:latest .
2. Push Image to Docker Hub
Bash
docker push hillel456/python-devops-pipeline:latest
☸️ Kubernetes & Helm Deployment
1. Lint the Helm Chart
Verify that the chart syntax and structure are correct:

Bash
helm lint chart
2. Install / Upgrade the Chart
Deploy the application to your Kubernetes cluster:

Bash
helm install python-devops-pipeline chart
If you make changes to the chart or values later, run:

Bash
helm upgrade python-devops-pipeline chart
3. Verify Deployment
Ensure all pods and services are running:

Bash
kubectl get all
🌐 How to Access the App
Forward local port 5000 to the deployed Kubernetes Service:

Bash
kubectl port-forward svc/python-devops-pipeline 5000:5000
Open your web browser and navigate to:
👉 http://localhost:5000