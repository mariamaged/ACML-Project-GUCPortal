const express = require('express');
const app =express();
const mongoose =require('mongoose');

//for testing-----------------------------------------
const StaffMemberRoutes=require('./Routes/StaffMemberRoutes')
const department=require('./Models/DepartmentModel')
const AcademicStaffModel=require('./Models/AcademicStaffModel')
const faculty=require('./Models/FacultyModel')
const location=require('./Models/LocationModel');
const StaffMemberModel = require('./Models/StaffMemberModel');
//----------------------------------------------
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

//for testin only------------------------------------REMOVE AFTERRRRRRRRRRR TESTINGGGGGGGGGGGGGGGGGGGGG--
//---------------------------------------------------INSERTING IN TABLES DEPARTMENT ,FACULTY ,STAFF MEMBER ,ACADEMIC MEMBER
app.post('/addFaculty',async(req,res)=>{
    const fac=new faculty({name:req.body.name})
   await fac.save();
   res.json(fac)

   //"name":"met"
})

app.post('/addDepart',async(req,res)=>{
    // fac=faculty.find({name:"met"})
    const dep=new department({name:req.body.name,faculty:faculty.find({name:req.body.facName})._id})
    await dep.save();
    res.json(dep)

    //"name":"engineering",
    //"facName":"met"

})

app.post('/addLoc',async(req,res)=>{
    const loc=new location(req.body)
    await loc.save()
    res.json(loc)

    //   "id":"c7.101",
    // "type":"Tutorial Room",
    // "maximum_capacity":"15"
})
app.post('/Member',async(req,res)=>{
    res.json(req.body)
    if(!req.body.id){
        res.json("please enter id")
    }
    else{
    const name2=req.body.name
    const id2=req.body.id
    const email2=req.body.email
    const salary2=req.body.salary
    const office2=location.find({id:req.body.loc})._id
    const staff_type2=req.body.staff_type
    const mem=new StaffMemberModel({name:name2},{id:id2},{email:email2},{salary:salary2},{office:office2},{staff_type:staff_type2});
    try{
    await mem.save();
    res.json(mem)
    }
    catch(err){
        res.json(err)
    }
}
    
//    "name":"nada"
//    ,"id":"ac-2"
//    ,"email":"nada99@gmail.com"
//    ,"salary":"2000"
//    ,"office":"c7.101"
//    ,"staff_type":"Assistant"
})

 


app.post('/addAc',async(req,res)=>{
   // res.json(req.body)
    
    if(!req.body.faculty || !req.body.type){
        res.json("need faculty and type")
    }
    else{
     const memb=StaffMemberModel.find({id:req.body.id})._id;
    const dep=department.find({name:req.body.dep})._id;
    const fac=faculty.find({name:req.body.faculty})._id;
    const type=req.body.type;
    
    try{
        const user=new AcademicStaffModel({member:memb},{department:dep},{faculty:fac},{type:req.body.type});
        await user.save();
        res.json(user)
    }
    catch(err){
        res.json(err)
    }
    }
//    ,"id":"ac-3"
//    ,"dep":"engineering"
//    ,"faculty":"met"
//    ,"type":"Academic Member"
})
