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


function authenticateToken(req,res,next){
    
    const token=req.header('x-auth-token');
    if(!token){
    return res.sendStatus(401).status('Access deined please log in first.')
    }
    // const verified= jwt.verify(token, process.env.TOKEN_SECRET)
    // if(!verified){
    //     return res.json("Token is unauthorized.")
    // }
    // req.user=verified
    // console.log("in auth "+req.user)
    // next();
    try{
        const verified= jwt.verify(token, process.env.TOKEN_SECRET)
        req.user= verified
        next()
    }
    catch(err){
        res.status(400).send('Invalid Request.')
    }
}













//Locations Adding,deleting, and updating
//fadel autherization
//adding
router.route('Location').post(authenticateToken,async(req,res)=>{
    //to authorize
     const st=await StaffMember.findOne({"id":req.user.id});
     if(st.staff_type=="HR")
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
.delete(authenticateToken,async (req,res)=>{
    try{
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
      res.status(401).send('Access Denied');
    else{ 
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
        await staff[i].save();
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
            await staff[i].save();
        }
     }
        await location.deleteOne({"id":id});
        res.send("done");
         
     }
     }}
 }catch(err){
     res.status(500).json({error:err.message});
 }
 })

//updating 
.put(authenticateToken,async(req,res)=>{
    try{
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
        res.status(401).send('Access Denied');
        else{ 
        const{oldid,id,type,maximum_capacity}=req.body;
        if(!oldid||!id||!type||!maximum_capacity) res.status(400).json({msg:"please fill all the fields for the location to be updated successfully"});
        else{
            const Obid= await location.findOne({"id":oldid});
            if(Obid==null) res.status(400).json({msg: "There is no Location with this id to update"});
           else{
            if(Obid.current_capacity>maximum_capacity)
             res.status(400).json({msg:"Cannot update the current capacity of this location it is already exceeding the new maximum capacity."});
            else{
             if(Obid.type!=type){   
               if(Obid.type=="Office"){
                const staff=await StaffMember.find({"office":Obid._id});
                for(var i=0;i< staff.length;i++){
                    staff[i].office=null;
                   await staff[i].save();
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
                Obid.current_capacity=0;
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
            }}
    }catch(err){
        res.status(500).json({error:err.message});
    }
})

//faculty addition,deletion,and updating
//adding
router.route('/Faculty').post(authenticateToken,async(req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
    res.status(401).send('Access Denied');
    else{
    const{name}=req.body;
    if(!name) res.status(400).json({msg:"please enter the faculty name"});
    else{
    const f=await faculty.findOne({"name":name});
    if(f!=null) res.status(400).json({msg:"a faculty with this name already exists"});
    else{   
    toAdd=new faculty({name});
    await toAdd.save();}
    res.json(toAdd);
    console.log(toAdd);}}}
    catch(err){
        res.status(500).json({msg:{error:err.message}});
    }
})

//deleting
.delete(authenticateToken,async (req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
    res.status(401).send('Access Denied');
    else{
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
        }}
    }catch(err){
        res.status(500).json({msg:{error:err.message}})
    }
})

//updating
.put(authenticateToken, async (req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
    res.status(401).send('Access Denied');
    else{
        const{oldname,name}=req.body;
        if(!name||!oldname) res.status(400).json({msg:"Please insert the old and new name of the faculty you want to update."});
        else{
            const ob= await faculty.findOne({"name":oldname});
            const obnew=await faculty.findOne({"name":name});
            if( (obnew==null || name==oldname)&& ob!=null ) {ob.name=name; await ob.save();res.send("done");}
            else res.status(400).json({msg:"please enter correct data"});
        }}
    }catch(err){
        res.status(500).json({msg:{error:err.message}})
    }
})

//department addition,deletion,and updating
//adding
router.route('/department').post(authenticateToken,async(req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
    res.status(401).send('Access Denied');
    else{
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
    }}
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//deleting
.delete(authenticateToken,async(req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
    res.status(401).send('Access Denied');
    else{
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
        }}
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//updating
.put(authenticateToken,async(req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
    res.status(401).send('Access Denied');
    else{
       const{oldname,name,facultyname,hodid}=req.body;
       if(!oldname||!name||!facultyname) res.status(400).json({msg:"Please fill all the fields."});
       else{
           const ob= await department.findOne({"name":oldname});
           if(ob==null) res.status(400).json("there is no department with that name.");
           else{
               var hod1=ob.hod;
               var messge="";
             if(hodid) {
                const h= await StaffMember.findOne({"id":hodid});
                if(h==null)  messge="there is no Academic member with the id you entered.";
                else{
                const hac= await AcademicStaff.findOne({"member":h._id});    
                if(hac==null) messge="there is no Academic member with the id you entered.";
                else
                hod1=h._id;}
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
                if(messge="") message="done";
                res.send(message);
                }
            }
             else res.status(400).json({msg:"A department with that new name already exists"});
           }
       }}
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//courses addition,deletion, and updating
//adding
router.route('/course').post(authenticateToken,async(req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
    res.status(401).send('Access Denied');
    else{
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
        }}
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//deleting
.delete(authenticateToken,async(req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
    res.status(401).send('Access Denied');
    else{
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
       }}
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//updating
.put(authenticateToken,async (req,res)=>{
    try{
        //to authorize
    if(req.user.role!='HR')
    res.status(401).send('Access Denied');
    else{
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
       }}
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//staffmember
//elmafrood a bcrypt el password hatta lw default?
//when academic staff add lel table/delete/update
const bcrypt=require('bcrypt');
router.route('/staffmember').post(authenticateToken,async(req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
    res.status(401).send('Access Denied');
    else{
       const{name,email,salary,officelocation,type,dayoff,gender,actype,departmentname,facultyname}=req.body;
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
                     const ac= await new AcademicStaff({"member":toAdd._id,"day_off":dayoff,"faculty":fac._id,"department":dep._id,"type":actype});
                     await ac.save();
                    }
                    else {const hr=new HR({"member":toAdd._id,"day_off":"Saturday"}); 
                     await hr.save();
                    } 
                    
                     res.send(message);
                 }
             }
           }
           else res.status(400).json({msg:"this email is already registered"})
       }}
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
.delete(authenticateToken,async (req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
    res.status(401).send('Access Denied');
    else{
        //ydeeny email wla id?
        const{email}=req.body;
        if(!email) res.status(400).json({msg:"please insert the email of the staff member you want to delete"});
        else{
          const person= await StaffMember.findOne({"email":email});
          if(person==null) res.send("a person with this email already does not exist");
          else{
           const office=await location.findOne({"_id":person.office});
           if(Office!=null){
           office.current_capacity-=1;
           await office.save();}
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
                    if(((String)(thec.schedule[j].academic_member_id))==((String)(ac._id))){ thec.schedule[j].academic_member_id=null;  thec.slots_covered-=1;}
                }
               
                await thec.save();
            }   
            await AcademicStaff.deleteOne({"member":ac.member});
          }else await HR.deleteOne({"member":person._id});
           await StaffMember.deleteOne({"email":email});
           res.send("done");
          }
        }}
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//bcrypt hena kaman
.put(authenticateToken,async(req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
    res.status(401).send('Access Denied');
    else{
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
       }}
    }catch(err){
        res.status(500).json({error:err.message});
    }
    })

router.route('/updatesalary').put(authenticateToken,async(req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
    res.status(401).send('Access Denied');
    else{
       const{email,salary}=req.body;
       if(!email||!salary) res.status(400).json({msg:"please fill all the fields"});
       else{
           const ob=await StaffMember.findOne({"email":email});
           if(ob==null) res.status(400).json({msg:"a staff member with this email is not found"});
           else (await ob).salary=salary;
           await ob.save();
           res.send("done");
       }}
    }catch(err){
        res.status(500).json({error:err.message});
    }
})

router.route('/attendance').get(authenticateToken,async(req,res)=>{
    try{
    //to authorize
    const st=await StaffMember.findOne({"id":req.user.id});
    if(st.staff_type=="HR")
      res.status(401).send('Access Denied');
      else{
    const email=req.body.email;
    if(!email) res.status(400).json({msg:"please insert the email of the member you need the attendance records of"});
    else{
        const mem= await StaffMember.findOne({"email":email});
        if(mem==null) res.status(400).json({msg:"there is no user with this email"});
        else
            res.send(mem.attendance);
    }}}
    catch(err){res.status(500).json({error:err.message});}
})


router.get('/viewMissinghours',authenticateToken,async(req,res)=>{
   try{
   //to authorize
   const st=await StaffMember.findOne({"id":req.user.id});
   if(st.staff_type=="HR")
   res.status(401).send('Access Denied');
   else{  
    var members=[];
   const staff=await StaffMember.find();
   for(var a=0;a<staff.length;a++){
    var h=0;   
    const user=staff[a];
    const monthly=user.time_attended
    const month=new moment().format('M')
    const year=new moment().format('Y')
    var check=false;
    if(user.time_attended.length>0){
        for(var i=0;i<monthly.length;i++){
            if(monthly[i].num==month && monthly[i].yearNum==year){
                check=true;
                if(monthly[i].missingHours>0||monthly[i].missingMinutes>0) members.push({"name":user.name,"id":user.id,"email":user.email,"missing hours":monthly[i].missingHours,"missing minutes":monthly[i].missingMinutes});
            }
        }
    }
    // else {
        
    //     const newMonthly=new monthlyHoursSchema({
    //         num:month,
    //         yearNum:year
    //        , extraHours:0
    //         ,extraMinutes:0
    //          ,missingHours:0,
    //          missingMinutes:0
    //     })
    //     if(check==false && monthly.length==0){
    //     const arr=new Array()
    //     arr[0]=newMonthly
       
    // }
    //     else {
    //         const arr=monthly
    //         arr[arr.length-1]=newMonthly
            
    //     }
    //     //const userUp=await StaffMemberModel.findByIdAndUpdate(staff[a].id,{time_attended:arr})
    //     // res.json({missingHours:0,
    //     //     missingMinutes:0,
    //     // extraHours:0,extraMinutes:0})
    // }
   }
 return res.json(members);
}
}catch(err){res.status(500).json({error:err.message});}
})



function calculateHrs(dateMonth,day_off){
console.log("inside cal= "+dateMonth)
console.log("inside "+day_off)
var start=11
var end=0;
var hours=0;
var minutes=0;
if(dateMonth==1 ||dateMonth==3 ||dateMonth==5 ||dateMonth==7 ||dateMonth==8 ||dateMonth==10||dateMonth==12)
    end=31
if(dateMonth==4 ||dateMonth==6 ||dateMonth==9 ||dateMonth==11 )
end=30
if(dateMonth==2 ){
    if(moment(dateYear).isLeapYear())
    end=29
    else
    end=28
}
const currYear=new moment().format("Y")
for(var i=11;i<=end;i++){
   var currDay= new moment(currYear+"-"+dateMonth+"-"+i).format("dddd");
   if(currDay!= day_off && currDay!="Friday"){
        hours+=8
        if(minutes+24>60){
            hours++
            minutes=(minutes+24)-60
        }
   }
}

for(var j=1;j<=10;j++){
    var currDay= new moment(currYear+"-"+dateMonth+"-"+j).format("dddd");
    if(currDay!= day_off && currDay!="Friday"){
         hours+=8
         if(minutes+24>60){
             hours++
             minutes=(minutes+24)-60
         }
    }
 }
 console.log("inside "+hours+' m='+minutes)
 return {hours,minutes}
}





























const moment=require('moment');
router.get('/viewMissingdays',authenticateToken,async(req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
    res.status(401).send('Access Denied');
    else{
        var dateMonth=moment().format("M")
        const dateYear=moment().format("Y")
      const dateDay=moment().format("D")
     // const dateDay=2
         const staff=await StaffMember.find();
         var members=[];
         for(var a=0;a<staff.length;a++){
            const user=staff[a];
                    var day=""
                    if(user.staff_type=="HR")
                     day=(await HRModel.findOne({member:user.id})).day_off
                    else
                   day=(await AcademicStaffModel.findOne({member:user.id})).day_off
            
                    const userAttendance=user.attendance
                    var userDays=new Array()
                    var missedDays=new Array()
                    var idx=0;
                    var k=0;
                    var check=false;
                    const day_off=day
                    console.log("dayoff= "+day_off)
                    var nextMonth=0;
                    var nextYear=0;
            
                    //to get curr month and next month and year according to today's date
                    //if less than 10 then curr month=month-1 
                    if( dateDay<=10){
                        dateMonth=dateMonth-1
                    }
            
                    if(dateMonth==12){
                        nextMonth=1
                        nextYear=(parseInt(dateYear)+1) 
                    }
                     else{
                     nextMonth=(parseInt(dateMonth)+1)  
                     nextYear=dateYear
                    }
                    console.log("dateMonth= "+dateMonth+" dateYear= "+dateYear+" nextYear= "+nextYear+" nextMonth= "+nextMonth)
                    //first get list of present days in both months
                    for(var i=0;i<userAttendance.length;i++){
                        const currDay=userAttendance[i]
                        const year=moment(currDay.date).format("Y")
                        const month=moment(currDay.date).format("M")
                        
                        const dayNum=moment(currDay.date).format("D")
                        const day=moment(currDay.date).format("dddd")
                      //  console.log("in first")
                        //if 1st month will get starting from 11th day
                        if(year==dateYear && month==dateMonth && dayNum>=11){
                                userDays[idx++]=userAttendance[i]
                        }
                         //if 1st month will get till the 10th day
                        if(year==nextYear && month==nextMonth  && dayNum<=10){
                            userDays[idx++]=userAttendance[i]
                        }
                    }
            
                    //sort this array to be able to fill missing days in between present days
                    const sortedUserDays=userDays.sort(compareAsc)
                    for(var l=0;l<sortedUserDays.length;l++){
                  console.log(" sortedUserDays"+moment(sortedUserDays[l].date).format("YYYY-MM-DD"))
                    }
                    var j=0
                    var currDay=11
                    if(sortedUserDays.length>0)
                    var m= moment(sortedUserDays[j].date).format('M')
            
                    //start looping on days of first month to get missing days in between present days
                    while(j<sortedUserDays.length && m==dateMonth){
                        var d= moment(sortedUserDays[j].date).format('D')
                        console.log("d=================="+d)
                         m= moment(sortedUserDays[j].date).format('M')
                            while(d>currDay && m==dateMonth ){
                               const currYear=new moment().format("Y")
                               var currDate=new moment(currYear+"-"+dateMonth+"-"+currDay).format('dddd')
                               console.log("currDay= "+currDay+" currDate= "+currDate+" d="+d)
                               if(currDate!=day_off && currDate!='Friday' ){
                                   missedDays[k++]=new moment(currYear+"-"+dateMonth+"-"+currDay).format("YYYY-MM-DD");
                                    console.log("adding "+missedDays[k-1])
                                }
                               currDay++
                            }
                            currDay++
                            console.log("currDyyyyyyyyyyyyyyyyyyyyyyyyy= "+currDay)
                            ++j
                            if(j<sortedUserDays.length){
                             m= moment(sortedUserDays[j].date).format('M')
            
                    }
                    }
                if(j>0){
                var lastD= moment(sortedUserDays[j-1].date).format('D')
                var lastDName= moment(sortedUserDays[j-1].date).format('dddd')           
                var lastMonth=moment(sortedUserDays[j-1].date).format('M')
                var lastYear=moment(sortedUserDays[j-1].date).format('Y')
                console.log("ld= "+lastD+" lm= "+lastMonth+" ly= "+lastYear)
                var lastDay=parseInt(lastD)+1
                const y=moment(sortedUserDays[j-1].date).format("YYYY")
                const m=moment(sortedUserDays[j-1].date).format("MM")
                const d=moment(sortedUserDays[j-1].date).format("DD")
                 lastDName=new moment(y+"-"+m+"-"+lastDay).format('dddd')
                 console.log("lastdNAMEEEEEEEEEEEEEEE=" +lastDName)
                }
                else{
                    var lastD= new moment(dateYear+"-"+dateMonth+"-"+currDay).format('D')
                var lastDName=new moment(dateYear+"-"+dateMonth+"-"+currDay).format('dddd')          
                const lastMonth=new moment(dateYear+"-"+dateMonth+"-"+currDay).format('M')
                var lastYear=new moment(dateYear+"-"+dateMonth+"-"+currDay).format('Y')
                console.log("ld= "+lastD+" lm= "+lastMonth+" ly= "+lastYear)
                var lastDay=parseInt(lastD)
                }
                //console.log("missed till now= "+missedDays)
                //get last day present from 1st month then fill the rest according to each month's number of days
                if(dateMonth==1 ||dateMonth==3 ||dateMonth==5 ||dateMonth==7 ||dateMonth==8 ||dateMonth==10||dateMonth==12){
                    while(lastDay<32){
                        //added recently
                        var currDate=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format('dddd')
                        console.log("lastYear= "+lastYear+" dateMonth"+dateMonth)
                        console.log("here at "+lastDay+" lastDName= "+lastDName)
                        if(lastDName!='Friday' && lastDName!=day_off ){
                            
                        missedDays[k++]=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("YYYY-MM-DD");
                        console.log("added= "+missedDays[k-1])
                        }
                       lastDay++
                       lastDName=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("dddd");
                       console.log("now= "+lastDay)
                    }
                }
                if(dateMonth==4 ||dateMonth==6 ||dateMonth==9 ||dateMonth==11 ){
                    while(lastDay<31 ){
                        //added recently
                        var currDate=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format('dddd')
                        if(lastDName!='Friday' && lastDName!=day_off ){
                        missedDays[k++]=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("YYYY-MM-DD");
                        }
                        lastDay++;
                        lastDName=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("dddd");
                    }
                }
                if(dateMonth==2 ){
                   if(moment(dateYear).isLeapYear() )
                    {
                        while(lastDay<30){
                             //added recently
                        var currDate=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format('dddd')
                         if(lastDName!='Friday'&& lastDName!=day_off ){
                          missedDays[k++]=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("YYYY-MM-DD");
                        }
                        lastDay++;
                        lastDName=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("dddd");
                    }
                    }
                    else {
                        while(lastDay<29){
                             //added recently
                        var currDate=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format('dddd')
                            if(lastDName!='Friday'&& lastDName!=day_off ){
                        missedDays[k++]=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("YYYY-MM-DD");
                            }
                        lastDay++;
                        lastDName=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("dddd");
                    }
                }
                }
                //if only present in first month then fill 2nd month manually
                if( sortedUserDays.length==0||moment(sortedUserDays[sortedUserDays.length-1].date).format("M")==dateMonth ){
                    var currDay2=1
                    console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE")
                    lastDName=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format("dddd");
                    for(var g=1;g<=10;g++){
                        //added recently
                        var currDate=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format('dddd')
                        if(lastDName!='Friday'&& lastDName!=day_off ){
                        missedDays[k++]=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format("YYYY-MM-DD");
                        }
                        currDay2++
                        lastDName=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format("dddd");
                    }
                }
            
                //else will need to check and only insert absent days
                else{    
                //first fill days missed in the middle
                while(j<sortedUserDays.length && m==nextMonth){
                    var currDay2=1
                    var last2day=currDay2
                     var d2= moment(sortedUserDays[j].date).format('D')
                     var m2= moment(sortedUserDays[j].date).format('M')
                         while(d2>currDay2 ){
                           //RECENTLY
                            const currDate2=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format('dddd')
                            console.log("inside 2nd= "+currDay2+" "+currDate2)
                            //RECENTLY
                            if(currDate2!=day_off && currDate2!='Friday' ){
                                console.log("accepted 2nd= "+currDay2+" "+currDate2)
                                missedDays[k++]=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format("YYYY-MM-DD");
                            }
                            currDay2++
                            last2day=currDay2
                            console.log("currDay2== "+currDay2+" d2="+d2)
                         }
                         
                         currDay2++
                         j++
                        
                 }
                //  console.log("missed till now= "+missedDays)
                 //then start looping from last present day till the 10th of 2nd month
                //  var last2D=moment(sortedUserDays[sortedUserDays.length-1].date).format("D")
                //  var last2day=parseInt(last2D)+1
                var last2D=moment(sortedUserDays[sortedUserDays.length-1].date).format("D")
                 var last2day=parseInt(last2D)+1
                 console.log("LASTTTTTTTTTTTTTTTTTT= "+last2day)
                
                 for(last2day;last2day<=10;last2day++){
                    lastDName=new moment(nextYear+"-"+nextMonth+"-"+last2day).format("dddd");
                    //RECENTLY
                    const currDate2=new moment(nextYear+"-"+nextMonth+"-"+last2day).format('dddd')
                     if(lastDName!='Friday' && lastDName!=day_off ){
                         console.log("ADDDDDDDDDDDDDDDING= "+last2day)
                    missedDays[k++]=new moment(nextYear+"-"+nextMonth+"-"+last2day).format("YYYY-MM-DD");
                     }
                    
                 }
                }
                var returnArr=new Array()
                var s=0
                for(var d=0;d<missedDays.length;d++){
                    if(moment(missedDays[d]).format("YYYY-MM-DD")< new moment().format("YYYY-MM-DD"))
                    returnArr[s++]=missedDays[d]
                }
                    if(returnArr.length>0)  members.push({"name":user.name,"id":user.id,"email":user.email,"missing days":returnArr.length});
         }
            
            return res.json(members);  
        }
    }catch(err){
        res.status(500).json({error:err.message});
    }














    
})

function compare( a, b ) {
   
    // if (parseInt( a.date) < parseInt(b.date) ){
    //     console.log("inside compare")
    //   return -1;
    // }
    // if ( parseInt(a.date )>parseInt( b.date) ){
    //   return 1;
    // }
    // return 0;
    // if(moment(a.date).isBefore(moment(b.date)))
    // return -1;
    // if(moment(b.date).isBefore(moment(a.date)))
    // return 1;
    // return 0;

    if((moment(a.date).format("YYYY-MM-DD"))<((moment(b.date).format("YYYY-MM-DD")))){
        
    return 1;

    }
}



router.put('/addrecord',authenticateToken,async(req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"id":req.user.id});
        if(st.staff_type=="HR")
    res.status(401).send('Access Denied');
    else{
       const{userid,thedate,signintime,signouttime}=req.body;
       if(!userid || !thedate) res.status(400).json({msg:"please fill the required fields"});
       else{
           if(userid==req.user.id)
              res.status(400).json({msg:"Cannot add record to this user"});
           else{
               var index=0;
               const person=await StaffMember.findOne({"id":userid});
               if(signintime){
                   if(signintime>="07:00") {
                   for(var i=0;i<person.attendance.length;i++){
                        //to add sorted   
                        if(moment(person.attendance[i].date).format("YYYY-MM-DD")==thedate){
                            index=i;
                            if(person.attendance[i].signins.length==0)signins.push(signintime);
                           for(var j=0;j<person.attendance[i].signins.length;j++){
                               if(person.attendance[i].signins[j]>signintime){ 
                                var temp2=signintime;
                                for(var k=j;k<person.attendance[i].signins.length;k++){
                                    var temp=person.attendance[i].signins[k];
                                    person.attendance[i].signins[k]=temp2;
                                    temp2=temp;
                                 }
                                break;
                               }
                               else{
                                   if(j==person.attendance[i].signins.length-1){person.attendance[i].signins.push(signintime);break;}
                               }
                           }
                            break;
                        }
                   }
               }}

               if(signouttime){
                   if(signouttime<="19:00"){
                var index=0;
                for(var i=0;i<person.attendance.length;i++){
                     //to add sorted   
                     if(person.attendance[i].date==thedate){
                        if(person.attendance[i].signouts.length==0)signouts.push(signouttime);
                        for(var j=0;j<person.attendance[i].signouts.length;j++){
                            if(person.attendance[i].signouts[j]>signouttime){ 
                             var temp2=signouttime;
                             for(var k=j;k<person.attendance[i].signouts.length;k++){
                                 var temp=person.attendance[i].signouts[k];
                                 person.attendance[i].signouts[k]=temp2;
                                 temp2=temp;
                              }
                             break;
                            }
                            else{
                                if(j==person.attendance[i].signouts.length-1){person.attendance[i].signouts.push(signouttime);break;}
                            }
                        }
                         break;
                     }
                }
            }
        }

            //hours should be calculated again here
            var min=0;
            if(person.attendance[index].signins.length<person.attendance[index].signouts.length) min=person.attendance[index].signins.length;
            else min=person.attendance[index].signouts.length;
            var hours=0;
            var j=0;
            for(var i=0;i<min;i++){
                if(person.attendance[index].signouts[i]>person.attendance[index].signins[j]){
                     hours+=(Number.parseInt(person.attendance[index].signouts[i].substring(0,2))-Number.parseInt(person.attendance[index].signins[j].substring(2)))+((Number.parseInt(person.attendance[index].signouts[i].substring(3,5))-Number.parseInt(person.attendance[index].signins[j].substring(3,5)))/60);
                     j++;
                } 
            }
             person.attendance[i].hours=hours;
             
            await person.save();
            if(!signintime&& !signouttime) res.status(400).json({msg:"please insert the record to add"});
            else res.send("done");







               
           
           }   
       }}
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
module.exports=router;