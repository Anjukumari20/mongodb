const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const app=express();
require('dotenv').config();//linking config() from .env file, dotenv is a dependency to hide our mongo url(to make secure)
const port=3000;

app.use(express.json());

app.use(express.static(path.join(__dirname,'public')));

const mongoURI=process.env.MONGO_URI;



//connect to mongodb

mongoose.connect(mongoURI)
.then(()=>console.log('connected to mongodb'))
.catch(err=>console.error('Error connecting to mdb:',err));

//define user schema
const userSchema =new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const User=mongoose.model('user',userSchema); //defining a user model  (odm-object document model)//1st parameter modelname(collection),2nd schema

app.get('/users',(req,res)=>{
    User.find({})//{} means displaying all documents(records) of collection     
    .then(users=>res.json(users))  //here  users is a object
    .catch(err=> res.status(500).json({message:err.message}));
});

//to add data in collection
app.post('/users',(req,res)=>{
    const user=new User({
        name:req.body.name,
        emaill:req.body.email,
        password:req.body.password
    });

    user.save()
    .then(newUser =>res.status(201).json(newUser))
    .catch(err=>res.status(400).json({message:err.message}));
});
 //new :true mwans it shows updated documnent if false then shows old document


 app.put('/users/:id',(req,res)=>{
    const userId=req.params.id;
    const updateData={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    }


User.findByIdAndUpdate(userId,updateData,{new:true})  //new :true mwans it shows updated documnent if false then shows old document
.then(updatedUser=>{
    if(!updatedUser){
        return res.status(404).json({message:'user not found'});
    }
    res.json(updatedUser);
})
.catch(err=>res.status(400).json({message:err.message}));
})


app.delete('/users/:id',(req,res)=>{
    const userId=req.params.id;


    User.findByIdAndDelete(userId)
    .then(deletedUser=>{
        if(!deletedUser){
            return res.status(404).json({message:'user not found'});
        }
        res.json({message:'user deleted sucessfuly'});
    })
    .catch(err=>res.status(400).json({message:err.message}));
});


app.listen(port);