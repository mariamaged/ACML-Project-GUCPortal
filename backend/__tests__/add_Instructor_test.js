// const express = require('express');
// const app =express();
// const mongoose =require('mongoose');
// const instructor=require('../Models/instructor.js')
// //const PORT =1000;

// require('dotenv').config()
// const Members= require('./models/members');

// app.use(express.json())
// app.use(express.urlencoded({extended:false}));
// const connectionParams={
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true 
// }
// await mongoose.createConnection(process.env.db_test_URL,connectionParams);

// app.listen(app.listen(3000));

// app.post('/signup',(req,res)=>{
//     const newInstr=new instructor({
//         name:req.body.name,
//         id:req.body.id,
//     });
//     const savedInstr=await newInstr.save();
//     res.json(savedInstr);
// })

