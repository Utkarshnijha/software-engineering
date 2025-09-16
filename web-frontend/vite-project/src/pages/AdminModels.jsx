import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api"; // ensure this is your configured Axios/Fetch client

// Supported algorithms
const ALGORITHMS = [
  "Logistic",
  "KNN",
  "DecisionTree",
  "RandomForest",
  "LinearSVM",
  "SVM",
  "NaiveBayes",
  "Perceptron",
  "SGD",
];

// LocalStorage keys
const STORAGE_KEY = "titanic_models";

const loadLocalModels = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveLocalModels = models => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
};

export default function AdminModels({ darkMode }) {
  // State
  const [models, setModels] = useState([]);
  const [features, setFeatures] = useState([]);
  const [name, setName] = useState("");
  const [algorithm, setAlgorithm] = useState(ALGORITHMS[0]);
  const [selected, setSelected] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load features and models concurrently
    Promise.all([
      api.get("/admin/features"),
      api.get("/admin/models"),
    ])
      .then(([featRes, modelRes]) => {
        setFeatures(featRes.data);
        // Backend models
        const backend = modelRes.data.map(m => ({ ...m, source: "backend" }));
        // Local models
        const local = loadLocalModels().map(m => ({ ...m, source: "local" }));
        setModels([...backend, ...local]);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setName("");
    setAlgorithm(ALGORITHMS[0]);
    setSelected([]);
    setEditingId(null);
  };

  const handleTrainOrUpdate = () => {
    if (editingId) {
      // Update local only
      const updated = models.map(m =>
        m.source === "local" && m.id === editingId
          ? { ...m, name, algorithm, features: selected }
          : m
      );
      setModels(updated);
      saveLocalModels(updated.filter(m => m.source === "local"));
    } else {
      // Create new local model
      const newModel = {
        id: Date.now().toString(),
        name,
        algorithm,
        features: selected,
        filepath: "local_storage",
        created_at: new Date().toISOString(),
        source: "local",
      };
      const updated = [newModel, ...models];
      setModels(updated);
      saveLocalModels(updated.filter(m => m.source === "local"));
    }
    resetForm();
  };

  const handleEdit = m => {
    if (m.source === "local") {
      setEditingId(m.id);
      setName(m.name);
      setAlgorithm(m.algorithm);
      setSelected(m.features || []);
    }
  };

  const handleDelete = async m => {
    try {
      if (m.source === "backend") {
        await api.delete(`/admin/models/${m.id}`);
      }
      const remaining = models.filter(x => x.id !== m.id || x.source !== m.source);
      setModels(remaining);
      saveLocalModels(remaining.filter(x => x.source === "local"));
      if (editingId === m.id) resetForm();
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading models...</div>;
  }
  if (error) {
    return <div className="text-danger text-center py-5">Error: {error}</div>;
  }

  return (
    <div className={`min-vh-100 d-flex justify-content-center ${darkMode ? "text-light bg-dark" : "text-dark bg-light"}`}>      
      <motion.div
        className="container py-5 my-5 rounded-4 shadow"
        style={{ maxWidth: 900 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4">Models</h2>

        {/* List models */}
        <ul className="list-group mb-4">
          {models.map(m => (
            <li key={`${m.source}-${m.id}`} className="list-group-item d-flex justify-content-between align-items-start flex-column">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <h5 className="mb-1">
                  {m.name} <small className="text-muted">({m.source})</small>
                </h5>
                <div>
                  {m.source === "local" && (
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(m)}>
                      Edit
                    </button>
                  )}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m)}>
                    Delete
                  </button>
                </div>
              </div>
              <small>Algorithm: {m.algorithm}</small>
              <small>Features: {(m.features || []).join(", ")}</small>
              <small>Trained: {new Date(m.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>

        {/* Form */}
        <h4 className="mb-3">{editingId ? "Update Local Model" : "Train New Local Model"}</h4>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Algorithm</label>
          <select className="form-select" value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
            {ALGORITHMS.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="form-label">Select Features</label>
          <div className="d-flex flex-wrap">
            {features.map(f => (
              <div key={f} className="form-check me-3">
                <input className="form-check-input" type="checkbox" id={`feat-${f}`} value={f}
                  checked={selected.includes(f)}
                  onChange={() => {
                    setSelected(sel =>
                      sel.includes(f) ? sel.filter(x => x !== f) : [...sel, f]
                    );
                  }}
                />
                <label className="form-check-label" htmlFor={`feat-${f}`}>{f}</label>
              </div>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleTrainOrUpdate} disabled={!name || selected.length === 0}>
          {editingId ? "Update" : "Train"}
        </button>
      </motion.div>
    </div>
  );
}
