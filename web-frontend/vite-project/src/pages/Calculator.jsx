import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api";
const STORAGE_KEY = "titanic_models";


export default function Calculator({ darkMode, isAuthenticated }) {
  const navigate = useNavigate();



  // ─── form state ───────────────────────────────────────────────
  const [formData, setFormData] = useState({
    Pclass: "1", Sex: "0", Age: "", Fare: "",
    Embarked: "0", Title: "1", IsAlone: "0",
  });

  // ─── models ───────────────────────────────────────────────────
  const ALL = ["logistic","KNN","DecisionTree","RandomForest","LinearSVM","SVM","NaiveBayes","Perceptron","SGD"];
  const ANON= ["RandomForest","SVM"];
  const [models, setModels]  = useState(isAuthenticated ? ALL : ANON);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/admin/models");
        const backendNames = data.map(m => m.name || m.algorithm);

        // Grab what AdminModels.jsx saved locally
        const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const localNames = local.map(m => m.name || m.algorithm);

        setModels(
          isAuthenticated
            ? [...ALL,  ...backendNames, ...localNames]
            : [...ANON, ...backendNames, ...localNames]
        );
      } catch (err) {
        console.error("Could not load models:", err);
      }
    })();
  }, [isAuthenticated]);




  // ─── ui state ─────────────────────────────────────────────────
  const [results,setResults] = useState([]);
  const [history,setHistory] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError]     = useState(null);

  // ─── helper categorisers ─────────────────────────────────────
  const catAge = a=>a<=16?0:a<=32?1:a<=48?2:a<=64?3:4;
  const catFare=f=>f<=7.91?0:f<=14.454?1:f<=31?2:3;

  // ─── load local history ──────────────────────────────────────
  useEffect(()=>{ setHistory(JSON.parse(localStorage.getItem("history")||"[]")); },[]);

  // ─── prediction ──────────────────────────────────────────────
  const predictSurvival = async () => {
    if(!formData.Age||!formData.Fare){ setError("Fill Age & Fare"); return; }
    setLoading(true); setError(null);

    const payload={
      Pclass:+formData.Pclass, Sex:+formData.Sex,
      Age:catAge(formData.Age),
      Fare:catFare(formData.Fare),
      Embarked:+formData.Embarked, Title:+formData.Title,
      IsAlone:+formData.IsAlone,
    };

    try{
      const token = localStorage.getItem("token");
      const reqs  = models.map(m =>
        fetch(`/predict/${m}`,{
          method:"POST",
          headers:{ "Content-Type":"application/json", ...(isAuthenticated && {Authorization:`Bearer ${token}`})},
          body:JSON.stringify(payload)
        }).then(r=>{ if(!r.ok) throw new Error(m); return r.json(); })
      );
      const resArr = await Promise.all(reqs);
      setResults(resArr);

      /* save with params */
      const stamped = resArr.map(r=>({
        model:r.model,
        survived:r.survived,
        probability_of_survival:r.probability_of_survival ?? r.probability ?? 0,
        timestamp:new Date().toISOString(),
        params:{
          Pclass:payload.Pclass,
          Sex:payload.Sex,
          Age:formData.Age,          // original age
        },
      }));
      const merged=[...stamped,...JSON.parse(localStorage.getItem("history")||"[]")].slice(0,10);
      localStorage.setItem("history",JSON.stringify(merged));
      setHistory(merged);

    }catch(e){ setError(e.message); setResults([]);}
    finally{ setLoading(false);}
  };

  // auto-predict on change (unchanged core logic)
  useEffect(()=>{
    if(formData.Age&&formData.Fare){
      const t=setTimeout(predictSurvival,1000);
      return()=>clearTimeout(t);
    }else{ setResults([]);}
  },[formData,isAuthenticated]);     // eslint-disable-line

  // input + reset (unchanged)
  const handleChange=e=>{
    const {name,value}=e.target; let v=value;
    if(name==="Age" && v!=="")  v=String(Math.max(0,Math.min(100,Math.round(+v))));
    if(name==="Fare"&& v!=="")  v=String(Math.max(0,Math.min(500,Math.round(+v))));
    setFormData(fd=>({...fd,[name]:v}));
  };
  const resetForm=()=>setFormData({Pclass:"1",Sex:"0",Age:"",Fare:"",Embarked:"0",Title:"1",IsAlone:"0"});

  /* --- keep all your existing JSX below this line (omitted for brevity) --- */


    useEffect(() => {
  if (!isAuthenticated) {
    localStorage.removeItem("history");
    setHistory([]);           // clear the table instantly
  }
}, [isAuthenticated]);


  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div className={`min-vh-100 d-flex align-items-center justify-content-center ${darkMode ? "text-light" : "text-dark"}`}
      style={{ backgroundColor: 'transparent' }}
    >
      <motion.div
        className="rounded-4 shadow-lg p-4 p-md-5"
        style={{
          width: "100%",
          maxWidth: "700px",
          backdropFilter: "blur(16px)",
          backgroundColor: darkMode
            ? "rgba(30, 30, 30, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
          border: darkMode
            ? "1px solid rgba(255, 255, 255, 0.2)"
            : "1px solid rgba(0, 0, 0, 0.15)",
          boxShadow: darkMode
            ? "0 8px 32px rgba(0, 0, 0, 0.5)"
            : "0 8px 32px rgba(0, 0, 0, 0.1)"
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-center mb-4">Titanic Survival Calculator</h2>

        {error && (
          <div className="alert alert-danger mb-3 rounded-3"
            style={{
              backdropFilter: 'blur(8px)',
              backgroundColor: darkMode ? 'rgba(120, 30, 30, 0.8)' : 'rgba(220, 53, 69, 0.2)',
              border: darkMode ? '1px solid rgba(255, 100, 100, 0.3)' : '1px solid rgba(220, 53, 69, 0.3)'
            }}
          >
            {error}
          </div>
        )}

        {/* ── Input fields ────────────────────────────────────────── */}
        <div className="row g-3">
          {[
            { name: "Pclass", label: "Passenger Class", type: "select", options: ["1", "2", "3"] },
            { name: "Sex", label: "Sex", type: "select", options: ["Male", "Female"], values: ["0", "1"] },
            { 
              name: "Age", 
              label: "Age", 
              type: "number", 
              placeholder: "0-100", 
              min: 0, 
              max: 100,
              style: {
                color: darkMode ? '#fff' : '#000',
                '::placeholder': {
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                }
              }
            },
            { 
              name: "Fare", 
              label: "Fare", 
              type: "number", 
              placeholder: "0-500", 
              min: 0, 
              max: 500,
              style: {
                color: darkMode ? '#fff' : '#000',
                '::placeholder': {
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                }
              }
            },
            { name: "Embarked", label: "Embarked", type: "select", options: ["Southampton (S)", "Cherbourg (C)", "Queenstown (Q)"], values: ["0", "1", "2"] },
            { name: "Title", label: "Title", type: "select", options: ["Mr", "Miss", "Mrs", "Master", "Rare"], values: ["1", "2", "3", "4", "5"] },
            { name: "IsAlone", label: "Family Status", type: "select", options: ["Alone", "With Family"], values: ["0", "1"] }
          ].map((field) => (
            <div key={field.name} className={`col-md-${field.name === "IsAlone" ? "6" : "6"}`}>
              <label className="form-label">{field.label}</label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  className="form-control"
                  value={formData[field.name]}
                  onChange={handleChange}
                  style={{
                    backdropFilter: 'blur(8px)',
                    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    color: darkMode ? '#fff' : '#000'
                  }}
                >
                  {field.options.map((opt, i) => (
                    <option 
                      key={opt} 
                      value={field.values ? field.values[i] : opt}
                      style={{
                        backgroundColor: darkMode ? '#333' : '#fff',
                        color: darkMode ? '#fff' : '#000'
                      }}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  className="form-control"
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  style={{
                    backdropFilter: 'blur(8px)',
                    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    color: darkMode ? '#fff' : '#000',
                    '::placeholder': {
                      color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                    }
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Actions ─────────────────────────────────────────────── */}
        <div className="mt-4 d-flex gap-2">
          <motion.button
            onClick={() => navigate('/history')}
            className="btn btn-outline-primary ms-2"
          >
            View Full History
          </motion.button>

          <motion.button
            onClick={predictSurvival}
            className="btn flex-grow-1 fw-bold py-2"
            style={{
              fontSize: "1.1rem",
              background: darkMode ? "#0d6efd" : "#0d6efd",
              border: "none",
              color: "white",
              transition: "all .3s ease",
              backdropFilter: "blur(6px)",
              transform: "translateY(0)"
            }}
            disabled={loading}
            onMouseEnter={(e) => e.target.style.background = "#0b5ed7"}
            onMouseLeave={(e) => e.target.style.background = darkMode ? "#0d6efd" : "#0d6efd"}
            onMouseDown={(e) => e.target.style.background = "#0a58ca"}
            onMouseUp={(e) => e.target.style.background = "#0b5ed7"}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 6px 18px rgba(13, 110, 253, 0.45)"
            }}
            whileTap={{
              scale: 0.98,
              boxShadow: "0 2px 8px rgba(13, 110, 253, 0.25)"
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Predicting...
              </>
            ) : (
              <>
                <i className="bi bi-calculator-fill me-2"></i>
                Predict Survival
              </>
            )}
          </motion.button>

          <button
            onClick={resetForm}
            className={`btn ${darkMode ? "btn-outline-light" : "btn-outline-secondary"
              }`}
            style={{
              borderWidth: "2px",
              fontWeight: "500"
            }}
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i>
            Reset
          </button>
        </div>

        {/* ── Side-by-side Results ──────────────────────────────── */}
        {results.length > 0 && ( 
          <div className="mt-4">
            <div className="row g-3">
              {results.map((r) => (
                <div key={r.model} className="col-md-6">
                  <div
                    className="p-3 mb-3 rounded-3"
                    style={{
                      backdropFilter: "blur(8px)",
                      backgroundColor: darkMode
                        ? "rgba(40, 40, 50, 0.7)"
                        : "rgba(255, 255, 255, 0.7)",
                      border: darkMode
                        ? "1px solid rgba(255, 255, 255, 0.2)"
                        : "1px solid rgba(0, 0, 0, 0.1)",
                      boxShadow: darkMode
                        ? "0 4px 16px rgba(0, 0, 0, 0.3)"
                        : "0 4px 16px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <h5 className="text-center mb-3">{r.model}</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Result:</span>
                      <span
                        className={
                          r.survived
                            ? "text-success fw-bold"
                            : "text-danger fw-bold"
                        }
                      >
                        {r.survived ? "Survived" : "Did not survive"}
                      </span>
                    </div>
                    {r.probability_of_survival != null && (
                      <>
                        <div className="progress mt-2" style={{ 
                          height: "10px",
                          backdropFilter: 'blur(4px)',
                          backgroundColor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'
                        }}>
                          <div
                            className={`progress-bar ${r.survived ? "bg-success" : "bg-danger"}`}
                            style={{
                              width: `${(r.probability_of_survival * 100).toFixed(1)}%`,
                            }}
                          />
                        </div>
                        <small className="text-muted d-block text-end mt-1">
                          {(r.probability_of_survival * 100).toFixed(1)}% probability
                        </small>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── History Table ─────────────────────────────────────── */}
        {isAuthenticated && history.length > 0 && (
          <div className="mt-5">
            <h5>Prediction History</h5>
            <div className="table-responsive rounded-3"
              style={{
                backdropFilter: 'blur(8px)',
                backgroundColor: darkMode ? 'rgba(40, 40, 50, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)'
              }}
            >
              <table className={`table table-sm ${darkMode ? 'table-dark' : ''}`}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Model</th>
                    <th>Result</th>
                    <th>Prob</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{h.model}</td>
                      <td className={h.survived ? "text-success" : "text-danger"}>
                        {h.survived ? "✓ Survived" : "✗ Perished"}
                      </td>
                      <td>{(h.probability_of_survival * 100).toFixed(1)}%</td>
                      <td>{new Date(h.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}