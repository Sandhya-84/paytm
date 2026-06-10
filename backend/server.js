const express = require("express");
const cors=require("cors");
const mainRouter=require("./routes/index");
const port=process.env.PORT || 3000;


const app=express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("PayTM Backend Running");
});

app.use("/api/v1",mainRouter);
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

