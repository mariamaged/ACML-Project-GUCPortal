const express=require('express')
const router=express.Router();
const AcademicStaff=require('../Models/AcademicStaffModel.js')
const StaffMember=require('../Models/StaffMemberModel.js')
const StaffMemberModel = require('../Models/StaffMemberModel.js')
const location= require('../Models/LocationModel.js')
const HR=require('../Models/HRModel.js');
const faculty=require('../Models/FacultyModel');
const department=require('../Models/DepartmentModel');
const jwt=require('jsonwebtoken');


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



module.exports=router;