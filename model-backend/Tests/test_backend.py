# to run the example is here : inside model-backend run pytest Tests/ -v

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import backend  # Now this should work
import pytest
from fastapi.testclient import TestClient
from backend import app

client = TestClient(app)

# Sample input expected by the API
sample_passenger = {
    "Pclass": 2,
    "Sex": 1,
    "Age": 1,
    "Fare": 2,
    "Embarked": 1,
    "Title": 2,
    "IsAlone": 0,
}


@pytest.mark.parametrize(
    "model_name",
    [
        "logistic",
        "KNN",
        "DecisionTree",
        "RandomForest",
        "LinearSVM",
        "SVM",
        "NaiveBayes",
        "Perceptron",
        "SGD",
    ],
)
def test_all_models(model_name):
    response = client.post(f"/predict/{model_name}", json=sample_passenger)
    if response.status_code == 404:
        pytest.skip(f"{model_name} not available")
    else:
        assert response.status_code == 200
        data = response.json()
        assert data["model"] == model_name
        assert isinstance(data["survived"], bool)
        assert "probability_of_survival" in data
