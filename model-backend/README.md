# Temp Repo Navi
[Docker Compose](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/docker-compose)

[Model Backend](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/model-backend)

[Project Management](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/project-management)

[Web Backend](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/web-backend)

[Web Frontend](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/web-frontend)

# Model Backend

* **Programming Language & Framework:** Python with FastAPI for the RESTful API.
* **Prediction Model Inference:** Accessible via a RESTful API within the Docker network.
* **Provided Models:**
    * Exact implementation from the proof-of-concept notebook.
    * At least the following base algorithms: Random Forest, Decision Tree, KNN, Support Vector Machines, and Logistic Regression.
    * Default model training features: Survived, Pclass, Sex, Age, Fare, Embarked, Title, IsAlone, Age\*Class.
    * Metadata (name, used features, algorithm) for each trained model stored in a database table.
* **Container Startup Behavior:**
    * **First Start:** All default models are trained and saved as Pickle files.
    * **Subsequent Starts:** Existing Pickle files are loaded from disk.
* **Custom Models:** Any models trained by an admin user are persisted across container re-creation.
* **API Security:** The prediction model service API is inaccessible from outside the Docker network.
* **Testing:** Unit and Integration tests for all Python code are written using the pytest framework.

## For Calculator

Pclass: int (1,2,3)
Sex: int ("female": 1, "male": 0)
Age: int (0-100, x <=16: 0, 16<x<= 32: 1, 32<x<= 48: 2, 48<x<= 64: 3, above the age stands)
Fare: int (0-500 x<= 7.91: 0, 7.91<x<= 14.454: 1, 14.454<x<= 31: 2, x>31: 3)
Embarked: int ("S": 0, "C": 1, "Q": 2)
Title: int ("Mr": 1, "Miss": 2, "Mrs": 3, "Master": 4, "Rare": 5)
IsAlone: int (0 = alone, 1 = with family)


## Run

```bash
python main.py
```

## Installation

```bash 
python -m venv 
\Scripts\activate  # activate
pip install -r requirements.txt
```

## Usage

This Model Backend provides a prediction service accessible within a Docker network. Here's a breakdown of its usage:
* **Accessing the Prediction API:** Other services or containers within the same Docker network can interact with the prediction models via the defined RESTful API endpoints. The specific endpoints and request/response formats would be documented separately (e.g., in an API specification).
* **Default Model Predictions:** Upon successful deployment and container startup, the default models (Random Forest, Decision Tree, KNN, SVM, Logistic Regression, trained on the specified features) are immediately available for making predictions.
* **Custom Model Training (Admin User):** An administrative user can train and persist new prediction models beyond the defaults. These custom models will remain available even after the container is restarted. The mechanism for triggering this training and specifying model parameters would be defined (e.g., a separate API endpoint or command-line interface within the container).
* **Model Management (Implicit):** The system internally manages the trained models, storing their metadata in a database and the model files as Pickle files. Users primarily interact with the prediction API and the custom model training functionality (if available).
* **Testing:** The codebase includes comprehensive unit and integration tests (written with pytest) to ensure the reliability and correctness of the backend logic. These tests are typically run during development and as part of a CI/CD pipeline.
**In essence, the primary usage involves sending prediction requests to the API within the Docker network and potentially utilizing administrative functions to train and manage custom models.**. 

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)


# student-repo
 
This repository was created for you as part of a course project. You are required to use this project for any course work and contact 
the lecturer in case you encounter any problems with the settings and configuration of the project.

Any code or related work done in other, self-created Gitlab projects is **not considered for grading**.

## Model Backend requirements

- The model backend code shall be written in the Python programming language using **FastAPI** as the framework for the RESTful API.
- The prediction model inference shall be accessible via a **RESTful API**¹³ within the **Docker network**.
- The provided models shall use the exact implementation from the **proof-of-concept notebook**¹⁴:
  - At least the following base algorithms are available:
    - Random Forest
    - Decision Tree
    - K-Nearest Neighbors (KNN)
    - Support Vector Machines (SVM)
    - Logistic Regression
  - The following features from the notebook are used for the default model training:
    - `Survived`, `Pclass`, `Sex`, `Age`, `Fare`, `Embarked`, `Title`, `IsAlone`, `Age*Class`
  - For each available trained model, the **name**, **used features**, and **algorithm** is stored in a **database table**.
- On **first start** of the container:
  - All default models shall be trained and stored as **Pickle files**¹⁵.
- On **subsequent start-ups** of the container:
  - The existing Pickle files are loaded from **disk**¹⁶.
- Any additional trained models by an **admin user** are persisted over container re-creation.
- The prediction model service API shall be **inaccessible from outside** the Docker network.
- **Unit and Integration tests** for all Python code shall be written using the **pytest** framework¹⁷.


