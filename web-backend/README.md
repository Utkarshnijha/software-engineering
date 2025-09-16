# Temp Repo Navi
[Docker Compose](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/docker-compose)

[Model Backend](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/model-backend)

[Project Management](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/project-management)

[Web Backend](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/web-backend)

[Web Frontend](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/web-frontend)

# student-repo
 
This repository was created for you as part of a course project. You are required to use this project for any course work and contact 
the lecturer in case you encounter any problems with the settings and configuration of the project.

Any code or related work done in other, self-created Gitlab projects is **not considered for grading**.


## Web Backend Requirements

- The web backend code shall be written in the **Python** programming language using **FastAPI**¹¹ as the framework.
- **Unit and Integration tests** for all Python code shall be written using the **pytest** framework¹².

## Web Backend

- This is the **Web Backend** of the Titanic AI web application. It handles user authentication, session management, history tracking, and communication with the internal Model Backend service to perform survival predictions.

---

##  Programming Language & Framework

- **Language**: Python 
- **Framework**: FastAPI for building RESTful APIs

---

## Responsibilities

- User registration and login via JWT-based authentication
- Securing access to advanced prediction features
- Managing user history 
- Admin functionality
- Acting as the internal gateway between frontend and model backend

---

## Containerization Behavior

The Web Backend is fully containerized and managed via Docker Compose. It communicates with the Model Backend and Database containers over a shared Docker network.

---

##  API Security

- All endpoints requiring authentication are protected via JWT.
- Admin-only endpoints are restricted via user role flags.
- The backend itself is accessible externally but communicates securely with internal services only.

---

## Installation (Local Dev)

```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # Or `venv\\Scripts\\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI backend
uvicorn app.main:app --reload
```
- All testing will be done by pytest
- Test types include:
    - Unit tests for utility and logic components
    - Integration tests for database and API routes

## Usage 
- Anonymous users can select one model and use the survival calculator.

- Logged-in users can:

   - Choose multiple models

   - See prediction results in real time

   - View history of last 10 predictions
