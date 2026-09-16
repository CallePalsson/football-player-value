from pathlib import Path
from typing import Any

import joblib
import pandas as pd

from app.schemas import PlayerValuationRequest

MODEL_PATH = Path(__file__).resolve().parents[2] / "models" / "player_value_model.joblib"


class ModelNotLoadedError(RuntimeError):
    pass


class ModelService:
    def __init__(self, model_path: Path = MODEL_PATH) -> None:
        self.model_path = model_path
        self._model: Any | None = None

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    def load(self) -> None:
        if not self.model_path.exists():
            self._model = None
            return

        self._model = joblib.load(self.model_path)

    def predict(self, player: PlayerValuationRequest) -> float:
        if self._model is None:
            raise ModelNotLoadedError(
                "Modellen är inte laddad. Lägg den i "
                "models/player_value_model.joblib och starta om backend."
            )

        features = pd.DataFrame(
            [
                {
                    "goals": player.goals,
                    "assists": player.assists,
                    "league": player.league,
                    "position": player.position,
                    "games": player.games,
                    "age": player.age,
                }
            ]
        )

        prediction = self._model.predict(features)[0]
        return max(0.0, float(prediction))


model_service = ModelService()
