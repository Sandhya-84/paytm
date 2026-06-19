const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { authMiddleware } = require("../middleware");
const { User, Account, Transaction } = require("../db");
const {ObjectId}=require("mongoose").Types;

// ---------------------- TRANSFER ----------------------
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { amount, to } = req.body;

        // validate amount
        if (!amount || amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Please enter a valid amount"
            });
        }

        // get sender account
        const senderAccount = await Account.findOne({
            userId: req.userId
        }).session(session);

        if (!senderAccount || senderAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        // get receiver user
        const receiver = await User.findById(to).session(session);

        if (!receiver) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Receiver not found"
            });
        }

        // get sender user
        const senderUser = await User.findById(req.userId).session(session);

        if (!senderUser) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Sender not found"
            });
        }

        // deduct sender balance
        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } },
            { session }
        );

        // add receiver balance
        await Account.updateOne(
            { userId: receiver._id },
            { $inc: { balance: amount } },
            { session }
        );

        // create transaction

        console.log("req.userId =", req.userId);
console.log("senderUser =", senderUser); 
        await Transaction.create([{
            senderId: req.userId,
            senderFirstName: senderUser.firstName,
            senderLastName: senderUser.lastName,

            receiverId: receiver._id,
            receiverFirstName: receiver.firstName,
            receiverLastName: receiver.lastName,

            amount
        }], { session });

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


// ---------------------- BALANCE ----------------------
router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    });
});


// ---------------------- TRANSACTIONS ----------------------
// ---------------------- TRANSACTIONS ----------------------
router.get("/transactions", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [
                { senderId: new ObjectId(req.userId) },
                { receiverId:new ObjectId( req.userId) }
            ]
        })
        .populate("senderId", "firstName lastName")   // Automatically fetches sender names
        .populate("receiverId", "firstName lastName") // Automatically fetches receiver names
        .sort({ createdAt: -1 })
        .limit(10);

        // Map the populated data so it matches the format your frontend expects
        const transactionsWithNames = transactions.map(txn => ({
            _id: txn._id,
            amount: txn.amount,
            createdAt: txn.createdAt,
            sender: txn.senderId,   // senderId is now the populated user object
            receiver: txn.receiverId // receiverId is now the populated user object
        }));

        res.json({
            transactions: transactionsWithNames
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error fetching transactions"
        });
    }
});

module.exports = router;