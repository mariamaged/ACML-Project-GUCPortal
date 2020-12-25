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
app.route('/Location')

//deleting
.delete(async (req,res)=>{
   try{
    const{id}=req.body;
   if(!id) res.status(400).json({msg:"please enter the id of the location to be deleted"});
   else{ 
    const loc=await location.findOne({"id":id});
    if(loc== null) res.send("this location does not exist");
    else{
    if(loc.type=="Office"){       
        const staff=await StaffMember.find({"office":loc._id})
        for(var i=0;i<staff.length;i++){
            staff.office=null;
        }
        staff.save();
    }
    else {
       const staff= await AcademicStaff.find();
       for(var i=0;i<staff.length;i++){
           for(var j=0;j<staff[i].schedule.length;j++){
               if(staff[i].schedule[j].location==loc._id){
                    staff[i].schedule[j].location=null;
                   j--;
               }
           }
       }
    }
       await location.deleteOne({"id":id});
       res.send("done");
        
    }
    }
}catch(err){
    res.status(500).json({error:err.message});
}
})

//updating 
.put(async(req,res)=>{
    try{
        const{oldid,id,type,maximum_capacity}=req.body;
        if(!oldid||!id||!type||!maximum_capacity) res.status(400).json({msg:"please fill all the fields for the location to be updated successfully"});
        else{
            const Obid= await location.findOne({"id":oldid});
            if(Obid==null) res.status(400).json({msg: "There is no Location with this id to update"});
           else{
            if(Obid.current_capacity>maximum_capacity)
             res.status(400).json({msg:"Cannot update the current capacity of this location is already exceeding the new maximum capacity."});
            else{
             if(Obid.type!=type){   
               if(Obid.type=="Office"){
                const staff=await StaffMember.find({"office":Obid._id});
                for(var i=0;i< staff.length;i++){
                    staff[i].office=null;
                    staff[i].save();
                }
            
               }
               else{
                   const staff=await AcademicStaff.find();
                   for(var i=0;i<staff.length;i++){
                       for(var j=0;j<staff.schedule.length;j++){
                           if(staff[i].schedule[j].location==Obid._id)
                              staff[i].schedule[j].location=null;
                       }
                       await staff[i].save();
                   }
               }
                Obid.type=type;
             }
             const newob=await location.findOne({"id":id});
             if(newob==null|| id==oldid){
             Obid.id=id;}
             else res.status(400).json({msg:"the new id already exists"})
             Obid.maximum_capacity=maximum_capacity;
             await Obid.save();
             res.send("done");  
              }
              }  
            }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})

//faculty addition,deletion,and updating
//adding
app.route('/Faculty')

//deleting
.delete(async (req,res)=>{
    try{
        const{name}=req.body;
        if(!name) res.status(400).json({msg:"Please insert the name of the faculty you want to delete."});
        else{
            const fac=await faculty.findOne({"name":name});
            if(fac==null) res.send("this faculty does not exist");
            else{
            const s=await AcademicStaff.find({"faculty":fac.__id});
            for(var i=0;i<s.length;i++){
                await StaffMember.deleteOne({"_id":s[i].member});
            }    
            await AcademicStaff.deleteMany({"faculty":fac._id});    
            const departmentstodelete=await department.find({"faculty":fac._id});
            //const coursestodelete= [];
            for(var i=0;i<departmentstodelete.length;i++){
                //coursestodelete.push(await course.find({"department":departmentstodelete[i]._id}));
                await course.deleteMany({"department":departmentstodelete[i]._id});
            }    
            await department.deleteMany({"faculty":fac._id});
            await faculty.deleteOne({"name":name});
            res.send("Done");
            }
        }
    }catch(err){
        res.status(500).json({msg:{error:err.message}})
    }
})

//updating
.put(async (req,res)=>{
    try{
        const{oldname,name}=req.body;
        if(!name) res.status(400).json({msg:"Please insert the name of the faculty you want to delete."});
        else{
            const ob= await faculty.findOne({"name":oldname});
            const obnew=await faculty.findOne({"name":name});
            if( (obnew==null || name==oldname)&& ob!=null ) {ob.name=name; await ob.save();res.send("done");}
            else res.status(400).json({msg:"please enter correct data"});
        }
    }catch(err){
        res.status(500).json({msg:{error:err.message}})
    }
})


const bcrypt=require('bcrypt');
app.route('/staffmember').post(async(req,res)=>{
    try{
       const{name,email,salary,officelocation,type,dayoff,gender,actype,departmentname,facultyname,courses}=req.body;
       if(!email||!salary||!officelocation|| !gender||!type) res.status(400).json({msg:"please fill all the fields"});
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
                        var fac;
                        var dep;
                         if(!actype||!departmentname||!facultyname)message="please fill the required data fields";
                         else{
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
                            if(dep==null||fac==null) message="the data you entered is incorrect";
                            else flag=true;
                     }
                     const salt=await bcrypt.genSalt(10);
                     const hashedPassword=await bcrypt.hash("123456",salt);
                     const toAdd=await new StaffMember({"password":hashedPassword,"newStaffMember":true,"id":sid,"email":email,"salary":salary,"name":name,"office":office._id,"staff_type":type,"dayoff":doff,"gender":gender});
                     await toAdd.save();
                     office.current_capacity+=1;
                     await office.save();
                     if(flag==true){
                     const ac= await new AcademicStaff({"courses":courses,"member":toAdd._id,"day_off":dayoff,"faculty":fac._id,"department":dep._id,"type":actype});
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











//department addition,deletion,and updating
//adding
app.route('/department')
//deleting
.delete(async(req,res)=>{
    try{
        const{name}=req.body;
        if(!name) res.status(400).json({msg:"Please insert the name of the department you want to delete."});
        else{
            const dep= await department.findOne({"name":name});
            if(dep==null) res.send("this department already does not exist");
            else{
            await course.deleteMany({"department":dep._id});
            const s=await AcademicStaff.find({"department":dep._id});
            for(var i=0;i<s.length;i++){
                await StaffMember.deleteOne({"_id":s[i].member});
            }
            await AcademicStaff.deleteMany({"department":dep._id});
            await department.deleteOne({"name":name});
            res.send("done");
            }
        }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//updating
.put(async(req,res)=>{
    try{
       const{oldname,name,facultyname,hodid}=req.body;
       if(!oldname||!name||!facultyname) res.status(400).json({msg:"Please fill all the fields."});
       else{
           const ob= await department.findOne({"name":oldname});
           if(ob==null) res.status(400).json("there is no department with that name.");
           else{
               var hod1=ob.hod;
               var messge="";
             if(hodid) {
                const h= await AcademicStaff.findOne({"id":hodid});
                if(h==null)  messge="there is no Academic member with the id you entered.";
                else
                hod1=h._id;
             }
             const obnew=await department.findOne({"name":name});
             if( obnew==null || name==oldname){
                const fid=await faculty.findOne({"name":facultyname});
                if(fid==null) res.status(400).json({msg:(messge+"No faculty with that name exists.")})
                else{
                ob.name=name;
                ob.faculty=fid._id;
                ob.HOD=hod1;
                await ob.save();
                res.send("done");
                }
            }
             else res.status(400).json({msg:"A department with that new name already exists"});
           }
       }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})





/////////////////////////////////////////////////////////////////////////////////////
//instructor routes

//slots assignment
app.get('/slotsAssignment',async (req,res)=>{
    try{
    //    if(req.user.role=="Course Instructor"){
    //     const inst=await AcademicStaff.findOne({"_id":req.user.id});
     //for testing 
     const inst=await AcademicStaff.findOne({"id":"ac-1"});
     //end
        if(inst==null) res.status(400).json({msg:"Something went wrong"});
        else{
          const courses=inst.courses;
          var assignments= [courses.length]; 
          for(var i=0;i<courses.length;i++){
            var c= await course.findOne({"_id":courses[i]}); 
            assignments[i]=await c.schedule;           
         }
         res.send(assignments);
        }
       //}
      // else res.status(400).json({msg:"Access denied"});
    }catch(err){ 
        res.status(500).json({error:err.message});}
})



app.route('/Assignment').post(async(req,res)=>{
    try{
    //  if(req.user.role=="Course Instructor"){
    //      const instr=await StaffMember.findOne({"_id":req.user.id});
    //    //make sure instr is not null elawl
    //    if(instr==null) res.status(400).json({msg:"something went wrong"});
    //    else{
    //      const inst=await AcademicStaff.findOne({"member":instr._id});
        
       //for testing 
        const instr=await StaffMember.findOne({"id":"ac-3"});
        const inst=await AcademicStaff.findOne({"member":instr._id});
       // end
         if(inst==null) res.status(400).json({msg:"Something went wrong"});
         else{
          const{courseid,day,number,slocation,memid}=req.body;
          if(!courseid||!day||!number||!slocation||!memid) res.status(400).json({msg:"please fill all the required fields"});
          else{
              const loc=await location.findOne({"id":slocation});
              if(loc==null) res.status(400).json({msg:"the location you entered does not exist"});
              else{
              var assigned=false;
              const thecourse=await course.findOne({"id":courseid});
              if(thecourse==null) res.status(400).json({msg:"this course id does not exist"});
              else{
              for(var i=0;i<inst.courses.length;i++){
                  if(inst.courses[i]==thecourse._id){assigned=true; break;}
              }
              //if(!assigned) res.status(400).json({msg:"you are not assigned to this course"});
              //else{
                 const smem= await StaffMember.findOne({"id":memid});
                 if(smem==null) res.status(400).json({msg:"There is no TA in your department with that id"});
                 else{
                 const mem=await AcademicStaff.findOne({"member":smem._id});
                 if(mem==null || mem.type!="Teaching Assistant"|| ((String)(mem.department))!=((String)(inst.department))) res.status(400).json({msg:"There is no TA in your department with that id"});
                 else{        
                  var free=true;
                  for(var i=0;i<mem.schedule.length;i++){
                     if(mem.schedule[i].day==day && mem.schedule[i].number==number){free=false; break;}
                  }
                  if(free){
                      var duplicate=false;
                     for(var i=0;i<mem.courses.length;i++){
                         if(mem.courses[i]==thecourse._id){duplicate=true; break;}
                     }
                     //keda sah wla ahoto fe object??
                     if(!duplicate) mem.courses.push(thecourse._id);
                     mem.schedule.push({"day":day,"number":number,"location":loc._id,"academic_member_id":mem._id,"course":thecourse._id});
                     var slotbelongs=false;
                   for(var i=0;i<thecourse.schedule.length;i++){
                     if(thecourse.schedule[i].day==day && thecourse.schedule[i].number==number && ((String)(thecourse.schedule[i].location))==((String)(loc._id))){
                         slotbelongs=true;
                         if(thecourse.schedule[i].academic_member_id==null) thecourse.schedule[i].academic_member_id=mem._id;
                         else res.status(400).json({msg:"the slot is already assigned"});
                         break;
                      }
                     }
                     if(slotbelongs){
                     duplicate=false;
                   for(var i=0;i<thecourse.academic_staff.length;i++){
                     if(thecourse.academic_staff[i]==mem._id){duplicate=true; break;}
                    }
                   if(!duplicate) thecourse.academic_staff.push(mem._id);
                   thecourse.slots_covered+=1;
                   await mem.save();
                   await thecourse.save();
                   res.send("done"); 
                } else res.status(400).json({msg:"this slot does not belong to this course"}); 
                     }
                        else res.status(400).json({msg:"the member you want to assign this slot to is already busy at this time."});
                    
                 
                 }
              }
 
       }
     } 
 //}
          }}
// }
//}
 //else res.status(400).json({msg:"Access denied"});
    }catch(err){
          res.status(500).json({error:err.message});
    }
 })