// // For environmental variables.
// require('dotenv').config();

// // For database instance.
// const mongoose = require('mongoose');

// // For app singleton instance.
// const {app} = require('./app.js')


// //for testing 
// const location=require('./Models/LocationModel');
// const faculty=require('./Models/FacultyModel')
// const department=require('./Models/FacultyModel')
// const StaffMember=require('./Models/StaffMemberModel')
// const AcademicMember=require('./Models/AcademicStaffModel')
// const HR=require('./Models/HRModel')


// // Database connection parameters.
// const databaseParameters = { useNewUrlParser: true, useUnifiedTopology: true };
// mongoose.connect(process.env.DB_URL_Monica, databaseParameters)
// .then(console.log('Successfully Connected to The Database'));

// app.listen(process.env.PORT);

// Models.


// Listen on port.
// app.post('/addLocation', async (req, res) => {
//     const location = new LocationModel({
//         id: "C7.203",
//         type: "Office",
//         maximum_capacity: 4
//     });
//     await location.save();
// });

// app.post('/addFaculty', async (req, res) => {
//     const faculty = new FacultyModel({
//         name: "Engineering"
//     });
//     await faculty.save();
// });

// app.post('/addDepartment', async (req, res) => {
//     const department = new DepartmentModel({
//         name: "Computer Science"
//     });
//     await department.save();
// });

// // Data hardcoded now but will put as endpoint params.
// app.post('/addAcademicStaffMember', async (req, res) => {
//     // Search for location id.
//     const location = await LocationModel.findOne({id: "C7.203"});
    
//     // Add to StaffMemberModelFirst.
//     const staffMember = new StaffMemberModel({
//         name: "Maria Maged",
//         id: "ac-1",
//         email: "maria@gmail.com",
//         salary: 1000,
//         office: location._id,
//         staff_type: "Academic Member"
//     });
//     await staffMember.save();

//     // Then add to AcademicStaffModel.
//     staffMember = await StaffMemberModel.findOne({email: "maria@gmail.com"}); // Find the id JavaScript added to the tuple we inserted.
//     const faculty = await FacultyModel.findOne({name: "Engineering"}); // Find the id JavaScript added to the tuple we inserted.
//     const department = await DepartmentModel.findOne({name: "Computer Science"}); // Find the id JavaScript added to the tuple we inserted.
//     const academicMember = new AcademicStaffModel({
//         member: staffMember._id,
//         faculty: faculty._id,
//         department: department._id,
//         type: "Course Instructor"
//     });
//     await academicMember.save();
    
// });































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

//app.use(express.json())
var bodyParser = require('body-parser');
const HRModel = require('./Models/HRModel');
app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: false}));
//app.use(express.urlencoded({extended: false}));
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
//process.env.db_test_URL
mongoose.connect(process.env.DB_URL_Monica2, connectionParams).then(()=>{
    console.log("db successfully connected");
}).catch(()=>{
    console.log("db is not connected");
});


app.listen(3000);
app.use(StaffMemberRoutes);


//for testin only------------------------------------REMOVE AFTERRRRRRRRRRR TESTINGGGGGGGGGGGGGGGGGGGGG--
//---------------------------------------------------INSERTING IN TABLES DEPARTMENT ,FACULTY ,STAFF MEMBER ,ACADEMIC MEMBER
app.post('/addFaculty',async(req,res)=>{
    const fac=new faculty({name:req.body.name})
   await fac.save();
   res.json(fac)

   //"name":"met"
})

app.post('/addDepartment',async(req,res)=>{
    // fac=faculty.find({name:"met"})
    const fac=(await faculty.find({name:req.body.facName}))[0]._id
    const dep=new department({name:req.body.name,faculty:fac})
    await dep.save();
    res.json(dep)
   // console.log(dep)
    //"name":"engineering",
    //"facName":"met"

})

app.post('/addLocation',async(req,res)=>{
    const loc=new location(req.body)
    await loc.save()
    res.json(loc)

    //   "id":"c7.101",
    // "type":"Tutorial Room",
    // "maximum_capacity":"15"
})



app.post('/addStaffMember',async(req,res)=>{
    //res.json(req.body)
    // if(req.body.id)
    // console.log("id here")
    const name2=req.body.name
    const id2=req.body.staff_id
    const email2=req.body.email
    const salary2=req.body.salary
    const office2=(await location.find({id:req.body.office}))[0]._id
    const staff_type2=req.body.staff_type
    console.log(name2)
    console.log(id2)
    console.log(email2)
    console.log(salary2)
    console.log(office2)
    console.log(staff_type2)
    const mem=new StaffMemberModel({name:name2,id:id2,email:email2,salary:salary2,office:office2,staff_type:req.body.staff_type});
  //  res.json(mem)
       try{
    await mem.save();
    res.json(mem)
       }
    catch(err){
        console.log("err here")
        res.json(err)
       }
    //}
    
//    "name":"nada"
//    ,"id":"ac-2"
//    ,"email":"nada99@gmail.com"
//    ,"salary":"2000"
//    ,"office":"c7.101"
//    ,"staff_type":"Academic Member"
})




app.post('/addAcademicMember',async(req,res)=>{
   // res.json(req.body)
    
    if(!req.body.faculty || !req.body.type){
        res.json("need faculty and type")
    }
    else{
     const memb=(await StaffMemberModel.find({email:req.body.email}))[0]._id;
     const membID=(await StaffMemberModel.find({email:req.body.email}))[0]
    const dep=(await department.find({name:req.body.dep}))[0]._id;
    const fac=(await faculty.find({name:req.body.faculty}))[0]._id;
    const type=req.body.type;
    
    console.log(membID)
    console.log(memb)
    console.log(dep)
    console.log(fac)
    console.log(type)
    
    try{
        const user=new AcademicStaffModel({member:memb,department:dep,faculty:fac,type:req.body.type});
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
//    ,"type":"Course Instructor"
})

