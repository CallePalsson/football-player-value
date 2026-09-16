from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert isinstance(response.json()["model_loaded"], bool)


def test_prediction_validates_input() -> None:
    response = client.post(
        "/api/predict",
        json={
            "goals": -1,
            "assists": 4,
            "league": "Allsvenskan",
            "position": "Forward",
            "games": 20,
            "age": 22,
        },
    )

    assert response.status_code == 422
