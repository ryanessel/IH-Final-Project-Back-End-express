const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const partSchema = new Schema(
  {
    partNumber:{
        type: String,
        // required: true
    },
    partDescription:{
        type: String,
        // required: true
    },
    material:{
        type: String,
        // required: true
    },

    cost: Number,
    sell: Number,
    profit: {
        type: Number,
        set: calculateProfit
    },
    margin: {
        type: Number,
        set: calculateMargin
    },
    test: Number,

  

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);


function calculateProfit() {
  

    return (this.sell * 100  - this.cost * 100 ) / 100
  }

function calculateMargin() {
    return (((this.sell - this.cost) / this.sell) * 100)
  }

const Part = model("Part", partSchema);

module.exports = Part;
