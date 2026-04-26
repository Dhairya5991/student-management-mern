
import React, {useEffect, useMemo, useState} from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:5000";

function App(){
  const [students,setStudents] = useState([]);
  const [form,setForm] = useState({name:"",attendance:"",marks:""});
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState("");

  const fetch = async ()=>{
    try {
      setError("");
      const res = await axios.get(API+"/students");
      setStudents(res.data);
    } catch (err) {
      setError("Unable to load students. Please check the server connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{fetch();},[]);

  const add = async (event)=>{
    event.preventDefault();
    if (!form.name.trim() || !form.attendance.trim() || !form.marks.trim()) {
      setError("Please fill in name, attendance, and marks before adding.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await axios.post(API+"/students",form);
      setForm({name:"",attendance:"",marks:""});
      fetch();
    } catch (err) {
      setError("Student could not be added. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const del = async(id)=>{
    try {
      setError("");
      await axios.delete(API+"/students/"+id);
      fetch();
    } catch (err) {
      setError("Student could not be deleted. Try again.");
    }
  };

  const stats = useMemo(()=>{
    const total = students.length;
    const averageMarks = total
      ? Math.round(students.reduce((sum,s)=>sum + Number(s.marks || 0),0) / total)
      : 0;
    const averageAttendance = total
      ? Math.round(students.reduce((sum,s)=>sum + Number(s.attendance || 0),0) / total)
      : 0;

    return {total, averageMarks, averageAttendance};
  },[students]);

  return (
    <div className="app-shell">
      <main className="dashboard">
        <section className="hero">
          <div>
            <p className="eyebrow">Classroom Records</p>
            <h1>Student Management</h1>
            <p className="hero-copy">Track attendance and marks in a cleaner, easier-to-read dashboard.</p>
          </div>
          <div className="hero-badge">
            <span>{stats.total}</span>
            Students
          </div>
        </section>

        <section className="stats-grid" aria-label="Student summary">
          <div className="stat-card">
            <span>Total Students</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-card">
            <span>Average Attendance</span>
            <strong>{stats.averageAttendance}%</strong>
          </div>
          <div className="stat-card">
            <span>Average Marks</span>
            <strong>{stats.averageMarks}</strong>
          </div>
        </section>

        <section className="content-grid">
          <form className="student-form" onSubmit={add}>
            <div className="section-heading">
              <p className="eyebrow">New Entry</p>
              <h2>Add Student</h2>
            </div>

            <label>
              Student Name
              <input
                placeholder="e.g. Student Name"
                value={form.name}
                onChange={e=>setForm({...form,name:e.target.value})}
              />
            </label>

            <label>
              Attendance
              <input
                placeholder="e.g. 92"
                type="number"
                min="0"
                max="100"
                value={form.attendance}
                onChange={e=>setForm({...form,attendance:e.target.value})}
              />
            </label>

            <label>
              Marks
              <input
                placeholder="e.g. 86"
                type="number"
                min="0"
                value={form.marks}
                onChange={e=>setForm({...form,marks:e.target.value})}
              />
            </label>

            {error && <p className="message">{error}</p>}

            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? "Adding..." : "Add Student"}
            </button>
          </form>

          <section className="table-panel">
            <div className="section-heading table-heading">
              <div>
                <p className="eyebrow">Records</p>
                <h2>Student List</h2>
              </div>
              <span className="pill">{students.length} entries</span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Attendance</th>
                    <th>Marks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="empty-row" colSpan="4">Loading students...</td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td className="empty-row" colSpan="4">No students added yet.</td>
                    </tr>
                  ) : (
                    students.map(s=>(
                      <tr key={s._id}>
                        <td>
                          <div className="student-name">
                            <span>{s.name?.charAt(0)?.toUpperCase() || "S"}</span>
                            {s.name}
                          </div>
                        </td>
                        <td><span className="metric">{s.attendance}%</span></td>
                        <td><span className="metric">{s.marks}</span></td>
                        <td>
                          <button className="delete-button" onClick={()=>del(s._id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
