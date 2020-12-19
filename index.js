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
const HRModel = require('./Models/HRModel');
const CourseModel = require('./Models/CourseModel');
const attendanceSchema=StaffMemberModel.attendanceSchema
const moment=require('moment')
//----------------------------------------------
require('dotenv').config()

//app.use(express.json())
var bodyParser = require('body-parser');

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
    console.log("fac")
    const fac=new faculty({name:req.body.name})
   await fac.save();
   res.json(fac)

   //"name":"met"
})

app.post('/addDepartment',async(req,res)=>{
    // fac=faculty.find({name:"met"})
    const fac=(await faculty.find({name:req.body.faculty}))[0]._id
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
    const attArr=new Array()
    var a=''
    const dates=req.body.dates
   
     var currentTime = moment();
     
    if(dates){
        for(var i=0;i<dates.length;i++){
             a=new attendanceSchema({
                date:dates[i],
                time:moment(),
              //  time: (moment(currentTime).format("HH:mm")),
            })
            a.save();
            attArr[i]=a
        }
    }

    const name2=req.body.name
    const id2=req.body.id
    const email2=req.body.email
    const salary2=req.body.salary
    const office2=(await location.find({id:req.body.office}))[0]._id
    const staff_type2=req.body.staff_type
    const attendance=attArr

    console.log(attArr)
    console.log(name2)
    console.log(id2)
    console.log(email2)
    console.log(salary2)
    console.log(office2)
    console.log(staff_type2)
    const mem=new StaffMemberModel({name:name2,id:id2,email:email2,salary:salary2,office:office2,staff_type:req.body.staff_type,attendance:attArr});
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
        const membID=(await StaffMemberModel.findOne({email:req.body.email}))
     console.log(membID)
     const memb=(await StaffMemberModel.findOne({email:req.body.email}))._id;
     console.log(memb)
     
    const dep=(await department.findOne({name:req.body.department}))._id;
    console.log(dep)
    const fac=(await faculty.findOne({name:req.body.faculty}))._id;
    console.log(fac)
    const type=req.body.type;
    console.log(type)
    
    
    
    
   
    
    try{
        const user=new AcademicStaffModel({member:memb,department:dep,faculty:fac,type:req.body.type});
        await user.save();
      return  res.json(user)
    }
    catch(err){
      return  res.json(err)
    }
    }
//    ,"id":"ac-3"
//    ,"dep":"engineering"
//    ,"faculty":"met"
//    ,"type":"Course Instructor"
})

app.post('/addHR',async(req,res)=>{
    const memb=(await StaffMemberModel.findOne({email:req.body.email}))._id;
    try{
        const user=new HRModel({member:memb});
        await user.save();
        res.json(user)
    }
    catch(err){
        res.json(err)
    }
})

app.post('/addCourse',async(req,res)=>{
   const id=req.body.id
   const name= req.body.name
   const department2= (await department.findOne({name:req.body.dep}))._id; 
   const temp=(await StaffMemberModel.findOne({name:req.body.academic}))._id
   const temp2=(await StaffMemberModel.findOne({name:req.body.coordinator}))._id
  // const academic_staff=(await AcademicStaffModel.findOne({member:temp}))._id;
   console.log(temp)
   const slots_needed=req.body.slots_needed
   try{
    const user=new CourseModel({id:id,name:name,department:department2,academic_staff:temp,slots_needed:slots_needed,course_coordinator:temp2});
    await user.save();
    res.json(user)
}
catch(err){
    res.json(err)
}
})
