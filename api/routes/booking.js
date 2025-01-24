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

// Not an event
router.get('/greetings', (req,res) => {
    console.log("called booking/greeetings")
    try {
        res.status(200).json({message: "Would you like to make a booking, please send me the booking detail"})
     } catch(error) {
         res.status(422).json(error);
     }
});


module.exports = router;