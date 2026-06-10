const express=require("express");
const router=express.Router();
const { authMiddleware } = require("../middleware");
const {User,Account}=require("../db");
const jwt=require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const zod=require("zod");

const signinSchema = zod.object({
username: zod.string(),
password: zod.string()
});

router.post("/signin",async (req,res)=>{
    const result = signinSchema.safeParse(req.body); 

    if (!result.success) { 
        return res.status(400).json({
             message: "Invalid inputs" 
            });
     }

    const body=req.body;
    const user=await User.findOne({
        username:body.username,
        password:body.password
    });

    if(!user){
        return res.status(401).json({
            message:"Error while logging in"
        })
    }
    const token=jwt.sign({
        userId: user._id
    },JWT_SECRET,{
        expiresIn:"7d"
    });
    res.status(200).json({
        token
    });
});


const signupSchema=zod.object({
    username:zod.string().min(3).max(20),
    password:zod.string().min(8),
    firstName:zod.string().max(30),
    lastName:zod.string().max(30)
})
router.post("/signup",async (req,res)=>{
    const body=req.body;
    const result=signupSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            message:"Invalid inputs"
        });
    }
    const existingUser=await User.findOne({
        username:body.username,
    })

    if(existingUser){
        return res.status(400).json({
            message:"Username already taken/ Incorrect inputs"
        });
    }
  const dbUser= await User.create(body);

  await Account.create({
    userId: dbUser._id,
    balance: 1+Math.random()*10000
  })

  const token=jwt.sign({
    userId: dbUser._id
  },JWT_SECRET,{
    expiresIn:"7d"
  });
   res.json({
    message:"User created successfully",
    token
   });
}) ;

const updateBody=zod.object({
    password:zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optional()
})

router.put("/", authMiddleware, async (req, res) => {

    const { success } = updateBody.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            message: "Error while updating information"
        });
    }

    await User.updateOne(
        { _id: req.userID },
        req.body
    );

    res.json({
        message: "User information updated successfully"
    });
});


router.get("/bulk",async(req,res)=>{
    const filter=req.query.filter || "";
    const users=await User.find({
        $or: [{
            firstName:{
                "$regex":filter,
                "$options": "i"
            }
        },
            {
                lastName:{
                    "$regex":filter,
                    "$options": "i"
                }
        }]
    })
    res.json({
        users: users.map(user=>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id

        }))
        })
})
module.exports=router;