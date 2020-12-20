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
const { off } = require('../Models/AcademicStaffModel.js');


//Locations Adding,deleting, and updating
//fadel autherization
//adding
router.route('/Location').post(async(req,res)=>{
    //to authorize
    //if(req.user.role!='HR')
      // res.status(401).send('Access Denied');
    try{
        //yedakhaly max_capacity wla ahotaha ana based 3la el type?
        const{id,type,maximum_capacity}=req.body;
        if(!id || !type || !maximum_capacity)
           return res.status(400).json({msg:"Please enter a correct location"});
        else{
            if(location.findOne({"id":id})) res.status(400).json({msg:"a location with this id already exists"});
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
})

//deleting
.delete(async (req,res)=>{
   try{
    const{id}=req.body;
   if(!id) res.status(400).json({msg:"please enter the id of the location to be deleted"});
   else{ 
    await location.deleteOne({"id":id});
    res.send("done");
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
             res.status(400).json({msg:"Cannot update the current capacity of this location is already exceeding the new maximum capacity."})
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
            await faculty.deleteOne({"name":name});
            res.send("Done");
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
            await department.deleteOne({"name":name});
            res.send("done");
        }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//updating
.put(async(req,res)=>{
    try{
       const{oldname,name,facultyname,hod}=req.body;
       if(!oldname||!name||!facultyname) res.status(400).json({msg:"Please fill all the fields."});
       else{
           const ob= await department.findOne({"name":oldname});
           if(ob==null) res.status(400).json("there is no department with that name.");
           else{
               var hod1=null;
             if(!hod) hod1=null;
             else hod1=hod;
             const obnew=await department.findOne({"name":name});
             if( obnew==null || name==oldname){
                const fid=await faculty.findOne({"name":facultyname});
                if(fid==null) res.status(400).json({msg:"No faculty with that name exists."})
                else{
                ob.name=name;
                ob.faculty=fid._id;
                ob.HOD=hod;
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
app.route('/course').post(async(req,res)=>{
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
           await course.deleteOne({"id":id});
           res.send("done");
       }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
//updating
.put(async (req,res)=>{
    try{
        //academic staff is a list of staff members ids
       const{oldid,id,name,departmentname,academicStaff,slotsneeded,slotscovered,schedule,coordinator}=req.body;
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
                      if(coordinator){
                          const co=(await StaffMember.findOne({"id":coordinator}));
                          if(co==null) res.status(400).json({msg:"the coordinator id does not exist"});
                          else{
                          const ca=await AcademicStaff.findOne({"member":co._id});
                          if(ca==null || ca.type!= 'Teaching Assistant') res.status(400).json({msg:"the id of coordinator doesn't belong to a TA"});
                          else
                              ob.coordinator=co._id;
                      }
                    }
                      //to test
                      if(academicStaff){
                        var acStaff=new [academicStaff.length];
                        for(var i=0;i<academicStaff.length;i++){
                            var sm= (await StaffMember.findOne({"id":academicStaff[i]}))._id
                            var ac=await AcademicStaff.findOne({"member":sm});
                            if(ac!=null) acStaff[i]=sm;
                            else{
                                res.status(400).json({msg:"one of the academic staff you are adding doesn't exist"});
                                break;
                            }
                        } 
                      }
                      //to test w check the logic
                      if(schedule) ob.schedule=schedule;
                        (await ob).id=id;
                        (await ob).name=name;
                         (await ob).department=(await dep)._id
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
router.route('/staffmember').post(async(req,res)=>{
    try{
       const{name,email,salary,officelocation,type,dayoff,gender}=req.body;
       if(!email||!salary||!officelocation|| !gender) res.status(400).json({msg:"please fill all the fields"});
       else{
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
                        for(var i=num;i>=0;i--){
                            if(i==0){
                                sid="ac-1";
                                break;
                            }
                            var tuple=await StaffMember.findOne({"id":"ac-"+i});
                            if(tuple!=null) {sid="ac-"+(i+1); break;} 
                        }
                     }
                     const toAdd=await new StaffMember({"id":sid,"email":email,"salary":salary,"name":name,"office":office._id,"staff_type":type,"dayoff":doff,"gender":gender});
                     await toAdd.save();
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
          await StaffMember.deleteOne({"email":email});
          res.send("done");
        }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})
.put((req,res)=>{

})

router.route('/updatesalary').put((req,res)=>{
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
module.exports=router;