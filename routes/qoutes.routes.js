const mongoose = require('mongoose');
const router = require("express").Router();
const User = require("../models/User.model");
const Quote = require("../models/Quote.model")
const Part = require("../models/Part.model")


//GET ROUTE - ALL QUOTES
router.get("/quotes", (req, res, next) => {
Quote.find()
.populate("quoteParts.part")
.then((allQuotes) =>  res.json(allQuotes))
.catch(error => res.json(error))
});



//GET QUOTE DETAILS ID
router.get("/quote/:quoteId", (req, res, next) => {
    const { quoteId } = req.params;
console.log("quoteID",quoteId)
    
    Quote.findById(quoteId)
    .populate("quoteParts.part") // the parts that exist 
    .then((theQuote) => { 
        console.log("THEQYOTE", theQuote)


//      const theQty =  theQuote.quoteParts[0].qty
//      const theSell = theQuote.quoteParts[0].part.sell
//      const theCost = theQuote.quoteParts[0].part.cost


//         //  theQuote.totalSell = theSell * theQty;
//         //  theQuote.totalCost = theCost * theQty;
//         //  theQuote.totalProfit = theQuote.totalSell - theQuote.totalCost;
        
// adding new keys to the quote array
// this bit is deleteing the data.
//should be calculated on the fornt end.
    

    


        // forEach loop
        //loop through theQuote.quoteParts
        //add up all relavent numbers
        //updatedQuote. =+ thatPart.price

        //
        
        res.json(theQuote)
      
    });
     
    });





    //QUOTE POST- CREATE ROUTE
    

// okay for these to be simple/.


    router.post(`/quotes`, (req, res, next ) => {
        
        const {
        quoteNumber,
        dateIssued,
        validity,


        customer,
        contact,
        address,    

        notes,
        
        author,

        quoteParts,
        totalSell
        
        } = req.body;
        
        Quote.create({
            quoteNumber,
            dateIssued,
            validity,


            customer,
            contact,
            address,

            notes,
            author,
            quoteParts,
            totalSell
        })
            .then((newQuote) => res.json(newQuote))



    })


//EDIT PARTS - PUT ROUTE
    router.put('/quote/:quoteId', (req, res, next) => {
        const { quoteId } = req.params;
    // if the project id doesn't exist then you and error message is thrown.
        if(!mongoose.Types.ObjectId.isValid(quoteId)) {
            res.status(400).json({message: "Specified id is not valid (may not exist)"});
            return;
        }
console.log("PUT THING",req.body)
     
    //...If it the id does exist it will find and update the projcet. havint "new: true " will show the page wit hthe updated info.
        Quote.findByIdAndUpdate(quoteId, {  

            address: req.body.address,

            quoteNumber: req.body.quoteNumber,
            dateIssued: req.body.dateIssued,
            validity: req.body.validity,


            customer: req.body.customer,
            contact: req.body.contact,
            address: req.body.address,

            notes: req.body.notes,
            author: req.body.author,
            
            totalSell: req.body.totalSell,
        
        },{ new: true })
        .then((updatedQuote) =>{ 
            
            
            Quote.findByIdAndUpdate(quoteId, 
                { $set:  {quoteParts:  req.body.newParts }}, {new: true}   )
                .then((finalQuote)=> {

                    res.json(finalQuote)
                })
            
          })




        .catch(error => res.json(error));
    
    
    })
    



//DELETE 
    router.delete('/quote/:quoteId', (req, res, next) => {
        const { quoteId } = req.params;
    
        if (!mongoose.Types.ObjectId.isValid(quoteId)) {
            res.status(400).json({ message: "Specified id is not valid (may not exist)"});
            return;
        }
    
        Quote.findByIdAndRemove(quoteId)
        .then(() => res.json({ message: `Quote wtih ${quoteId} is removed succesfully.` }))
        .catch(error => res.json(error))
    
    
    })
    




    module.exports = router;