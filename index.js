// Models.
const StaffMemberModel = require('./Models/StaffMemberModel.js');
const HRModel = require('./Models/HRModel.js');
const AcademicStaffModel = require('./Models/AcademicStaffModel.js');
const LocationModel = require('./Models/LocationModel.js');
const FacultyModel = require('./Models/FacultyModel.js');
const DepartmentModel = require('./Models/DepartmentModel.js');
const CourseModel = require('./Models/CourseModel.js');

// For environmental variables.
require('dotenv').config();

// For database instance.
const mongoose = require('mongoose');

// For app singleton instance.
const {app} = require('./app.js');

// Database connection parameters.
const databaseParameters = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.DB_URL, databaseParameters)
.then(console.log('Successfully Connected to The Database'));

// Listen on port.
app.post('/viewDepartmentStaffPerCourse', async (req, res) => {
        //  if(req.user.isHod) {
            
            const {courseID} = req.body;
            console.log(courseID);
            console.log(typeof courseID);
            const course = await CourseModel.findOne({id: courseID});
            console.log(course);
            const CourseDepartment = course.department;
            const HODStaffModel = await StaffMemberModel.findOne({id: "ac-1"}); // Delete later.
            const HODAcademicModel = await AcademicStaffModel.findOne({member: HODStaffModel._id}); // member: req.user.id or member: req.user._id.
            const HODDepartment = HODAcademicModel.department;

            if(HODDepartment.equals(CourseDepartment)) {
            const academicArray = course.academic_staff;
            const returnArray = [];
            for(let index = 0; index < academicArray.length; index++) {
              const staffTemp = await StaffMemberModel.findById(academicArray.member);
              const officeTemp = await LocationModel.findById(staffTemp.office);
              const departmentTemp = await DepartmentModel.findById(academicArray.department);
              const facultyTemp = await FacultyModel.findById(academicArray.faculty);
              
              const returnObject = {};
              returnObject.name = staffTemp.name;
              returnObject.email = staffTemp.email;
              returnObject.id = staffTemp.id;
              returnObject.salary = staffTemp.salary;
              returnObject.office = officeTemp.id;
              returnObject.department = departmentTemp.name;
              returnObject.faculty = facultyTemp.id;
              if(staffTemp.hasOwnProperty('gender')) returnObject.gender = staffTemp.gender;
              returnArray.push(returnObject);
          }
            return res.send(returnArray);
        }
        else {
            return res.status(401).send('Course not under your department!');
        }
       // }
        /*else {
            res.status(401).send('Access Denied!');
        }*/
});


app.post('/addCourse', async (req, res) => {
    const departmentName = req.body.departmentName;
    const department = await DepartmentModel.findOne({name: departmentName});

    const course = new CourseModel({
        id: "CSEN704",
        name: "Advanced Computer Lab",
        department: department._id,
        slots_needed: 4
    });
    await course.save();
});

app.post('/addLocation', async (req, res) => {
    const location = new LocationModel({
        id: "C7.203",
        type: "Office",
        maximum_capacity: 4
    });
    await location.save();
});

app.post('/addFaculty', async (req, res) => {
    const faculty = new FacultyModel({
        name: "Engineering"
    });
    await faculty.save();
});

app.post('/addDepartment', async (req, res) => {
    const department = new DepartmentModel({
        name: "DMET"
    });
    await department.save();
});

// Data hardcoded now but will put as endpoint params.
app.post('/addAcademicStaffMember', async (req, res) => {
    // Search for location id.
    const location = await LocationModel.findOne({id: "C7.203"});
    
    // Add to StaffMemberModelFirst.
    const staffMemberTemp = new StaffMemberModel({
        name: "Manal Mounir",
        id: "ac-3",
        email: "manal@gmail.com",
        salary: 3000,
        office: location._id,
        staff_type: "Academic Member"
    });
    await staffMemberTemp.save();

    // Then add to AcademicStaffModel.
    const staffMember = await StaffMemberModel.findOne({email: "manal@gmail.com"}); // Find the id JavaScript added to the tuple we inserted.
    const faculty = await FacultyModel.findOne({name: "Engineering"}); // Find the id JavaScript added to the tuple we inserted.
    const department = await DepartmentModel.findOne({name: "Computer Science"}); // Find the id JavaScript added to the tuple we inserted.
    const academicMember = new AcademicStaffModel({
        member: staffMember._id,
        faculty: faculty._id,
        department: department._id,
        type: "Course Instructor"
    });
    await academicMember.save();
    
});
app.listen(process.env.PORT);



























/*const express = require('express');
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
var bodyParser = require('body-parser')
app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: false}));
//app.use(express.urlencoded({extended: false}));
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
    const fac=(await faculty.find({name:req.body.facName}))[0]._id
    const dep=new department({name:req.body.name,faculty:fac})
    await dep.save();
    res.json(dep)
   // console.log(dep)
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
    // const office3=(await location.find({id:req.body.office}))[0]._id
    // console.log(office3)
    // const fac=(await faculty.find({name:"met"}))[0]._id;
    // console.log(fac)
//     //res.json(req.body)
//     // if(!req.body.id){
//     //     res.json("please enter id")
//     // }
//     // else res.json(req.body.id)
//    // console.log("lala")
//     //else{
//     const name2=req.body.name
//     const id2=req.body.id
//     const email2=req.body.email
//     const salary2=req.body.salary
//     const office2=(await location.find({id:req.body.office}))[0]._id
//     const staff_type2=req.body.staff_type
//     console.log(name2)
//     console.log(id2)
//     console.log(email2)
//     console.log(salary2)
//     console.log(office2)
//     console.log(staff_type2)
//     const mem=new StaffMemberModel({name:name2},{id:id2},{email:email2},{salary:salary2},{office:office2},{staff_type:staff_type2});
//     try{
//     await mem.save();
//     res.json(mem)
//         }
//     catch(err){
//         res.json(err)
//        }
    // //}
    
//    "name":"nada"
//    ,"id":"ac-2"
//    ,"email":"nada99@gmail.com"
//    ,"salary":"2000"
//    ,"office":"c7.101"
//    ,"staff_type":"Assistant"
})

const  memeee=new StaffMemberModel({
    name:"asdad",
    id:1,
    email:"dasdasd",
    salary:22,
    office:"5fda77733d34934a248e3e08",
    staff_type:"HR"

})
memeee.save();
console.log(memeee)


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
*/
