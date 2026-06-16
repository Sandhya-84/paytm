const express=require("express");
const router=express.Router();
const { authMiddleware } = require("../middleware");
const {User,Account}=require("../db");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
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
    });


    if(!user){
        return res.status(401).json({
            message:"Error while logging in"
        })
    }
    const passwordMatch = await bcrypt.compare(
    body.password,
    user.password
);
    if (!passwordMatch) {
    return res.status(401).json({
        message: "Error while logging in"
    });
}

    const token=jwt.sign({
        userId: user._id
    },JWT_SECRET,{
        expiresIn:"7d"
    });
    console.log("User firstName:", user.firstName);
    res.status(200).json({
        token,
        firstName: user.firstName
    });
});


const signupSchema=zod.object({
    username:zod.string().min(3).max(20),
    password:zod.string().min(8),
    firstName:zod.string().max(30),
    lastName:zod.string().max(30)
})
router.post("/signup",async (req,res)=>{
      console.log("SIGNUP ROUTE HIT");
    const body=req.body;
    const result=signupSchema.safeParse(req.body);
   if (!result.success) {
    console.log(result.error);

    return res.status(400).json({
        error: result.error
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
  const hashedPassword = await bcrypt.hash(body.password, 10);

  const dbUser = await User.create({
    username: body.username,
    password: hashedPassword,
    firstName: body.firstName,
    lastName: body.lastName
});
console.log("Saved password:", dbUser.password);

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


    if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
}

    await User.updateOne(
        { _id: req.userId },
        req.body
    );

    res.json({
        message: "User information updated successfully"
    });
});


router.get("/bulk", authMiddleware,async(req,res)=>{
   console.log("req.userId =", req.userId);
    const filter=req.query.filter || "";
    const users=await User.find({
         _id: { $ne: req.userId },
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