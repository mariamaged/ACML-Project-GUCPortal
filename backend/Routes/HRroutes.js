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
const Attendance=require('../Models/AttendanceSchema');


async function authenticateToken(req, res, next) {
    const token = req.header("auth-token");
    if (!token) {
      res.status(401).send({ msg: "Access deined please log in first." });
      return;
    }
    // const verified= jwt.verify(token, process.env.TOKEN_SECRET)
    // if(!verified){
    //     return res.json("Token is unauthorized.")
    // }
    // req.user=verified
    // console.log("in auth "+req.user)
    // next();
    try {
      const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).send({ msg: "Invalid Request." });
      return;
    }
  }













//Locations Adding,deleting, and updating
//fadel autherization
//adding
router.route('/Location').post(authenticateToken,async(req,res)=>{
    //to authorize
     const st=await StaffMember.findOne({"_id":req.user.id});
     if(st==null||st.staff_type!="HR")
      res.status(401).send({msg:'Access Denied'});
    else{  
    try{
        //yedakhaly max_capacity wla ahotaha ana based 3la el type?
        const{id,type,maximum_capacity}=req.body;
        if(!id || !type || !maximum_capacity)
           return res.status(401).send({msg:"Please enter a correct location"});
        else{
            const loc=await location.findOne({"id":id});
            if(loc!=null) res.status(401).send({msg:"a location with this id already exists"});
            else{
              toAdd= new location({id,type,maximum_capacity,current_capacity:0});
              await toAdd.save();
              res.send({msg:"Done"});
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
// authenticateToken,
.delete(authenticateToken,async (req,res)=>{
    try{
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
      res.status(401).send('Access Denied');
    else{ 
     const{id}=req.body;
    if(!id) res.status(400).send({msg:"please enter the id of the location to be deleted"});
    else{ 
     const loc=await location.findOne({"id":id});
     if(loc== null) res.send({msg:"this location does not exist"});
     else{
     if(loc.type=="Office" && loc.current_capacity>0){       
         const staff=await StaffMember.find({"office":loc._id})
        //  for(var i=0;i<staff.length;i++){
        //      staff[i].office=null;
        //      await staff[i].save();
        //  }
        res.status(400).json({msg:"Cannot delete an office with current capacity greater than 0"});
        return;
     }
     else {
        const staff= await AcademicStaff.find();
        for(var i=0;i<staff.length;i++){
            for(var j=0;j<staff[i].schedule.length;j++){
                if(staff[i].schedule[j].location==loc._id){
                    res.status(400).json({msg:"There are already slots in this location"});
                    return;
                    //staff[i].schedule[j].location=null;
                   // j--;
                }
               
            }
            //await staff[i].save();
        }
     }
        await location.deleteOne({"id":id});
        res.status(200).send({msg:"done"});
         
     }
     }}
 }catch(err){
     res.status(500).send({error:err.message});
 }
 })

//updating 
// authenticateToken,
.put( authenticateToken,async(req,res)=>{
    try{
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
        res.status(401).send({msg:'Access Denied'});
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
               if(Obid.type=="Office" && Obid.current_capacity>0){
                // const staff=await StaffMember.find({"office":Obid._id});
                // for(var i=0;i< staff.length;i++){
                //     staff[i].office=null;
                //    await staff[i].save();
                // }
                   res.status(400).json({msg:"Cannot change the type of an office with current capacity greater than 0"});
                   return;
               }
               else{
                   const staff=await AcademicStaff.find();
                   for(var i=0;i<staff.length;i++){
                       for(var j=0;j<staff[i].schedule.length;j++){
                           if(staff[i].schedule[j].location==Obid._id)
                           res.status(400).json({msg:"There are already slots in this location."});
                           return;
                       }
                      
                   }
               }
                Obid.type=type;
                Obid.current_capacity=0;
             }
             const newob=await location.findOne({"id":id});
             if(newob==null|| id==oldid){
             Obid.id=id;
             Obid.maximum_capacity=maximum_capacity;
             await Obid.save();
             res.send({msg:"done"});  }
             else res.status(400).json({msg:"the new id already exists"})
             
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
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
    res.status(401).send({msg:'Access Denied'});
    else{
    const{name}=req.body;
    if(!name) res.status(400).json({msg:"please enter the faculty name"});
    else{
    const f=await faculty.findOne({"name":name});
    if(f!=null) res.status(400).json({msg:"a faculty with this name already exists"});
    else{   
    toAdd=new faculty({name});
    await toAdd.save();
    res.json(toAdd);
    console.log(toAdd);}}}}
    catch(err){
        res.status(500).json({msg:{error:err.message}});
    }
})

//deleting
.delete(authenticateToken,async (req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
        res.status(401).send({msg:'Access Denied'});
        else{
        const{name}=req.body;
        if(!name) res.status(400).json({msg:"Please insert the name of the faculty you want to delete."});
        else{
            const fac=await faculty.findOne({"name":name});
            if(fac==null) res.send({msg:"this faculty does not exist"});
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
            res.send({msg:"Done"});
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
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
    res.status(401).send({msg:'Access Denied'});
    else{
        const{oldname,name}=req.body;
        if(!name||!oldname) res.status(400).json({msg:"Please insert the old and new name of the faculty you want to update."});
        else{
            const ob= await faculty.findOne({"name":oldname});
            const obnew=await faculty.findOne({"name":name});
            if( (obnew==null || name==oldname)&& ob!=null ) {ob.name=name; await ob.save();res.send({msg:"done"});}
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
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
          res.status(401).send({msg:'Access Denied'});
        else{
          const{name,facultyname,hod}=req.body;
          //HOD could be null as in not yet assigned
          if(!name || !facultyname) res.status(401).send({msg:"Please fill the required fields"});
          else{
              const dep=await department.findOne({"name":name});
            if(dep!=null) res.status(401).send({msg:"A department with this name already exists."});
            else{
            var toAdd=null;
            const fid=await faculty.findOne({"name":facultyname});
            if(fid==null) res.status(401).send({msg:"The faculty name you entered is incorrect"});
            else{
            if(!hod) toAdd=new department({"name":name,"faculty":fid._id,"HOD":null});
            else{ 
                const head= await StaffMember.findOne({"id":hod});
                if(head==null) res.status(401).send({msg:"there is no Academic member with that id"});
                else{
                    const headac= await AcademicStaff.findOne({"member":head._id});
                    if(headac==null) res.status(401).send({msg:"there is no Academic member with that id"});
                    else if(headac.isHOD) res.status(401).send({msg:"this academic Member is already head of another department"});
                         else if(headac.type!="Course Instructor") res.status(401).send({msg:"this academic Member is not an Instructor"});
                              else{ toAdd=new department({"name":name,"faculty":fid._id,"HOD":headac._id});
                              headac.department=toAdd._id;
                              headac.isHOD=true;
                              await headac.save();
                } 
                }
            }
            await toAdd.save();
            res.status(200).send({msg:"done"});
            console.log(toAdd);}
            }
    }}
    }catch(err){
        res.status(500).send({error:err.message});
    }
})
//deleting
.delete(authenticateToken,async(req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
          res.status(401).send({msg:'Access Denied'});
        else{
        const{name}=req.body;
        if(!name) res.status(400).json({msg:"Please insert the name of the department you want to delete."});
        else{
            const dep= await department.findOne({"name":name});
            if(dep==null) res.status(401).send({msg:"this department already does not exist"});
            else{
            await course.deleteMany({"department":dep._id});
            const s=await AcademicStaff.find({"department":dep._id});
            for(var i=0;i<s.length;i++){
                await StaffMember.deleteOne({"_id":s[i].member});
            }
            await AcademicStaff.deleteMany({"department":dep._id});
            await department.deleteOne({"name":name});
            res.send({msg:"done"});
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
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
    res.status(401).send('Access Denied');
    else{
       const{oldname,name,facultyname,hodid}=req.body;
       if(!oldname||!name||!facultyname) res.status(401).json({msg:"Please fill all the fields."});
       else{
           const ob= await department.findOne({"name":oldname});
           if(ob==null) res.status(401).json({msg:"there is no department with that name."});
           else{
               var hac=null;
               var hod1=ob.hod;
               var messge="done";
             if(hodid) {
                const h= await StaffMember.findOne({"id":hodid});
                if(h==null)  messge="there is no Academic member with the id you entered.";
                else{
                    hac= await AcademicStaff.findOne({"member":h._id});    
                if(hac==null) messge="there is no Academic member with the id you entered.";
                else if(hac.type!="Course Instructor") messge="there is no Course instruvtor with this id.";
                     else if(hac.isHOD) messge="this Instructor is already head of another department.";
                          else if(hac.department==ob._id){
                               hod1=hac._id;
                               }
                               else messge="This instructor does not belong to this department.";}
             }
             const obnew=await department.findOne({"name":name});
             if( obnew==null || name==oldname){
                const fid=await faculty.findOne({"name":facultyname});
                if(fid==null) res.status(401).send({msg:(messge+"No faculty with that name exists.")})
                else{
                ob.name=name;
                ob.faculty=fid._id;
                ob.HOD=hod1;
                if(hac!=null){ hac.isHOD=true; await hac.save();}
                await ob.save();
                res.status(200).json({msg:messge});
                }
            }
             else res.status(401).send({msg:"A department with that new name already exists"});
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
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
    res.status(401).send('Access Denied');
    else{
        const{id,name,departmentname}=req.body;
        if(!id||!name||!departmentname) res.status(401).json({msg:"please fill all the fields"});
        else{
            const dep= await department.findOne({"name":departmentname});
            if(dep==null) res.status(401).json({msg:"there is no department with that name"});
            else{
                const ob=await course.findOne({"id":id});
                if(ob==null){  
                const toAdd=new course({"id":id,"name":name,"department":dep._id}); 
                await toAdd.save();
                res.json({msg:"done"});
                console.log(toAdd);
                }
                else{
                    res.status(401).json({msg:"a course with this id already exists"});
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
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
    res.status(401).send({msg:'Access Denied'});
    else{
       const{id}=req.body;
       if(!id)res.status(400).json({msg:"please enter the id of the course you want to delete"});
       else{
           //assuming academic members only teach courses in their department
           const c=await course.findOne({"id":id});
           if(c==null) res.send({msg:"a course with this id already does not exist"});
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
           res.send({msg:"done"});
           }
       }}
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//updating
// authenticateToken,
.put(authenticateToken,async (req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
    res.status(401).send({msg:'Access Denied'});
    else{
        //academic staff is a list of staff members ids
       const{oldid,id,name,departmentname,slotsneeded,slotscovered,schedule}=req.body;
       if(!oldid||!id||!name||!departmentname) res.status(401).json({msg:"please fill all the fields"});
       else{
           const ob=await course.findOne({"id":oldid});
           if(ob==null) res.status(401).json({msg:"there is no course with that id"});
           else{
               const obnew= await course.findOne({"id":id});
               const dep=await department.findOne({"name":departmentname});
               if(dep==null) res.status(401).json({msg:"there is no department with the given name"});
               else{
                   if(obnew==null||id==oldid){
                      if(slotsneeded) ob.slots_needed=slotsneeded;
                      if(slotscovered) ob.slots_covered=slotscovered;
                      //to test w check the logic
                      if(schedule) ob.schedule=schedule;
                        ob.id=id;
                        ob.name=name;
                        ob.department= dep._id
                        await ob.save();
                        res.send({msg:"done"});
                   }
                   else
                   res.status(401).json({msg:"a course with this new id already exists"});
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
// authenticateToken,
router.route('/staffmember').post(authenticateToken,async(req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
    res.status(401).send('Access Denied');
    else{
       const{name,email,salary,officelocation,type,dayoff,gender,actype,departmentname,facultyname}=req.body;
       if(!email||!salary||!officelocation|| !gender||!type||!name) res.status(400).json({msg:"please fill all the fields"});
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
                         if(!actype||!departmentname||!facultyname)message="please fill all the academic staff data fields";
                         else{
                          for(var i=num;i>=0;i--){
                             if(i==0){
                                sid="ac-1";
                                break;
                            }
                            var tuple=await StaffMember.findOne({"id":"ac-"+i});
                            if(tuple!=null) {sid="ac-"+(i+1); break;} 
                            }
                            
                             dep=await department.findOne({"name":departmentname});
                             fac=await faculty.findOne({"name":facultyname});
                            if(dep==null||fac==null||dep.faculty!=fac._id) message="the data you entered is incorrect";
                            else flag=true;
                     }}
                     console.log("ablo aho");
                     if(type=="HR"|| flag){
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
                    else if(type=="HR"){const hr=new HR({"member":toAdd._id,"day_off":"Saturday"}); 
                     await hr.save();
                    } 
                    
                    
                 }}
             }
             res.send({msg:message});
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
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
          res.status(401).send({msg:'Access Denied'});
        else{
        //ydeeny email wla id?
        const{email}=req.body;
        if(!email) res.status(401).json({msg:"please insert the email of the staff member you want to delete"});
        else{
          const person= await StaffMember.findOne({"email":email});
          if(person==null) res.status(401).send({msg:"a person with this email already does not exist"});
          else{
           const office=await location.findOne({"_id":person.office});
           if(office!=null){
           office.current_capacity-=1;
           await office.save();}
           if(person.staff_type=="Academic Member"){
            const ac=await AcademicStaff.findOne({"member":person._id});   
            const courses=ac.courses;
            const schedule=ac.schedule;
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
           res.status(200).send({msg:"done"});
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
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
    res.status(401).send('Access Denied');
    else{
       const{id,email,password,office,newStaffMember,annualdays,lastupdatedannual,accidentaldaysleft,attendcompensationday}=req.body;
       if(!id) res.status(400).json({msg:"please insert the id of the staff member you want to update"});
       else{
           const ob=await StaffMember.findOne({"id":id});
           if(ob==null) res.status(401).json({msg:"there is no staff member with that id"});
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
                    if(newob==null || email==ob.email){
                       (await ob).email=email;}
                    else message="A user with this email already exists";
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
                res.status(200).send({msg:message});
           }
       }}
    }catch(err){
        res.status(500).json({error:err.message});
    }
    })

router.route('/updatesalary').put(authenticateToken,async(req,res)=>{
    try{
        //to authorize
        const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
    res.status(401).send({msg:'Access Denied'});
    else{
       const{id,salary}=req.body;
       if(!id||!salary) res.status(401).json({msg:"please fill all the fields"});
       else{
           const ob=await StaffMember.findOne({"id":id});
           if(ob==null) res.status(400).json({msg:"a staff member with this id is not found"});
           else{ (await ob).salary=salary;
           await ob.save();
           res.send({msg:"done"});
       }}}
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
// authenticateToken,
router.route('/attendance/:id').get(async(req,res)=>{
    try{
    //to authorize
    //  const st=await StaffMember.findOne({"_id":req.user.id});
    //  if(st.staff_type!="HR")
    //   res.status(401).send({msg:'Access Denied'});
    //   else{
     const id=req.params.id;
    if(!id) res.status(401).json({msg:"please insert the id of the member you need the attendance records of"});
    else{
        const mem= await StaffMember.findOne({"id":id});
        if(mem==null){ res.status(401).json({msg:"there is no user with this id"}); console.log(id);}
        else
            res.send(mem.attendance);
    }}//}
    catch(err){res.status(500).json({error:err.message});}
})


router.get('/viewMissinghours',authenticateToken,async(req,res)=>{
   try{
   //to authorize
   const st=await StaffMember.findOne({"_id":req.user.id});
   if(st.staff_type!="HR")
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
                if(monthly[i].missingHours>0||monthly[i].missingMinutes>0) members.push({name:user.name,id:user.id,email:user.email,missing_hours:monthly[i].missingHours,missing_minutes:monthly[i].missingMinutes});
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























function compareAsc( a, b ) {
   

    if((moment(a.date).format("YYYY-MM-DD"))<((moment(b.date).format("YYYY-MM-DD")))){
        
    return -1;

    }
    if((moment(b.date).format("YYYY-MM-DD"))<((moment(a.date).format("YYYY-MM-DD")))){
        // console.log("b= "+(moment(b.date).format("YYYY-MM-DD")))
        // console.log("a= "+(moment(a.date).format("YYYY-MM-DD")))
        return 1;
    }
    return 0;
  }





const moment=require('moment');
const e = require('express');
// ,authenticateToken
router.get('/viewMissingdays',async(req,res)=>{
    try{
        //to authorize
    //     const st=await StaffMember.findOne({"_id":req.user.id});
    //     if(st.staff_type!="HR")
    // res.status(401).send('Access Denied');
    // else{
        var dateMonth=moment().format("M")
        const dateYear=moment().format("Y")
      const dateDay=moment().format("D")
     // const dateDay=2
         const staff=await StaffMember.find();
         var members=[];
         for(var a=0;a<staff.length;a++){
            const user=staff[a];
                    var day=""
                    if(user.staff_type=="HR"){
                     day=(await HR.findOne({"member":user._id})).day_off}
                    else
                   day=(await AcademicStaff.findOne({"member":user._id})).day_off
            
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
                //shofeha sah wla laa ana msh 3arfa
                    if(returnArr.length>0)  members.push({name:user.name,id:user.id,email:user.email,missing_days:returnArr.length});
         }
            
            return res.json(members);  
       // }
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

// ,authenticateToken
router.put('/addrecord',authenticateToken,async(req,res)=>{
    try{
        //to authorize
       const st=await StaffMember.findOne({"_id":req.user.id});
        if(st.staff_type!="HR")
    res.status(401).send({msg:'Access Denied'});
    else{
       var{userid,thedate,day,signintime,signouttime}=req.body;
       if(!userid || !thedate || !day) res.status(401).json({msg:"please fill the required fields"});
       else{
           if(userid==st.id)
              res.status(401).json({msg:"Sorry, Cannot add record to yourself"});
           else{
            if(!signintime && !signouttime) res.status(401).json({msg:"please insert the record to add"});
            else{
                if(signintime>=signouttime) res.status(401).json({msg:"Your data is incorrect"});
                else{
               var index=0;
               const person=await StaffMember.findOne({"id":userid});
               if(person==null) res.status(401).json({msg:"The user id you entered is incorrect"});
               else{
                   if(person.staff_type=='HR') var h= await HR.findOne({"member":person._id});
                   else var h=await AcademicStaff.findOne({"member":person._id});
                    if(h==null) res.status(400).json({msg:"Something went wrong"});
                    else{
                        if(h.day_off==day) res.status(400).json({msg:"Cannot add a record on the member's day off"});
                        else{
                            if(signintime.length==4) signintime='0'+signintime;
                            if(signouttime.length==4) signouttime='0'+signouttime;
                            // thedate.substring(6,10)+"-0"+thedate.charAt(3)+"-"+thedate.substring(0,2);
                            console.log(thedate);                            
                            // if(thedate.charAt(4)=='/') thedate=thedate.substring(6,10)+"-"+thedate.substring(3,5)+"-"+thedate.substring(0,2);
                            // else thedate= thedate.substring(6,10)+"-"+thedate.substring(3,5)+"-"+thedate.substring(0,2);
                            // thedate.substring(6)+"-"+thedate.substring(3,5)+"-"+thedate.substring(0,2);
                            //no attendance record
                            if(person.attendance.length==0){
                                if(signintime && signouttime){
                                    var flag=true;
                                    var hours=0;
                                    var minutes=0;
                                   if(signintime>="07:00"){
                                       if(signouttime<="19:00"){
                                           hours=Number.parseInt(signouttime.substring(0,2))-Number.parseInt(signintime.substring(0,2));
                                           minutes= Number.parseInt(signouttime.substring(3,5))-Number.parseInt(signintime.substring(3,5));
                                           if(minutes<0){
                                               if(hours>0){
                                                  hours-=1;
                                                  minutes=(60+minutes);
                                               }else flag=false; 
                                           }
                                   if(flag){   
                                       //console.log(thedate);
                                   var newattendance= {date:thedate,day:day,dayOffBool:false,attended:true,signedIn:true,signedOut:true,signins:[signintime],signouts:[signouttime],hours:hours,minutes:minutes};}
                                else {res.status(400).json({msg:"Cannot add a record in which the signin time is after the signout time"}); return;}}
                                else var newattendance= {date:thedate,day:day,dayOffBool:false,attended:true,signedIn:true,signins:[signintime]};}
                                else if(signouttime<="19:00")
                                        var newattendance= {date:thedate,day:day,dayOffBool:false,attended:true,signedIn:true,signedOut:true,signouts:[signouttime]};
                                }else if(signintime){
                                    if(signintime>="07:00")
                                    var newattendance= {date:thedate,day:day,dayOffBool:false,attended:true,signedIn:true,signedOut:true,signins:[signintime]};
                                }else{
                                    if(signouttime<="19:00")
                                    var newattendance= {date:thedate,day:day,dayOffBool:false,attended:true,signedIn:true,signedOut:true,signouts:[signouttime]};
                                }
                                console.log("haypush bayen");
                                person.attendance.push(newattendance);
                                await person.save();
                                res.send({msg:"done"});
                            }
                        else{
                            var datefound=false;
                            if(signintime){
                                if(signintime>="07:00") {
                                    for(var i=0;i<person.attendance.length;i++){
                                       //to add sorted   
                                       if(moment(person.attendance[i].date).format("YYYY-MM-DD")==thedate){
                                        datefound=true;
                                        index=i;
                                       if(person.attendance[i].signins.length==0) person.attendance[i].signins.push(signintime);
                                       else{
                                        for(var j=0;j<person.attendance[i].signins.length;j++){
                                            if(person.attendance[i].signins[j]>signintime){
                                                //var temp2=signintime;
                                                // for(var k=j;k<person.attendance[i].signins.length;k++){
                                                //     var temp=person.attendance[i].signins[k];
                                                //     person.attendance[i].signins[k]=temp2;
                                                //     console.log(person.attendance[i].signins[k]+" and k:" +k);
                                                //     temp2=temp;
                                                    //await person.save();
                                                    var newsignins=[];
                                                    var f=true;
                                                    for(var k=0;k<person.attendance[i].signins.length;k++){
                                                        if(k==j && f) {newsignins.push(signintime); k--; f=false;}
                                                        else newsignins.push(person.attendance[i].signins[k]);
                                                    }
                                                    person.attendance[i].signins=newsignins;
                                                    await person.save();
                                                    break;
                                                }
                                                // await person.save();
                                                // person.attendance[i].signins.push(temp2);
                                                // await person.save();
                                                 
                                            else{
                                                if(j==person.attendance[i].signins.length-1 &&  person.attendance[i].signins[j]!=signintime){person.attendance[i].signins.push(signintime);break;}
                                            }
                                        }
                                        await person.save();
                                        break;
                                       }
                                    }
                                    }
                                }
                                else {res.status(401).json({msg:"No sign in records are counted before 7 am"}); return;}
                            }
                                 
                        
               if(signouttime){
                   if(signouttime<="19:00"){
                var index=0;
                for(var i=0;i<person.attendance.length;i++){
                     //to add sorted   
                     console.log(signouttime);
                     if(moment(person.attendance[i].date).format("YYYY-MM-DD")==thedate){
                         datefound=true;
                         index=i;
                        if(person.attendance[i].signouts.length==0)person.attendance[i].signouts.push(signouttime);
                        for(var j=0;j<person.attendance[i].signouts.length;j++){
                            if(person.attendance[i].signouts[j]>signouttime){ 
                                var newsignouts=[];
                                var f=true;
                                for(var k=0;k<person.attendance[i].signouts.length;k++){
                                    if(k==j && f) {newsignouts.push(signouttime); k--; f=false;}
                                    else newsignouts.push(person.attendance[i].signouts[k]);
                                }
                                console.log("bala2eeh 3ady");
                                person.attendance[i].signouts=newsignouts;
                                await person.save();
                                break;
                             //var temp2=signouttime;
                            //  for(var k=j;k<person.attendance[i].signouts.length;k++){
                            //      var temp=person.attendance[i].signouts[k];
                            //      person.attendance[i].signouts[k]=temp2;
                            //      temp2=temp;
                            //      await person.save();
                            //   }
                            //   person.attendance[i].signouts.push(temp2);
                            //   await person.save();
                            //  break;
                            }
                            else{
                                if(j==person.attendance[i].signouts.length-1 && person.attendance[i].signouts[j]!=signouttime){person.attendance[i].signouts.push(signouttime); await person.save();break;}
    
                            }
                        }
                        await person.save();
                         break;
                     }
                }
            }else {res.status(401).json({msg:"No sign in records are counted before 7 am"}); return;}
        }

        if(!datefound){
            index=person.attendance.length;
            if(signintime && signouttime){
                if(signintime>="07:00"){
                    if(signouttime<="19:00"){
                       person.attendance.push({date:thedate,day:day, dayOffBool:false,attended:true,signedIn:true,signedOut:true,signins:[signintime],signouts:[signouttime]});
                    }else{
                        person.attendance.push({date:thedate,day:day, dayOffBool:false,signedIn:true,signins:[signintime]});
                    }
                }else{
                    if(signouttime<="19:00"){
                        person.attendance.push({date:thedate,day:day, dayOffBool:false,signedOut:true,signouts:[signouttime]});
                     }else{ res.status(400).json({msg:"Both records are incorrect"}); return;}
                }
            }else if(signintime){
                    if(signintime>="07:00"){
                        person.attendance.push({date:thedate,day:day, dayOffBool:false,signedIn:true,signins:[signintime]});
                    }else{ res.status(400).json({msg:"Cannot insert a sign in record before 7:00 am"}); return;}
            }else{
                if(signouttime<="19:00"){
                    person.attendance.push({date:thedate,day:day, dayOffBool:false,signedOut:true,signouts:[signouttime]});
                 }else{ res.status(400).json({msg:"Cannot insert a sign out record after 7:00 pm"}); return;} 
            }
        }

            //hours should be calculated again here
            var min=0;
            if(person.attendance[index].signins.length<person.attendance[index].signouts.length) min=person.attendance[index].signins.length;
            else min=person.attendance[index].signouts.length;
            var hours=0;
            var minutes=0;
            var j=0;
            for(var i=0;i<min;i++){
                if(person.attendance[index].signouts[i]>person.attendance[index].signins[j]){
                    if(j>0 && i>0 && person.attendance[index].signins[j]<person.attendance[index].signouts[i-1]){i--; j++;}
                    else{
                     var hour= Number.parseInt(person.attendance[index].signouts[i].substring(0,2))-Number.parseInt(person.attendance[index].signins[j].substring(0,2));
                     var minute=Number.parseInt(person.attendance[index].signouts[i].substring(3,5))-Number.parseInt(person.attendance[index].signins[j].substring(3,5));
                     if(minute<0){
                         hours--;
                         minutes=60+minutes;
                     }
                     hours+=hour;
                     minutes+=minute;
                     if(minutes>=60){
                        hours+=Math.floor(minutes/60);
                        minutes=minutes%60;
                     }
                     j++;
                     console.log(hours);
                     console.log(minutes);
                } }
            }
             person.attendance[index].hours=hours;
             person.attendance[index].minutes=minutes;
            await person.save(); 
            res.send({msg:"done"});
        }
        }
    }


     
        }

        }
           }   
       }}}
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
module.exports=router;