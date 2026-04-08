const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mydb')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const studentSchema = new mongoose.Schema({
    name: String,
    age: Number
});    

const Student = mongoose.model('Student', studentSchema);

// create, read, update, delete (CRUD) operations
app.post('/add', async (req, res) => {
    const student=new Student(req)
    await student.save()
    res.send("Student added");
});

app.get('/students', async (req, res) => {
    const data = await Student.find();
    res.json(data);
});

app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    await Student.findByIdAndUpdate(id, req.body);
    res.send("Student updated");
});
app.delete("/delete/:id",async(req,res)=>{
    await Student.findByIdAndDelete(req.params.id);
    res.send("Student Deleted");
});
app.listen(3000,()=>{
    console.log("server running on port 3000");
});