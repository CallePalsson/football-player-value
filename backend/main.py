"""Football player valuation API."""
from pydantic import BaseModel
import joblib 
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from pymongo import MongoClient
import numpy as np
import pandas as pd
import os

# Läs in kolumnnamnen som modellen tränades på så dummies matchar
# (Tips: spara X_train.columns med joblib från notebooken, eller hårdkoda listan)

from pathlib import Path
from dotenv import load_dotenv
import os

# Letar efter .env i samma mapp som main.py, samt en mapp upp (projektets rot)
env_path = Path(__file__).resolve().parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent.parent / ".env"

load_dotenv(dotenv_path=env_path)

mongo_uri = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")

if not mongo_uri:
    raise ValueError(f"Hittade ingen MongoDB URI! Kollade sökvägen: {env_path}")
    
client = MongoClient(mongo_uri) # Ändra connection string om ni kör molnet/Atlas
db = client["football_data"]
predictions_collection = db["player_data"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Tillåter anrop från Dev Tunnels och alla andra adresser
    allow_credentials=True,
    allow_methods=["*"],           # Tillåter POST, GET, OPTIONS etc.
    allow_headers=["*"],           # Tillåter alla headers (Content-Type osv.)
)

# model = joblib.load("rfr_tuned.pkl")

try:
    model = joblib.load("rfr_tuned.pkl")
    model_columns = model.feature_names_in_
except Exception as e:
    raise ValueError(f"Kunde inte ladda modell: {e}")

class PlayerInput(BaseModel):
    player_name: str
    age: int
    goals: int
    assists: int
    minutes_played: int
    league: str
    position: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/api/health")
def health():
    return True

@app.get("/api/model")
def model_status():
    return {
        "loaded": model_columns is not None
    }

@app.get("/api/predictions")
def get_predictions():
    predictions = list(
        predictions_collection.find(
            {"valuation": True},
            {"_id": 0}
        ).sort("created_at", -1)
    )

    return predictions


@app.post("/api/predict")
def predict_and_store(player: PlayerInput):
    # Skapa DataFrame för modellen
    if model_columns is None:
        print("ingen modell laddad")
    input_df = pd.DataFrame(0, index=[0], columns=model_columns) if model_columns is not None else pd.DataFrame()


    if not input_df.empty:
        input_df['age'] = player.age
        input_df['goals'] = player.goals
        input_df['assists'] = player.assists
        input_df['minutes_played'] = player.minutes_played

        # Sätt 1:or på position och liga
        for col in input_df.columns:
            if player.position.lower() in col.lower():
                input_df[col] = 1
            if player.league.lower() in col.lower():
                input_df[col] = 1

        # Beräkna marknadsvärde
        log_pred = model.predict(input_df)
        predicted_value = float(np.expm1(log_pred)[0])
    else:
        # Fallback om kolumnfilen inte laddats in än
        predicted_value = 15000000.0

    # Skapa dokumentet som ska sparas i MongoDB


    player_doc = {
        "player_name": player.player_name,
        "age": player.age,
        "goals": player.goals,
        "assists": player.assists,
        "minutes_played": player.minutes_played,
        "league": player.league,
        "position": player.position,
        "predicted_value": predicted_value,
        "valuation": True,
        "prediction": True,
        "created_at": datetime.now(timezone.utc)
    }


    # Spara eller uppdatera i MongoDB
    predictions_collection.insert_one(player_doc)

    return {
        "message": "Prediktion sparad i MongoDB",
        "player_name": player.player_name,
        "predicted_value": predicted_value
    }
