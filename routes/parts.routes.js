const mongoose = require('mongoose');
const router = require("express").Router();
const User = require("../models/User.model");
const Part = require("../models/Part.model")


//GET ROUTE - ALL PARTS!!!1
router.get("/parts", (req, res, next) => {
Part.find()
.then((allParts) =>  res.json(allParts));
 
});


//GET ROUTE DETAILS (ID)
router.get('/part/:partId', (req, res, next) => {
    const { partId } = req.params

    if(!mongoose.Types.ObjectId.isValid(partId)) {
        res.status(400).json({message: "Speficied id doesn't exist or isn't valid"})
        return;
    }

    Part.findById(partId)
        .then(project => res.status(200).json(project))
        .catch(error => res.json(error))

})



//POST ROUTE - CREATES A NEW PART IN THE DB PER THE INPUTS
router.post('/parts', (req, res, next) => {
    const { 
        cost, 
        sell,
        profit, 
        margin, 
        partNumber,
        partDescription,
        material,
        test } = req.body;

    Part.create({
        cost, 
        sell, 
        profit, 
        margin, 
        partNumber,
        partDescription,
        material,
        test})
        .then(newPart => res.json(newPart))
        .catch(err => res.json(err));

});


// PUT(edit)  /api/projects/:projectId  -  Updates a specific project by id
router.put("/part/:partId", (req, res, next) => {
    const { partId } = req.params;
// if the project id doesn't exist then you and error message is thrown.
    if(!mongoose.Types.ObjectId.isValid(partId)) {
        res.status(400).json({message: "Specified id is not valid (may not exist)"});
        return;
    }
//...If it the id does exist it will find and update the projcet. havint "new: true " will show the page wit hthe updated info.
    Part.findByIdAndUpdate(partId, req.body, { new: true })
    .then((updatedPart) => res.json(updatedPart))
    .catch(error => res.json(error));


})



router.delete('/part/:partId', (req, res, next) => {
    const { partId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(partId)) {
        res.status(400).json({ message: "Specified id is not valid (may not exist)"});
        return;
    }

    Part.findByIdAndRemove(partId)
    .then(() => res.json({ message: `Project wtih ${partId} is removed succesfully.` }))
    .catch(error => res.json(error))


})





module.exports = router;
