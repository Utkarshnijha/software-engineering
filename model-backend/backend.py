# model-backend/backend.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import pickle
import os
from uuid import uuid4

# === FIXED: import from the file that actually defines train_pipeline ===
# Your pipeline lives in models.py, not model.py
from models import train_pipeline, model_dir  

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# === ADDED: where to save new .pkl files ===
model_dir = os.path.join(BASE_DIR, "Models")

# ── Load existing pickles ─────────────────────────────────────────
# (your existing MODEL_PATHS and loading logic here)
MODEL_PATHS = {
    "logistic":    os.path.join(model_dir, "logistic_model.pkl"),
    "KNN":         os.path.join(model_dir, "KNN.pkl"),
    "DecisionTree":os.path.join(model_dir, "DecisionTree.pkl"),
    "RandomForest":os.path.join(model_dir, "RandomForest.pkl"),
    "LinearSVM":   os.path.join(model_dir, "LinearSVM.pkl"),
    "SVM":         os.path.join(model_dir, "SVM.pkl"),
    "NaiveBayes":  os.path.join(model_dir, "NaiveBayes.pkl"),
    "Perceptron":  os.path.join(model_dir, "Perceptron.pkl"),
    "SGD":         os.path.join(model_dir, "SGD.pkl"),
}

models = {}
for name, path in MODEL_PATHS.items():
    if not os.path.exists(path):
        print(f" Model file '{name}' not found at {path}")
        continue
    with open(path, "rb") as f:
        models[name] = pickle.load(f)
if not models:
    raise RuntimeError("No models loaded; put at least one .pkl in Models/")

# ── Prediction endpoint (unchanged) ───────────────────────────────
class Passenger(BaseModel):
    Pclass: int; Sex: int; Age: int; Fare: int
    Embarked: int; Title: int; IsAlone: int

@app.post("/predict/{model_name}")
def predict(passenger: Passenger, model_name: str):
    if model_name not in models:
        raise HTTPException(status_code=404, detail="Model not found")
    df = pd.DataFrame([passenger.model_dump()], columns=passenger.model_dump().keys())
    pred = models[model_name].predict(df)[0]
    try:
        proba = round(models[model_name].predict_proba(df)[0][1], 4)
    except:
        proba = None
    return {
        "model": model_name,
        "input": passenger.model_dump(),
        "survived": bool(pred),
        "probability_of_survival": proba,
    }

# ── New: Train endpoint ────────────────────────────────────────────
class TrainRequest(BaseModel):
    name:      str
    algorithm: str
    features:  list[str]

class TrainResponse(BaseModel):
    filename:  str
    name:      str
    algorithm: str
    features:  list[str]

@app.post("/train", response_model=TrainResponse)
def train(req: TrainRequest):
    # 1) fit the new model
    model_obj = train_pipeline(req.features, req.algorithm)

    # 2) dump to disk
    out_fname = f"{req.name.replace(' ','_')}_{uuid4().hex}.pkl"
    out_path  = os.path.join(model_dir, out_fname)
    with open(out_path, "wb") as f:
        pickle.dump(model_obj, f)

    # 3) return metadata
    return TrainResponse(
        filename=out_fname,
        name=req.name,
        algorithm=req.algorithm,
        features=req.features,
    )

@app.delete("/models/{model_id}", status_code=204)
def delete_model(model_id: str):
      """
      Called by web-backend (via httpx.delete) to remove the trained pickle.
      """
      file_path = os.path.join(model_dir, model_id)
      if os.path.exists(file_path):
          os.remove(file_path)
      return