const express = require("express");
const router = express.Router();

router.post('/register', (req,res) => {
    const {from, to, message} = req.body;    
    console.log("from: ", from)
    console.log("to: ", to)
    console.log("message: ", message)
    try {
       res.status(200).json({message: "Acknowledged"})
    } catch(error) {
        res.status(422).json(error);
    }
}) 

// Return the greeting
router.get('/greetings', (req,res) => {
    console.log("called booking/greeetings")
    try {
        res.status(200).json({message: "Would you like to make a booking, please send me the booking detail"})
     } catch(error) {
         res.status(422).json(error);
     }
});

// I will provide the input in the requet body 
// from dialogflow and return an output string
router.post('/new', (req,res) => {
    console.log("Book new appointment",req.body)
    try {
        const message = 
        `${req.body.data.user} booked with ${req.body.data.booking.person} at ${req.body.data.booking.date_time}`
        res.status(200).json({message})
     } catch(error) {
        console.log(error);
        res.status(422).json(error);
     }
});

module.exports = router;