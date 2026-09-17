"""Football player valuation API."""
from pydantic import BaseModel
import joblib 
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
        "predicted_value": predicted_value
    }

    # Spara eller uppdatera i MongoDB
    predictions_collection.update_one(
        {"player_name": player.player_name},
        {"$set": player_doc},
        upsert=True
    )

    return {
        "message": "Prediktion sparad i MongoDB",
        "player_name": player.player_name,
        "predicted_value": predicted_value
    }


























## -------

""" from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
import joblib
import numpy as np
import pandas as pd

app = FastAPI(title="Football Valuation API")

# 1. Koppla upp mot MongoDB




# 3. Pydantic-schema för POST från Frontenden
class PlayerInput(BaseModel):
    player_name: str
    age: int
    goals: int
    assists: int
    games: int
    league: str
    position: str


# 4. POST: Frontenden skickar in formuläret här
@app.post("/predict")
def predict_and_store(player: PlayerInput):
    # Skapa DataFrame för modellen
    input_df = pd.DataFrame(0, index=[0], columns=model_columns) if model_columns is not None else pd.DataFrame()

    minutes = player.games * 90

    if not input_df.empty:
        input_df['age'] = player.age
        input_df['goals'] = player.goals
        input_df['assists'] = player.assists
        input_df['minutes_played'] = minutes

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
        "games": player.games,
        "minutes_played": minutes,
        "league": player.league,
        "position": player.position,
        "predicted_value": predicted_value
    }

    # Spara eller uppdatera i MongoDB
    predictions_collection.update_one(
        {"player_name": player.player_name},
        {"$set": player_doc},
        upsert=True
    )

    return {
        "message": "Prediktion sparad i MongoDB",
        "player_name": player.player_name,
        "predicted_value": predicted_value
    }


# 5. GET: Frontenden anropar denna för att visa resultatet
@app.get("/valuation/{player_name}")
def get_valuation(player_name: str):
    # Hämta från MongoDB (uteslut det interna _id-fältet så FastAPI kan serialisera)
    result = predictions_collection.find_one(
        {"player_name": player_name},
        {"_id": 0, "player_name": 1, "predicted_value": 1}
    )

    if not result:
        raise HTTPException(status_code=404, detail="Spelaren hittades inte i databasen")

    return result """

"""
import os
import joblib
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient

load_dotenv()

app = FastAPI()

# Databas och modell
client = MongoClient(os.getenv("MONGO_URI"))
db = client["football_data"]
predictions = db["predictions"]

model = joblib.load("rfr_tuned.pkl")


# Pydantic-schema (använder minutes_played direkt)
class PlayerInput(BaseModel):
    player_name: str
    age: int
    goals: int
    assists: int
    minutes_played: int
    league: str
    position: str


@app.post("/predict")
def predict_price(player: PlayerInput):
    # 1. Bygg en tom rad med modellens förväntade kolumner
    df_input = pd.DataFrame(0, index=[0], columns=model.feature_names_in_)

    # 2. Fyll i siffror
    df_input["age"] = player.age
    df_input["goals"] = player.goals
    df_input["assists"] = player.assists
    df_input["minutes_played"] = player.minutes_played

    # 3. Sätt en 1:a på vald position och liga om de finns i träningsdatan
    pos_col = f"position_{player.position}"
    league_col = f"current_club_domestic_competition_id_{player.league}"

    if pos_col in df_input.columns:
        df_input[pos_col] = 1
    if league_col in df_input.columns:
        df_input[league_col] = 1

    # 4. Beräkna prediktion från log-skala
    predicted_val = float(np.expm1(model.predict(df_input)[0]))

    # 5. Spara i MongoDB
    predictions.insert_one({
        "player_name": player.player_name,
        "predicted_value": predicted_val
    })

    return {
        "player_name": player.player_name,
        "predicted_value": predicted_val
    }


@app.get("/valuation/{player_name}")
def get_valuation(player_name: str):
    result = predictions.find_one({"player_name": player_name}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=404, detail="Spelaren hittades inte")
    return result"""