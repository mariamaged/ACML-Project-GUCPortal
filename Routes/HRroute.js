const express=require('express')
const router=express.Router();
const AcademicStaff=require('../Models/AcademicStaffModel.js')
const StaffMember=require('../Models/StaffMemberModel.js')
const StaffMemberModel = require('../Models/StaffMemberModel.js')
const location= require('../Models/LocationModel.js')
const HR=require('../Models/HRModel.js');
const faculty=require('../Models/FacultyModel');
const department=require('../Models/DepartmentModel');
const course=require('../Models/CourseModel');
const jwt=require('jsonwebtoken');


//Locations Adding,deleting, and updating
//fadel autherization
//adding
router.route('Location').post(async(req,res)=>{
    //to authorize
    if(req.user.role!='HR')
      res.status(401).send('Access Denied');
    else{  
    try{
        //yedakhaly max_capacity wla ahotaha ana based 3la el type?
        const{id,type,maximum_capacity}=req.body;
        if(!id || !type || !maximum_capacity)
           return res.status(400).json({msg:"Please enter a correct location"});
        else{
            const loc=await location.findOne({"id":id});
            if(loc!=null) res.status(400).json({msg:"a location with this id already exists"});
            else{
              toAdd= new location({id,type,maximum_capacity,current_capacity:0});
              await toAdd.save();
              res.json(toAdd);
              console.log(toAdd);   
        }
    }
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
    }
})

//deleting
.delete(async (req,res)=>{
   try{
    const{id}=req.body;
   if(!id) res.status(400).json({msg:"please enter the id of the location to be deleted"});
   else{ 
    const loc=await location.findOne({"id":id});
    if(loc== null) res.send("this location does not exist");
    else{
    if(loc.type=="Office")       
        await StaffMember.deleteMany({"office":loc._id})  
    else {
       const staff= await AcademicStaff.find();
       for(var i=0;i<staff.length;i++){
           for(var j=0;j<staff[i].schedule.length;j++){
               if(staff[i].schedule[j].location==loc._id){
                   delete staff[i].schedule[j];
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
            if(obid==null) res.status(400).json({msg: "There is no Location with this id to update"});
           else{
            if(Obid.current_capacity>maximum_capacity)
             res.status(400).json({msg:"Cannot update the current capacity of this location is already exceeding the new maximum capacity."});
            else{
             Obid.type=type;
             if(!location.find(id)){
             Obid.id=id;}
             else res.status(400).json({msg:"the new id already exists"})
             Obid.maximum_capacity=maximum_capacity;
             await Obid.save();
             res.send("done");  
            }
              }      }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})

//faculty addition,deletion,and updating
//adding
router.route('/Faculty').post(async(req,res)=>{
    try{
    const{name}=req.body;
    if(!name) res.status(400).json({msg:"please enter the faculty name"});
    else{
    toAdd=new faculty({name});
    await toAdd.save();}
    res.json(toAdd);
    console.log(toAdd);}
    catch(err){
        res.status(500).json({msg:{error:err.message}});
    }
})

//deleting
.delete(async (req,res)=>{
    try{
        const{name}=req.body;
        if(!name) res.status(400).json({msg:"Please insert the name of the faculty you want to delete."});
        else{
            const fac=await faculty.findOne({"name":name});
            if(fac==null) res.send("this faculty does not exist");
            else{
            const s=await AcademicStaff.find({"faculty":fac._id});
            console.log(s);
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

//department addition,deletion,and updating
//adding
router.route('/department').post(async(req,res)=>{
    try{
     const{name,facultyname,hod}=req.body;
     //HOD could be null as in not yet assigned
     if(!name || !facultyname) res.status(400).json({msg:"Please fill the fields correctly"});
     else{
         if(await department.findOne({"name":name})) res.status(400).json({msg:"A department with this name already exists."});
         else{
         var toAdd=null;
         const fid=await faculty.findOne({"name":facultyname});
         if(fid==null) res.status(400).json({msg:"The faculty name you entered is incorrect"});
         else{
         if(hod==null) toAdd=new department({"name":name,"faculty":fid._id,"HOD":null});
         else toAdd=new department({"name":name,"faculty":fid._id,"HOD":hod});
         await toAdd.save();
         res.json(toAdd);
         console.log(toAdd);
        }
       }
    }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
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
//courses addition,deletion, and updating
//adding
router.route('/course').post(async(req,res)=>{
    try{
        const{id,name,departmentname}=req.body;
        if(!id||!name||!departmentname) res.status(400).json({msg:"please fill all the fields"});
        else{
            const dep= await department.findOne({"name":departmentname});
            if(dep==null) res.status(400).json({msg:"there is no department with that name"});
            else{
                const ob=await course.findOne({"id":id});
                if(ob==null){  
                const toAdd=new course({"id":id,"name":name,"department":dep._id}); 
                await toAdd.save();
                res.json(toAdd);
                console.log(toAdd);
                }
                else{
                    res.status(400).json({msg:"a course with this id already exists"});
                }
            }
        }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//deleting
.delete(async(req,res)=>{
    try{
       const{id}=req.body;
       if(!id)res.status(400).json({msg:"please enter the id of the course you want to delete"});
       else{
           //assuming academic members only teach courses in their department
           const c=await course.findOne({"id":id});
           if(c==null) res.send("a course with this id already does not exist");
           else{
        //    const staff= await AcademicStaff.find({"department":c.department});
        //    for(var i=0;i<staff.length;i++){
        //        for(var j=0;j<staff[i].courses.length;j++){
        //            if(staff[i].courses[j]==c._id){ delete staff[i].courses[j]; j--; break;}
        //        }
        //        await staff[i].save();
        //    }
           for(var i=0;i<c.academic_staff.length;i++){
               var s=await AcademicStaff.findOne({"_id":c.academic_staff[i]});
               //delete the course
               for(var j=0;j<s.courses.length;j++){
                  if(((String)(s.courses[j]))==((String)(c._id))){
                    await  delete s.courses.splice(j,1);
                    break;
                  }
               }
               //remove it from the schedule
               for(var j=0;j<s.schedule.length;j++){
                   if(((String)(s.schedule[j].course))==((String)(c._id))){ await delete s.schedule.splice(j,1); j--;}
               }
               await s.save();
           }
           await course.deleteOne({"id":id});
           res.send("done");
           }
       }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//updating
.put(async (req,res)=>{
    try{
        //academic staff is a list of staff members ids
       const{oldid,id,name,departmentname,slotsneeded,slotscovered,schedule}=req.body;
       if(!oldid||!id||!name||!departmentname) res.status(400).json({msg:"please fill all the fields"});
       else{
           const ob=await course.findOne({"id":oldid});
           if(ob==null) res.status(400).json({msg:"there is no course with that id"});
           else{
               const obnew= await course.findOne({"id":id});
               const dep=await department.findOne({"name":departmentname});
               if(dep==null) res.status(400).json({msg:"there is no department with the given name"});
               else{
                   if(obnew==null||id==oldid){
                      if(slotsneeded) ob.slots_needed=slotsneeded;
                      if(slotscovered) ob.slots_covered=slotscovered;
                    //   if(coordinator){
                    //       const co=(await StaffMember.findOne({"id":coordinator}));
                    //       if(co==null) res.status(400).json({msg:"the coordinator id does not exist"});
                    //       else{
                    //       const ca=await AcademicStaff.findOne({"member":co._id});
                    //       if(ca==null || ca.type!= 'Teaching Assistant') res.status(400).json({msg:"the id of coordinator doesn't belong to a TA"});
                    //       else
                    //           ob.coordinator=co._id;
                    //   }
                    // }
                      //to test
                    //   if(academicStaff){
                    //     var acStaff=String [academicStaff.length];
                    //     for(var i=0;i<academicStaff.length;i++){
                    //         var sm= (await StaffMember.findOne({"id":academicStaff[i]}))._id
                    //         var ac=await AcademicStaff.findOne({"member":sm});
                    //         if(ac!=null) acStaff[i]=sm;
                    //         else{
                    //             res.status(400).json({msg:"one of the academic staff you are adding doesn't exist"});
                    //             break;
                    //         }
                    //     } 
                    //   }
                      //to test w check the logic
                      if(schedule) ob.schedule=schedule;
                        ob.id=id;
                        ob.name=name;
                        ob.department= dep._id
                        await ob.save();
                        res.send("done");
                   }
                   else
                   res.status(400).json({msg:"a course with this new id already exists"});
               }
           }
       }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//staffmember
//elmafrood a bcrypt el password hatta lw default?
//when academic staff add lel table/delete/update
const bcrypt=require('bcrypt');
router.route('/staffmember').post(async(req,res)=>{
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
           if(person.staff_type=="Academic Member"){
            const ac=await AcademicStaff.findOne({"member":person._id});   
            const courses=ac.courses;
            const schedule=ac.schedule;
            // for(var i=0;i<schedule.length;i++){
            //     for(var j=0;j<courses.length;j++){
            //        if(((String)(schedule[i].course))==((String)(courses[j]))){
            //            var c=await course.findOne({"_id":courses[j]});
            //            c.slots_covered-=1;
            //            await c.save();
            //            break;
            //        }
            //     }
            // }
            for(var i=0;i<courses.length;i++){
                var thec=await course.findOne({"_id":courses[i]});
                //remove from academic staff
                for(var j=0;j<thec.academic_staff.length;j++){
                    if(((String)(thec.academic_staff[j]))==((String)(ac._id))){ thec.academic_staff.splice(j,1); break}
                } 

                //remove from each slot assigned to the member
                for(var j=0;j<thec.schedule.length;j++){
                    if(((String)(thec.schedule[j].academic_member_id))==((String)(ac._id))){ thec.schedule[j].academic_member_id=null;}
                }
                thec.slots_covered-=1;
                await thec.save();
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
       const{oldemail,email,password,office,newStaffMember,annualdays,lastupdatedannual,accidentaldaysleft,attendcompensationday}=req.body;
       if(!oldemail) res.status(400).json({msg:"please insert the email of the staff member you want to update"});
       else{
           const ob=await StaffMember.findOne({"email":oldemail});
           if(ob==null) res.status(400).json({msg:"there is no staff member with that email"});
           else{
               var message="";
                if(office){
                    const o=await location.findOne({"id":office});
                    if(o==null || o.type!="Office") message="there is no office in this location";
                    else{
                        if(o.current_capacity<o.maximum_capacity){
                            const oldoffice=await location.findOne({"_id":ob.office});
                            oldoffice.current_capacity-=1;
                            ob.office=(await o)._id;
                            o.current_capacity+=1;}
                        else message="the office you provided is already at full capacity";    
                    
                        }}
                if(email){
                    const newob=await StaffMember.findOne({"email":email});
                    if(newob==null || email==oldemail){
                       (await ob).email=email;}
                    else message="a user with this email already exists";
                }
                //fadel hettet bcrypt dy  
                if(password){
                    const salt=await bcrypt.genSalt(10);
                    const hashedPassword=await bcrypt.hash(password,salt);
                    ob.password=hashedPassword;}
                if(newStaffMember) ob.newStaffMember=newStaffMember;
                if(annualdays) ob.annualdays=annualdays;
                if(lastupdatedannual) ob.lastupdatedannual=lastupdatedannual;
                if(accidentaldaysleft) ob.accidentaldaysleft=accidentaldaysleft;
                if(attendcompensationday) ob.attendcompensationday=attendcompensationday;
                await ob.save();
                if(message=="") message="done";
                res.send(message);
           }
       }
    }catch(err){
        res.status(500).json({error:err.message});
    }
    })

router.route('/updatesalary').put(async(req,res)=>{
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

router.route('/attendance').get(async(req,res)=>{
    const email=req.body.email;
    if(!email) res.status(400).json({msg:"please insert the email of the member you need the attendance records of"});
    else{
        const mem= await StaffMember.findOne({"email":email});
        if(mem==null) res.status(400).json({msg:"there is no user with this email"});
        else
            res.send(mem.attendance);
    }
})
module.exports=router;