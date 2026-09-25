# Football Player Value Prediction

A Machine Learning project that predicts the estimated market value of a football player based on player statistics.

The project uses data from [Football Data from Transfermarkt](https://www.kaggle.com/datasets/davidcariboo/player-scores) on Kaggle.

## How it works

The user enters information about a player:

* Age
* Goals
* Assists
* Minutes played
* Position
* League

The information is sent from the React frontend to a FastAPI backend. The backend uses our trained Random Forest model to estimate the player's market value.

Predictions are also stored in MongoDB and can be viewed again in the application.

## Machine Learning

We processed data from several CSV files in the Transfermarkt dataset and created a final dataset containing 15,306 players.

We tested:

* DummyRegressor
* Linear Regression
* Random Forest
* Tuned Random Forest

Our final model was a RandomForestRegressor tuned with GridSearchCV.

Final test results:

**R²: 0.626**

**RMSE: approximately €5.33 million**

The model uses age, goals, assists, minutes played, position and league to estimate a player's value.

## Technologies

* Python
* Pandas
* scikit learn
* Jupyter Notebook
* MongoDB
* FastAPI
* React
* Vite
* Git and GitHub

## Project structure

```text
sport_valuation.ipynb
Data processing, EDA, model training and evaluation.

backend/
FastAPI backend and connection to MongoDB.

frontend/
React frontend for creating and viewing player valuations.
```

## Installation

Clone the repository:

```bash
git clone https://github.com/CallePalsson/football-player-value.git
cd football-player-value
```

Create and activate a virtual environment:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file with your MongoDB connection:

```text
MONGODB_URI=your_mongodb_connection_string
```

Start the backend:

```bash
cd backend
uvicorn main:app --reload
```

Start the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

## What we learned

The biggest challenge was working with a large dataset split across several CSV files and deciding which information was useful for the model.

We also learned how to connect the different parts of an ML project, from data processing and model training to a database, backend and frontend.

With more time, we would like to test more features, especially contract length, and look more closely at feature importance.
