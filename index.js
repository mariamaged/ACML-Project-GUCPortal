const express = require('express');
const app =express();
const mongoose =require('mongoose');

//for testing-----------------------------------------
const StaffMemberRoutes=require('./Routes/StaffMemberRoutes')
const department=require('./Models/DepartmentModel')
const AcademicStaff=require('./Models/AcademicStaffModel')
const faculty=require('./Models/FacultyModel')
const location=require('./Models/LocationModel');
const StaffMember = require('./Models/StaffMemberModel');
//maya zawedt da
const course=require('./Models/CourseModel');
const HRrouter=('./Routes/HRroute');
//----------------------------------------------
require('dotenv').config()

//app.use(express.json())
var bodyParser = require('body-parser');
const router = require('./Routes/HRroute');
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
//app.use(authenticateToken);


//for testin only------------------------------------REMOVE AFTERRRRRRRRRRR TESTINGGGGGGGGGGGGGGGGGGGGG--
//---------------------------------------------------INSERTING IN TABLES DEPARTMENT ,FACULTY ,STAFF MEMBER ,ACADEMIC MEMBER
// app.post('/addFaculty',async(req,res)=>{
//     const fac=new faculty({name:req.body.name})
//    await fac.save();
//    res.json(fac)

//    //"name":"met"
// })

// app.post('/addDepart',async(req,res)=>{
//     // fac=faculty.find({name:"met"})
//     const fac=(await faculty.find({name:req.body.facName}))[0]._id
//     const dep=new department({name:req.body.name,faculty:fac})
//     await dep.save();
//     res.json(dep)
//    // console.log(dep)
//     //"name":"engineering",
//     //"facName":"met"

// })

// app.post('/addLoc',async(req,res)=>{
//     const loc=new location(req.body)
//     await loc.save()
//     res.json(loc)

//     //   "id":"c7.101",
//     // "type":"Tutorial Room",
//     // "maximum_capacity":"15"
// })



// app.post('/Member',async(req,res)=>{
//     // const office3=(await location.find({id:req.body.office}))[0]._id
//     // console.log(office3)
//     // const fac=(await faculty.find({name:"met"}))[0]._id;
//     // console.log(fac)
// //     //res.json(req.body)
// //     // if(!req.body.id){
// //     //     res.json("please enter id")
// //     // }
// //     // else res.json(req.body.id)
// //    // console.log("lala")
// //     //else{
// //     const name2=req.body.name
// //     const id2=req.body.id
// //     const email2=req.body.email
// //     const salary2=req.body.salary
// //     const office2=(await location.find({id:req.body.office}))[0]._id
// //     const staff_type2=req.body.staff_type
// //     console.log(name2)
// //     console.log(id2)
// //     console.log(email2)
// //     console.log(salary2)
// //     console.log(office2)
// //     console.log(staff_type2)
// //     const mem=new StaffMemberModel({name:name2},{id:id2},{email:email2},{salary:salary2},{office:office2},{staff_type:staff_type2});
// //     try{
// //     await mem.save();
// //     res.json(mem)
// //         }
// //     catch(err){
// //         res.json(err)
// //        }
//     // //}
    
// //    "name":"nada"
// //    ,"id":"ac-2"
// //    ,"email":"nada99@gmail.com"
// //    ,"salary":"2000"
// //    ,"office":"c7.101"
// //    ,"staff_type":"Assistant"
// })

// const  memeee=new StaffMemberModel({
//     name:"asdad",
//     id:1,
//     email:"dasdasd",
//     salary:22,
//     office:"5fda77733d34934a248e3e08",
//     staff_type:"HR"

// })
// memeee.save();
// console.log(memeee)


// app.post('/addAc',async(req,res)=>{
//    // res.json(req.body)
    
//     if(!req.body.faculty || !req.body.type){
//         res.json("need faculty and type")
//     }
//     else{
//      const memb=StaffMemberModel.find({id:req.body.id})._id;
//     const dep=department.find({name:req.body.dep})._id;
//     const fac=faculty.find({name:req.body.faculty})._id;
//     const type=req.body.type;
    
//     try{
//         const user=new AcademicStaffModel({member:memb},{department:dep},{faculty:fac},{type:req.body.type});
//         await user.save();
//         res.json(user)
//     }
//     catch(err){
//         res.json(err)
//     }
//     }
// //    ,"id":"ac-3"
// //    ,"dep":"engineering"
// //    ,"faculty":"met"
// //    ,"type":"Academic Member"
// })

const bcrypt=require('bcrypt');
app.route('/staffmember').post(async(req,res)=>{
    try{
       const{name,email,salary,officelocation,type,dayoff,gender,actype,departmentname,facultyname}=req.body;
       if(!email||!salary||!officelocation|| !gender) res.status(400).json({msg:"please fill all the fields"});
       else{
           var flag=false;
           const isemail=await StaffMember.findOne({"email":email});
           if(isemail==null){
            const office=await location.findOne({"id":officelocation,"type":"Office"});
             if(office==null) res.status(400).json({msg:"there is no office in this location"});
             else{
                 if(office.current_capacity==office.maximum_capacity) res.status(400).json({msg:"the office in the location provided is already at maximum capacity"}); 
                 else{
                     var message="done";
                     var doff=dayoff;
                     var sid=null;
                     if(type=="HR" && dayoff!="Saturday") {message="Saturday is automatically assigned to HR members as dayoff"; doff="Saturday";}
                     const num=await StaffMember.countDocuments();
                     console.log(num);
                     if(type=='HR'){
                     for(var i=num;i>=0;i--){
                        if(i==0){
                            sid="hr-1";
                            break;
                        }
                         var tuple=await StaffMember.findOne({"id":"hr-"+i});
                         if(tuple!=null) {sid="hr-"+(i+1); break;}
                     }}else{
                         if(!actype||!departmentname||!facultyname)res.status(400).json({msg:"please fill the required data fields"});
                         else{
                             var fac;
                             var dep;
                          for(var i=num;i>=0;i--){
                             if(i==0){
                                sid="ac-1";
                                break;
                            }
                            var tuple=await StaffMember.findOne({"id":"ac-"+i});
                            if(tuple!=null) {sid="ac-"+(i+1); break;} 
                            }
                            }
                             dep=await department.findOne({"name":departmentname});
                             fac=await faculty.findOne({"name":facultyname});
                            if(dep==null||fac==null) res.status(400).json({msg:"the data you entered is incorrect"});
                            else flag=true;
                     }
                     const salt=await bcrypt.genSalt(10);
                     const hashedPassword=await bcrypt.hash("123456",salt);
                     const toAdd=await new StaffMember({"password":hashedPassword,"newStaffMember":true,"id":sid,"email":email,"salary":salary,"name":name,"office":office._id,"staff_type":type,"dayoff":doff,"gender":gender});
                     await toAdd.save();
                     office.current_capacity+=1;
                     await office.save();
                     if(flag==true){
                     const ac= await new AcademicStaff({"member":toAdd._id,"day_off":dayoff,"faculty":fac._id,"department":dep._id,"type":actype});
                     await ac.save();
                    }
                    
                     res.send(message);
                 }
             }
           }
           else res.status(400).json({msg:"this email is already registered"})
       }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
.delete(async (req,res)=>{
    try{
        //ydeeny email wla id?
        const{email}=req.body;
        if(!email) res.status(400).json({msg:"please insert the email of the staff member you want to delete"});
        else{
          const person= await StaffMember.findOne({"email":email});
          if(person==null) res.send("a person with this email already does not exist");
          else{
           const office=await location.findOne({"_id":person.office});
           office.current_capacity-=1;
           await office.save();
           if(person. staff_type=="Academic Member"){
            const ac=await AcademicStaff.findOne({"member":person._id});   
            const courses=ac.courses;
            const schedule=ac.schedule;
            for(var i=0;i<schedule.length;i++){
                for(var j=0;j<courses.length;j++){
                   if(schedule[i].course==courses[j]){
                       var c=await course.findOne({"_id":courses[j]});
                       c.slots_covered-=1;
                       await c.save();
                       break;
                   }
                }
            }   
            await AcademicStaff.deleteOne({"member":ac.member});
          }
           await StaffMember.deleteOne({"email":email});
           res.send("done");
          }
        }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//bcrypt hena kaman
.put(async(req,res)=>{
try{
   const{oldemail,email,name,password,office,newStaffMember,annualdays,lastupdatedannual,accidentaldaysleft,attendcompensationday}=req.body;
   if(!oldemail) res.status(400).json({msg:"please insert the email of the staff member you want to update"});
   else{
       const ob=await StaffMember.findOne({"email":oldemail});
       if(ob==null) res.status(400).json({msg:"there is no staff member with that email"});
       else{
            if(office){
                const o=await location.findOne({"id":office});
                if(o==null) res.status(400).json({msg:"there is no office in this location"});
                else{
                    if(o.current_capacity<o.maximum_capacity){
                        const oldoffice=await location.findOne({"_id":ob.office});
                        oldoffice.current_capacity-=1;
                        ob.office=(await o)._id;
                        o.current_capacity+=1;}
                    else res.status(400).json({msg:"the office you provided is already at full capacity"});    
                }
            }
            if(email){
                const newob=await StaffMember.findOne({"email":email});
                if(newob==null || email==oldemail){
                   (await ob).email=email;}
                else res.status(400).json({msg:"a user with this email already exists"});
            }
            //fadel hettet bcrypt dy  
            if(password){
                const salt=await bcrypt.genSalt(10);
                const hashedPassword=await bcrypt.hash(password,salt);
                ob.password=hashedPassword;}
            if(name) ob.name=name;
            if(newStaffMember) ob.newStaffMember=newStaffMember;
            if(annualdays) ob.annualdays=annualdays;
            if(lastupdatedannual) ob.lastupdatedannual=lastupdatedannual;
            if(accidentaldaysleft) ob.accidentaldaysleft=accidentaldaysleft;
            if(attendcompensationday) ob.attendcompensationday=attendcompensationday;
            await ob.save();
            res.send("done");
       }
   }
}catch(err){
    res.status(500).json({error:err.message});
}
})

app.route('/updatesalary').put(async(req,res)=>{
    try{
       const{email,salary}=req.body;
       if(!email||!salary) res.status(400).json({msg:"please fill all the fields"});
       else{
           const ob=await StaffMember.findOne({"email":email});
           if(ob==null) res.status(400).json({msg:"a staff member with this email is not found"});
           else (await ob).salary=salary;
           await ob.save();
           res.send("done");
       }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})






app.route('/attendance').get(async(req,res)=>{
    const email=req.body.email;
    if(!email) res.status(400).json({msg:"please insert the email of the member you need the attendance records of"});
    else{
        const mem= await StaffMember.findOne({"email":email});
        if(mem==null) res.status(400).json({msg:"there is no user with this email"});
        else
            res.send(mem.attendance);
    }
})


