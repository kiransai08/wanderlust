const mongoose = require("mongoose");


const schema = mongoose.Schema;

const Review = require("./review");

let listschema = new schema({
    title:
    {
      type:String,
      required: true,
    },
    description:{
     type:String
    },
    image:{
        filename:String,
        url:String
       
     },
    price:{
        type:String
    },
    location:{
        type:String
    },
    country:{
        type:String
    },

    reviews:[{
        type : schema.Types.ObjectId,
        ref : "Review"
}]
})

listschema.post("findOneAndDelete" , (list)=>{
    if(list)
    {
        reviews.deleteMany({_id : {$in : list.reviews }});
    }
})

const listing =  mongoose.model("listing" , listschema);

module.exports = listing;