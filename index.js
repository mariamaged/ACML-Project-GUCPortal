const express = require('express');
const app =express();
const mongoose =require('mongoose');
const instModel=require('./Models/instructor')

require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({extended:false}));
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
//process.env.db_test_URL
mongoose.connect("mongodb+srv://monica:mo123@cluster0.t0aiw.mongodb.net/instructors?retryWrites=true&w=majority",connectionParams).then(()=>{
    console.log("db successfully connected");
}).catch(()=>{
    console.log("db is not connected");
});


app.listen(app.listen(3000));

app.post('/signup',async(req,res)=>{
    const newInstr=new instModel({
        name:req.body.name
        ,id:req.body.id
        ,password: req.body.password
        ,schedule:req.body.schedule
        //{"day":"Monday" ,"number":3,"location":"C1.101","academic_member_id":"AC-1","course_id": 2}      
         
    
    //,courses:[courseSchema]
    });
    //res.json(req.body.schedule)
    const savedInstr=await newInstr.save();
    res.json(savedInstr);
})

