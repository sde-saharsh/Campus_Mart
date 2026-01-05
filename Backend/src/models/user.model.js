import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  mobileNo: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  image: {
    type: String,
    default: ""
  },
  collegeName: {
    type: String,
    required: true
  },
  yearOfStudy: {
    type: String
  },
  branch: {
    type: String,
    required: true
  },
  location: {
    address: { type: String, default: "" },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 }
    }
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  averageRating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    index: true
  }],
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item"
  }]
}, { timestamps: true });



const User = mongoose.model("User", userSchema);
export default User;
