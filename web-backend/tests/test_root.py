from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_available():
    res = client.get("/api/health")
    assert res.status_code == 200
