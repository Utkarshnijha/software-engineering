import React, { useEffect, useState } from "react";

export default function HistoryPanel({ darkMode }) {
  const [rows,setRows] = useState([]);

  useEffect(()=>{
    setRows(JSON.parse(localStorage.getItem("history")||"[]"));
  },[]);

  const box={
    backdropFilter:"blur(8px)",
    backgroundColor:darkMode?"rgba(40,40,50,.75)":"rgba(255,255,255,.80)",
    border:darkMode?"1px solid rgba(255,255,255,.18)":"1px solid rgba(0,0,0,.12)",
    borderRadius:"0.75rem", padding:"1rem",
  };

  if(!rows.length)
    return <div className="container mt-5 text-center" style={box}>
      <p>No history yet — make a prediction!</p>
    </div>;

  return(
    <div className="container mt-4" style={box}>
      <h5 className="mb-3" style={{color:darkMode?"#fff":"#000"}}>Last&nbsp;10&nbsp;Predictions</h5>
      <div className="table-responsive">
        <table className={`table table-sm ${darkMode?"table-dark":""}`}>
          <thead>
            <tr>
              <th>#</th><th>Model</th><th>Details</th>
              <th>Result</th><th>Prob.</th><th>Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i}>
                <td>{i+1}</td>
                <td>{r.model}</td>
                <td className="small">
                  {r.params
                    ? `Class ${r.params.Pclass}, ${r.params.Sex ? "Female" : "Male"}, ${r.params.Age} yrs`
                    : "–"}
                </td>
                <td className={r.survived?"text-success":"text-danger"}>
                  {r.survived?"✓":"✗"}
                </td>
                <td>{(r.probability_of_survival*100).toFixed(1)}%</td>
                <td>{new Date(r.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
