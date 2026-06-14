const express=require("express");
const mongoose=require("mongoose");
const router=express.Router();
const { authMiddleware } = require("../middleware");
const {User,Account}=require("../db");

router.get("/balance",authMiddleware,async(req,res)=>{
    const account=await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
})

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { amount, to } = req.body;

        const senderAccount = await Account.findOne({
            userId: req.userId
        }).session(session);

        if (!senderAccount || senderAccount.balance < amount) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const receiver = await User.findById(to).session(session);

        if (!receiver) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Receiver not found"
            });
        }

        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } },
            { session }
        );

        await Account.updateOne(
            { userId: receiver._id },
            { $inc: { balance: amount } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.json({
            message: "Transfer successful"
        });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        console.log(err);

        res.status(500).json({
            message: "Transfer failed"
        });
    }
});


router.get("/balance",authMiddleware,async(req,res)=>{
    const account=await Account.findOne({
        userId: req.userId
    });
    res.json({
        balance: account.balance
    });
});

module.exports=router;