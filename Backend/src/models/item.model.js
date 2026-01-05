import mongoose from "mongoose";


const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required:true
  },
  images: {
    type:Array,
    required:true
  },
  category:{
    type: String,
    required:true
  },
  subCategory:{
    type: String,
    required:true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isSold: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });



const Item = mongoose.model("Item", itemSchema);
export default Item;
