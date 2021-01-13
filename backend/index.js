// For environmental variables.
require('dotenv').config();


// For database instance.
const mongoose = require('mongoose');

// For app singleton instance.
const {app} = require('./app.js');

// Database connection parameters.
const databaseParameters = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.DB_URL_Monica2, databaseParameters)
.then(console.log('Successfully Connected to The Database'));


app.get('/trialEndpoint', async (req, res) => {
    const value = 12;
    return res.status(200).json({value});
});

// function authenticateToken(req,res,next){
    
//     const token=req.header('x-auth-token');
//     if(!token){
//     return res.sendStatus(401).status('Access deined please log in first')
    
//     }
//     const verified= jwt.verify(token, process.env.TOKEN_SECRET)
//     req.user=verified
//     console.log("in auth "+req.user)
//     next();
// }
// app.get('/sentReplacementRequests',authenticateToken,async(req,res)=>{
//     //get all requests where id of sender is this user
//     const user=await StaffMemberModel.findById(req.user.id)
//     const type=user.staff_type
//     // if(type=="HR"){
//     //     return res.json("HR do not have replacement requests")
//     // }
//     if(type=="HR"){
//         return res.json("HR cannot submit this request.Only academic staff are permitted.")
//     }
//         const sent=await request.find({reqType:"Replacement",sentBy:req.user.id})
//         const arr=[]
//         var k=0
//         for(var i=0;i<sent.length;i++){
//             //get name of request receiver to print
//                 reqType=sent[i].reqType
//                 const sentTo=(await StaffMemberModel.findById(sent[i].sentTo))
//                 const hodName=sentTo.name
                 
//             if(reqType=="Replacement"){
//                 // res.write("Request ID: "+sent[i].requestID)
//                 // res.write("Request type: "+sent[i].reqType+"\n")
//                 // res.write( "Sent to academic staff member: "+hodName+"\n")
//                 // res.write( "Request state: "+sent[i].state+"\n")
//                 // res.write( "Slot number: "+sent[i].slotNum+"\n")
//                 // res.write( "Slot date: "+ sent[i].slotDate+"\n")
//                 // res.write( "Slot location: "+sent[i].slotLoc+"\n")
//                 // res.write( "Submission date "+sent[i].submission_date+"\n")
//                 // res.write("\n")
//                 arr[k++]=sent[i]
               
//             }
            
           
                
//         }
//         // if(sent.length==0)
//         // res.json("There are no sent requests available to display.")

//         res.json(arr)
//         return 
// })
// Listen on port.
//  app.listen(process.env.PORT);
 var listener = app.listen(process.env.PORT, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});
// app.listen(4000)


// const arr1=[1,2]
// const arr2=[3,4]
// const array3 = [...arr1, ...arr2];
// console.log(array3)


// const express = require('express');
// const app =express();
// const mongoose =require('mongoose');

// //for testing-----------------------------------------
// const ObjectID = mongoose.Schema.Types.ObjectId;
// const StaffMemberRoutes=require('./Routes/StaffMemberRoutes')
// const AcademicMemberRoutes=require('./Routes/AcademicMemberRoutes')
// const department=require('./Models/DepartmentModel')
// const AcademicStaffModel=require('./Models/AcademicStaffModel')
// const faculty=require('./Models/FacultyModel')
// const location=require('./Models/LocationModel.js')
const StaffMemberModel = require('./Models/StaffMemberModel');
// const HRModel = require('./Models/HRModel');
// const CourseModel = require('./Models/CourseModel');
// const attendanceSchema=StaffMemberModel.attendanceSchema
const moment=require('moment')
// const slot=require('./Models/SlotSchema.js')
const request=require('./Models/RequestModel.js')
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
// //----------------------------------------------
// require('dotenv').config()

// //app.use(express.json())
// var bodyParser = require('body-parser');

// app.use(bodyParser.json())
// //app.use(bodyParser.urlencoded({ extended: false}));
// //app.use(express.urlencoded({extended: false}));
// const connectionParams={
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true 
// }
// //process.env.db_test_URL
// mongoose.connect(process.env.DB_URL_Monica2, connectionParams).then(()=>{
//     console.log("db successfully connected");
// }).catch(()=>{
//     console.log("db is not connected");
// });


// app.listen(5000);
// app.use(StaffMemberRoutes);
// app.use(AcademicMemberRoutes);





// //for testin only------------------------------------REMOVE AFTERRRRRRRRRRR TESTINGGGGGGGGGGGGGGGGGGGGG--
// //---------------------------------------------------INSERTING IN TABLES DEPARTMENT ,FACULTY ,STAFF MEMBER ,ACADEMIC MEMBER
// app.post('/addFaculty',async(req,res)=>{
//     console.log("fac")
//     const fac=new faculty({name:req.body.name})
//    await fac.save();
//    res.json(fac)

//    //"name":"met"
// })

// app.post('/addDepartment',async(req,res)=>{
//     // fac=faculty.find({name:"met"})
//     const fac=(await faculty.find({name:req.body.faculty}))[0]._id
//     const dep=new department({name:req.body.name,faculty:fac})
//     await dep.save();
//     res.json(dep)
//    // console.log(dep)
//     //"name":"engineering",
//     //"facName":"met"

// })

// app.post('/addLocation',async(req,res)=>{
//     const loc=new location(req.body)
//     await loc.save()
//     res.json(loc)

//     //   "id":"c7.101",
//     // "type":"Tutorial Room",
//     // "maximum_capacity":"15"
// })



// app.post('/addStaffMember',async(req,res)=>{
//     //res.json(req.body)
//     // if(req.body.id)
//     // console.log("id here")
//     const attArr=new Array()
//     var a=''
//     const dates=req.body.dates
   
//      var currentTime = moment();
     
//     if(dates){
//         for(var i=0;i<dates.length;i++){
//              a=new attendanceSchema({
//                 date:moment(dates[i]),
//                 time:moment(),
//                 dayOffBool:false
//               //  time: (moment(currentTime).format("HH:mm")),
//             })
//             a.save();
//             attArr[i]=a
//         }
//     }
    
//     const name2=req.body.name
//     const id2=req.body.id
//     const email2=req.body.email
//     const salary2=req.body.salary
//     const office2=(await location.find({id:req.body.office}))[0]._id
//     const staff_type2=req.body.staff_type
//     const attendance=attArr
//     const annual_days=req.body.annual_days
//     const gender=req.body.gender
//     console.log(attArr)
//     console.log(name2)
//     console.log(id2)
//     console.log(email2)
//     console.log(salary2)
//     console.log(office2)
//     console.log(staff_type2)
//     const mem=new StaffMemberModel({name:name2,id:id2,email:email2,salary:salary2,
//         office:office2,staff_type:req.body.staff_type,attendance:attArr,
//         annual_days:annual_days,gender:gender});
//   //  res.json(mem)
//        try{
//     await mem.save();
//     res.json(mem)
//        }
//     catch(err){
//         console.log("err here")
//         res.json(err)
//        }
//     //}
    
// //    "name":"nada"
// //    ,"id":"ac-2"
// //    ,"email":"nada99@gmail.com"
// //    ,"salary":"2000"
// //    ,"office":"c7.101"
// //    ,"staff_type":"Academic Member"
// })




// app.post('/addAcademicMember',async(req,res)=>{
//    // res.json(req.body)
    
//     if(!req.body.faculty || !req.body.type){
//         res.json("need faculty and type")
//     }
//     else{
//         const membID=(await StaffMemberModel.findOne({email:req.body.email}))
//      console.log(membID)
//      const memb=(await StaffMemberModel.findOne({email:req.body.email}))._id;
//      console.log(memb)
     
//     const dep=(await department.findOne({name:req.body.department}))._id;
//     console.log(dep)
//     const fac=(await faculty.findOne({name:req.body.faculty}))._id;
//     console.log(fac)
//     const type=req.body.type;
//     console.log(type)
    
    
//     const newSlot={
//         date:moment("2020-12-29"),
//         day:'Monday',
//         number:1, 
//         location:"5fdc1b8ea806330ca8156792",
//         academic_member_id:"5fdef2fbe82dbf4a00754273",
//         course:"5fe5a6df1a5d472ebc798dae"
//     }
//     const arr=new Array()
//     arr[0]=newSlot
    
   
    
//     try{
//         const user=new AcademicStaffModel({schedule:arr,member:memb,department:dep,faculty:fac,type:req.body.type,day_off:req.body.day_off});
//         await user.save();
//       return  res.json(user)
//     }
//     catch(err){
//       return  res.json(err)
//     }
//     }
// //    ,"id":"ac-3"
// //    ,"department":"engineering"
// //    ,"faculty":"met"
// //    ,"type":"Course Instructor"
// })

// app.post('/addHR',async(req,res)=>{
//     const memb=(await StaffMemberModel.findOne({email:req.body.email}))._id;
//     try{
//         const user=new HRModel({member:memb});
//         await user.save();
//         res.json(user)
//     }
//     catch(err){
//         res.json(err)
//     }
// })

// app.post('/addCourse',async(req,res)=>{
//    const id=req.body.id
//    const name= req.body.name
//    const department2= (await department.findOne({name:req.body.dep}))._id; 
//    const temp=(await StaffMemberModel.findOne({name:req.body.academic}))._id
//    const temp2=(await StaffMemberModel.findOne({name:req.body.coordinator}))._id
//   // const academic_staff=(await AcademicStaffModel.findOne({member:temp}))._id;
//    console.log(temp)
//    const slots_needed=req.body.slots_needed
//    try{
//     const user=new CourseModel({id:id,name:name,department:department2,academic_staff:temp,slots_needed:slots_needed,course_coordinator:temp2});
//     await user.save();
//     res.json(user)
// }
// catch(err){
//     res.json(err)
// }
// })


// // const newSlot=new slot({
// //     date:("2020-12-21").toDate(),
// //     day:'Monday',
// //     number:1, 
// //     location:"5fdc1b8ea806330ca8156792",
// //     academic_member_id:"5fdef2f6e82dbf4a0075426f",
// //     course:"5fe0e84209a15235b0383352"
// // })

async function  cr(){
// //     const loc=(await StaffMemberModel.findById("5fdf6be566837b398064cf53"))
// //     const loc3=loc.notifications
// // //console.log(loc3)
// // // const newCourse=new CourseModel({
// // //         id: "csen44",
// // //         name: "cs4", // Not sure if it should be required.
// //        // academic_staff:["5fe4320666d23941b83c45b5"],
     
// // })
// // try{
// // newCourse.save()}
// // catch(err){

// // }
//  //const userNew=await CourseModel.findByIdAndUpdate("5fe5a6df1a5d472ebc798dae",{academic_staff:["5fe5a729b0c2c8365c564dea","5fe5a7643f109c481cbecdde","5fe5a79029927c4a44f64ffd","5fe5a7ba85423b3948f23b97"]})
// //  const user= await CourseModel.findByIdAndUpdate("5fe5a6df1a5d472ebc798dae",{academic_staff:["5fe43858b0287c03e4f2c105",
// // "5fe4320666d23941b83c45b5","5fe432954b947a3954a1886e","5fe43342a3107c39f80fd389"]})
// //  console.log(user)
// // //5fdf6c7166837b398064cf55
// // //5fdef2fbe82dbf4a00754273
// //  await newCourse.save()

// // const newSlot1={
// //     date:moment("2020-12-29"),
// //     day:'Monday',
// //     number:1, 
// //     location:"5fdc1b8ea806330ca8156792",
// //     academic_member_id:"5fe4320666d23941b83c45b5",
// //     course:"5fe43f5252560d16f0580e1c"
// // }
// // const newSlot2={
// //     date:moment("2020-12-29"),
// //     day:'Tuesday',
// //     number:1, 
// //     location:"5fdc1b8ea806330ca8156792",
// //     academic_member_id:"5fe4320666d23941b83c45b5",
// //     course:"5fe1048475f81f0470b078b5"
// // }
// // const arr=new Array()
// // arr[0]=newSlot1
// // arr[1]=newSlot2
// //const user2= await AcademicStaffModel.findByIdAndUpdate("5fe4320666d23941b83c45b5",{schedule:arr})
// //  console.log(user)

// // const u=await AcademicStaffModel.findById("5fe4320666d23941b83c45b5")
// // const c=u.schedule
// // for(var i=0;i<c;i++)
// // console.log(c[i].day+" "+c[i].number)

// // const course=await CourseModel.findById("5fe43f5252560d16f0580e1c")
// // console.log(course.name)
// // const course2=await CourseModel.findById("5fe1048475f81f0470b078b5")
// // console.log(course2.name)

// // const user=await StaffMemberModel.findById("5fdc1c399d5e1e0b58bd1e4f")
// // // const not=user.notifications
// // // console.log("not= "+user)
// // // const m=moment("2020-12-08T22:00:00.000+00:00").format("YYYY-MM-DD")
// // // console.log(m)
  
// // // const sent=await request.find({sentBy:"5fdc1c399d5e1e0b58bd1e4f"})
// // // if(sent.length==0){
// // //     return console.log("There are no submitted requests to display.")
// // // }
// // // console.log()
// // //console.log(moment("2020-12-24T18:56:07.808+00:00").format("YYYY-MM-DD"))
// // // const check=("2020-12-25T00:00:00.000+00:00"==moment("2020-12-25"))
// // // // console.log(new moment().format().toString())
// // //  console.log(moment("2020-12-28T22:00:00.000+00:00").format("YYYY-MM-DD"))
// // // console.log(check)
// // const t=moment("2020-12-29").format("YYYY-MM-DD hh:mm:ss A")
// // const currRequest=await request.find({reqType:"Replacement",submission_date:"2020-12-25",slotDate:t
// //    , slotNum:1,slotLoc:"c7.101",sentBy:"5fe5a6b1e6bee81f985e560f",sentTo:"5fe5a7a929927c4a44f65004"})
// //    console.log("curr= "+currRequest)


   const salt=await bcrypt.genSalt();     
        const hashedPassword=await bcrypt.hash("123456",salt);
        console.log("hashed pass= "+hashedPassword)
        // const one="2021-01-06"
        // const two="2021-01-10"
        // const check=one<two
        // console.log(check)
        console.log("h= "+moment("2021-01-19T00:00:00.000+00:00").format("YYYY-MM-DD"))
        const ann=await request.find({reqType: 'Annual Leave',sentBy:"5fe5a6b1e6bee81f985e560f"})
        console.log("ann= "+ann)
        // const r=await request.find({reqType:"Replacement",slotDate:new Date("2021-01-12")})--
        // console.log(r)
    //  console.log("2021-01-11T22:00:00.000Z"==moment("2021-01-12").format())
// //     const s="08:00"
// //     const d="12:50"
// //     const check=(s>d)
// //     console.log(check)
// try{
// const user=await StaffMemberModel.findById("5fe5a6b1e6bee81f985e560f")
// if(!user)
// console.log("no user")
// console.log("user=" +user)}
// catch(error) {console.log("err= "+error)}
// var new_date = moment("2020-12-31", "YYYY-MM-DD").add(5, 'days');
// var check=new_date.isBefore("2021-01-05")
// console.log(new_date)
// console.log(check)
// console.log(moment("2020-20-01").format("YYYY-MM-DD"))

//     const salt=await bcrypt.genSalt();     
//     const hashedPassword=await bcrypt.hash("123456",salt);
//     // const arr=[1,2,3]
//     // arr.push(4)
//     // console.log(arr)
//     console.log(hashedPassword)
//        // console.log(await request.findOne({requestID:"Replacement-2"}))
//   //  console.log(moment().format("HH:mm".toString()))
//         // console.log(moment("2020-12-18T22:00:00.000+00:00").format("YYYY-MM-DD"))
//         // const x=["1","2","3"]
//         // var newSignins=x
//         // newSignins[x.length]=4
//         // console.log("1111111111111111111111111111111111111="+newSignins[0])
//         // console.log("2222222222222222222222222222222222222="+newSignins[1])
//         // signins=newSignins
//         // console.log("SIGNINNNNNNNNNNNNNNNNNNNNNNN= "+newSignins)
//         // console.log(moment("2020-01-04T22:00:00.000+00:00").format("YYYY-MM-DD"))
//         // try{
            
//         // const staffReplacement= (await StaffMemberModel.findByIdAndUpdate("5fe5a752b0c2c8365c564df1",{notifications:[]}))
//         // console.log(staffReplacement)
//         // }
//         // catch(err){
//         //     console.log("error")
//         // }
        // console.log(moment("2021-01-11T22:00:00.000+00:00").format("YYYY-MM-DD"))
}//
cr()

























