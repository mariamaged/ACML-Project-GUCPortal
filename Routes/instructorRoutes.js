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
const SlotSchema = require('../Models/SlotSchema.js');

//course coverage
//cannot test because of the login problem
router.get('/coursecoverage',async (req,res)=>{
    try{
       //specific courses wla kolo??????????????????????!!!!!!!!!!!!!!!!!!!!!
       //assuming kolo


    //    if(req.user.role=="Course Instructor"){
    //       const inst=await AcademicStaff.findOne({"_id":req.user.id});
    //      if(inst==null) res.status(400).json({msg:"Something went wrong"});
    //      else{
        //for testing
        const inst=AcademicStaff.findOne({"id":req.body.id});
        //shely el fo2 da
            const courses=inst.courses;
            var coverage= [courses.length];
            for(var i=0;i<courses.length;i++){
               var c=await course.findOne({"_id":courses[i]}); 
               coverage[i]=c.slots_covered/c.slots_needed;
            }
            res.send(coverage);
        //  }
      // }else res.status(400).json({msg:"Access denied"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
})

//slots assignment
router.get('/slotsAssignment',async (req,res)=>{
    try{
       if(req.user.role=="Course Instructor"){
        const inst=await AcademicStaff.findOne({"_id":req.user.id});
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
       }
       else res.status(400).json({msg:"Access denied"});
    }catch(err){ 
        res.status(500).json({error:err.message});}
})


//staff per department
router.get('/staffperdepartment',async (req,res)=>{
    try{
        if(req.user.role=="Course Instructor"){
         const inst=await AcademicStaff.findOne({"_id":req.user.id});
         if(inst==null) res.status(400).json({msg:"Something went wrong"});
         else{
            //for testing only
            // const departmentname=req.body.departmentname;
            // if(!departmentname) res.status(400).json({msg:"please enter the department name"});
            //   const dep= await department.findOne({"name":departmentname});
            const departmentid=inst.department;
            const dep= await department.findOne({"_id":departmentid});
            if(dep==null) res.status(400).json({msg:"the department name you entered is incorrect"});
            else{ 
               const staff= await AcademicStaff.find({"department":dep._id});
               //try to filter their info
               res.send(staff);
            }
        }
         }
        else res.status(400).json({msg:"Access denied"});
     }catch(err){ 
         res.status(500).json({error:err.message});}
})

//staffpercourse
//they have to enter a course,no?
router.get('/staffpercourse',async(req,res)=>{
    try{
        if(req.user.role=="Course Instructor"){
         const inst=await AcademicStaff.findOne({"_id":req.user.id});
         if(inst==null) res.status(400).json({msg:"Something went wrong"});
         else{
             const courseid=req.body.Scourse;
             if(!courseid){
                const courses=inst.courses;
                const staff= [courses.length];
                for(var i=0;i<courses.length;i++){
                    var c=await course.findOne({"_id":courses[i]});
                    var staffmembers=[c.academic_staff.length];
                    for(var j=0;j<c.academic_staff.length;j++){
                       var staffmem=await AcademicStaff.findOne({"_id":c.academic_staff[j]});
                       staffmembers[j]={"name":staffmem.name,"id":staffmem.id,"email":staffmem.email,"office":staffmem.office}; 
                    }
                    staff[i]={"course name":c.name,"course id":c.id,"staff members":staffmembers};
                }
                res.send(staff);
             }
             else{
                 const thecourse=await course.findOne({"id":courseid});
                 if(thecourse==null) res.status(400).json({msg:"the course id you entered is incorrect"});
                 else{   
                  var assigned=false;
                  for(var i=0;i<courses.length;i++){
                    if(courses[i]==(await thecourse)._id){assigned=true; break;}
                  }
                  if(assigned){
                    var staffmembers= [thecourse.academic_staff.length];
                    for(var j=0;j<thecourse.academic_staff.length;j++){
                        var staffmem=await AcademicStaff.findOne({"_id":thecourse.academic_staff[j]});
                        staffmembers[j]={"name":staffmem.name,"id":staffmem.id,"email":staffmem.email,"office":staffmem.office}; 
                     }
                     res.send(staffmembers);
                  }
                  else res.status(400).json({msg:"you are not assigned to this course"});
                 }  
             }      
        }
         }
        else res.status(400).json({msg:"Access denied"});
     }catch(err){ 
         res.status(500).json({error:err.message});}
})

//assigntounassignedSlot
router.route('Assignment').put(async(req,res)=>{
   try{
    if(req.user.role=="Course Instructor"){
        const inst=await AcademicStaff.findOne({"_id":req.user.id});
        if(inst==null) res.status(400).json({msg:"Something went wrong"});
        else{
         const{courseid,day,number,slocation,memid}=req.body;
         if(!courseid||!day||!number||!slocation||!memid) res.status(400).json({msg:"please fill all the required fields"});
         else{
             var assigned=false;
             const thecourse=await course.findOne({"id":courseid});
             if(thecourse==null) res.status(400).json({msg:"this course id does not exist"});
             else{
             for(var i=0;i<inst.courses.length;i++){
                 if(inst.courses[i]==thecourse._id){assigned=true; break;}
             }
             if(!assigned) res.status(400).json({msg:"you are not assigned to this course"});
             else{
                const mem=await AcademicStaff.findOne({"id":memid});
                if(mem==null) res.status(400).json({msg:"the Academic member with the id you entered does not exist"});
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
                    mem.schedule.push({"day":day,"number":number,"location":slocation,"academic_member_id":mem._id,"course":thecourse._id});
        
                  for(var i=0;i<thecourse.schedule.length;i++){
                    if(thecourse.schedule[i].day==day && thecourse.schedule[i].number==number && thecourse.schedule[i].location==slocation){
                        if(thecourse.schedule[i].academic_member_id==null) thecourse.schedule[i].academic_member_id=mem._id;
                        else res.status(400).json({msg:"the slot is already assigned"});
                        break;
                     }
                    }
                    duplicate=false;
                  for(var i=0;i<thecourse.academic_staff.length;i++){
                    if(thecourse.academic_staff[i]==mem._id){duplicate=true; break;}
                   }
                  if(!duplicate) thecourse.academic_staff.push(mem._id);
                  res.send("done");  
                    }
                       else res.status(400).json({msg:"the member you want to assign this slot to is already busy at this time."});
                   
                 }
             }

      }
    }
}
}
   }catch(err){
         res.status(500).json({error:err.message});
   }
})



//assign course coordinator
router.put(async (req,res)=>{
    try{
        if(req.user.role=="Course Instructor"){
            const inst=await AcademicStaff.findOne({"_id":req.user.id});
            if(inst==null) res.status(400).json({msg:"Something went wrong"});
            else{
                const{courseid,coordinatorid}=req.body;
                if(!courseid||!coordinatorid) res.status(400).json({msg:"please fill all the fields"});
                else{
                   const thecourse=await course.findOne({"id":courseid});
                   if(thecourse==null) res.status(400).json({msg:"the course id you entered is incorrect"})
                   else{
                       const thecoordinator= await AcademicStaff.findOne({"id":coordinatorid});
                       if(thecoordinator==null || thecoordinator.type!='Teaching Assistant') res.status(400).json({msg:"the coordinator id you entered is incorrect"});
                       else{
                           //make sure it's his/her course
                           var assigned=false;
                           const courses= await inst.courses;
                           for(var i=0;i<courses.length;i++){
                               if(thecourse._id==courses[i]){assigned=true; break;}
                           }
                           if(assigned){
                               //make sure the coordinater is a teaching assistant of this course
                               var coassigned=false;
                               const cocourses=await thecoordinator.courses;
                               for(var i=0;i<cocourses.length;i++){
                                   if(thecourse._id==cocourses[i]){coassigned=true; break;}
                               }
                               if(assigned){
                                  thecoordinator.isCourseCoordinator=true;
                                  thecourse. course_coordinator=thecoordinator._id;
                                  await thecoordinator.save();
                                  await thecourse.save();
                                  res.send("done");
                               }else res.status(400).json({msg:"the staffmember you entered is not assigned to this course"});
                           }else res.status(400).json({msg:"your not assigned to this course."});
                       }
                   }                  
                }
            }
        }
        }catch(err){
        res.status(500).json({error:err.message});
    }
})