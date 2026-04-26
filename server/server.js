
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://Dspansare:Dsp190502@ac-zolq29o-shard-00-00.onvsobo.mongodb.net:27017,ac-zolq29o-shard-00-01.onvsobo.mongodb.net:27017,ac-zolq29o-shard-00-02.onvsobo.mongodb.net:27017/?ssl=true&replicaSet=atlas-kh5hoa-shard-0&authSource=admin&appName=Cluster0")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const Student = require("./models/Student");

// Routes
app.get("/students", async (req,res)=>{
  const data = await Student.find();
  res.json(data);
});

app.post("/students", async (req,res)=>{
  const s = new Student(req.body);
  await s.save();
  res.json(s);
});

app.put("/students/:id", async (req,res)=>{
  const s = await Student.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json(s);
});

app.delete("/students/:id", async (req,res)=>{
  await Student.findByIdAndDelete(req.params.id);
  res.json({msg:"Deleted"});
});

app.listen(5000, ()=>console.log("Server running on 5000"));
