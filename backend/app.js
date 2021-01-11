// Routes Imports.
const HODRoutes = require('./Routes/HODRoutes.js');
const StaffRoutes = require('./Routes/StaffMemberRoutes.js');
const AcademicRoutes = require('./Routes/AcademicMemberRoutes.js');
const HRRoutes = require('./Routes/HRroutes.js');
const InstructorRoutes = require('./Routes/instructorRoutes.js');
const cors=require("cors");

const express = require('express');
const app = express();
app.use(express.json());
app.use(cors());
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept,auth-token");
    res.header("Access-Control-Expose-Headers","auth-token");
    res.header("Access-Control-Allow-Methods","PUT,POST");
    next();
})
// app.use().
app.use('/HOD', HODRoutes);
app.use('/Instructor', InstructorRoutes);
app.use('/CourseCoordinator', InstructorRoutes);
app.use('/academic', AcademicRoutes);
app.use('/staff', StaffRoutes);
app.use('/HR', HRRoutes);

// Exporting the app.
module.exports.app = app;