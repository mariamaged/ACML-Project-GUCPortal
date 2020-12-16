const express = require('express');
const app =express();
const mongoose =require('mongoose');

//for testing
const StaffMemberRoutes=require('./Routes/StaffMemberRoutes')
const department=require('./Models/DepartmentModel')
const AcademicStaff=require('./Models/AcademicStaffModel')
const faculty=require('./Models/FacultyModel')
//
require('dotenv').config()

app.use(express.json())

app.use(express.urlencoded({extended:false}));
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
//process.env.db_test_URL
mongoose.connect(process.env.db_URL, connectionParams).then(()=>{
    console.log("db successfully connected");
}).catch(()=>{
    console.log("db is not connected");
});


app.listen(3000);
app.use(StaffMemberRoutes);

app.post('/signup',async(req,res)=>{
  //  const{name,id,email,salary,staff_type,department,faculty,type}=req.body;
    const name=req.body.name
    const id=req.body.id
    const email=req.body.email
    const salary=req.body.salary
    const type=req.body.staff_type
    const departmentI=new department(req.body.department)
    const facultyI=new faculty(req.body.faculty)
    const typeTA=req.body.type
    try{const user=new AcademicStaff(name,id,email,salary,type,departmentI,facultyI,typeTA)
        await user.save();
        res.json(user);
    }
        catch(error){
          console.log(error);
        }
    
})





