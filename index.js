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
  //  console.log((await location.find({id:"c7.101"}))[0])
    //  const office3=(await location.find({id:req.body.office}))[0]._id
    //  console.log(office3)
    // const fac=(await faculty.find({name:"met"}))[0]._id;
    // console.log(fac)
//     //res.json(req.body)
    // if(!req.body.id){
    //     res.json("please enter id")
    // }
//     // else res.json(req.body.id)
//    // console.log("lala")
//     //else{
    const name2=req.body.name
    const id2=req.body.id
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
    const mem=new StaffMemberModel({name:name2},{id:id2},{email:email2},{salary:salary2},{office:office2},{staff_type:staff_type2});
  try{
    await mem.save();
    res.json(mem)
       }
    catch(err){
        console.log("err here")
        res.json(err)
       }
    // //}
    
//    "name":"nada"
//    ,"id":"ac-2"
//    ,"email":"nada99@gmail.com"
//    ,"salary":"2000"
//    ,"office":"c7.101"
//    ,"staff_type":"Assistant"
})

// const  memeee=new StaffMemberModel({
//     name:"kokokokoa",
//     id:3,
//     email:"plplpl",
//     salary:22,
//     office:"5fda77733d34934a248e3e08",
//     staff_type:"Academic Member"

// })
// memeee.save();
// console.log(memeee)


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
