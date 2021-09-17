const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

app.use(express.json());

var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.key_secret,
});

app.post('/order', (req, res) => {
    let options = {
        amount: req.body.amount * 100,
        currency: "INR"
    };
    console.log(req.body);
    instance.orders.create(options, (err, order) => {
        console.log(order);
        if (!err)
            res.json(order);
        else
            res.send(err);
    })
});

app.post("/verify", (req, res) => {
    console.log(req.body.respose);
    let body =
        req.body.razorpay_order_id +
        "|" +
        req.body.razorpay_payment_id;

    var expectedSignature = crypto
        .createHmac("sha256", process.env.KEY_SECRET)
        .update(body.toString())
        .digest("hex");
    var response = { signatureIsValid: "false" };
    if (expectedSignature === req.body.razorpay_signature)
        response = { signatureIsValid: "true" };
    if(response.signatureIsValid){
        res.sendFile(__dirname + "/Public/success.html")
    }else{
        res.send("Uh Oh! Payment failed, malicious behaviour detected");
    }
});

app.use(express.static(".\\public"));

app.get("/Public/images/favicon.ico", (req, res) => {
    res.sendFile(__dirname + "/Public/images/favicon.ico");
});

const PORT = process.env.PORT || "7777";
app.listen(PORT, () => {
    console.log("Server initiated on port " + PORT);
});
