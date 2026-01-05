import userModel from '../models/user.model.js'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}

const getUserDetails = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password").populate('favorites');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req,res)=>{
    try {
        const { email,password} = req.body;
        
        //check if user exist
        const user = await userModel.findOne({email}).populate("favorites");

        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }
        
        //checked password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({success:false,message:"Invalid credentials"});
        }
        
        const token = createToken(user._id);
        const userData = user.toObject();
        delete userData.password;
        res.json({success:true,token,user: userData});

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

 const registerUser = async (req,res)=>{
    try {
        const {name,email,mobileNo,password,collegeName,branch,yearOfStudy,image, location} = req.body;

        //if user already exists (same email OR mobile)
        const existUser = await userModel.findOne({ $or: [{ mobileNo }, { email }] });
        if(existUser){
            return res.status(400).json({message:"User with same mobile no or email already exist"});
        }

        //validate email and password
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Invalid Email"});
        }
        if(!validator.isStrongPassword(password)){
            return res.status(400).json({message:"Weak Password"});
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //create new user
        const newUser = new userModel({
            name,
            email,
            mobileNo,
            password:hashedPassword,
            collegeName,
            branch,
            yearOfStudy,
            branch,
            yearOfStudy,
            image,
            location: location || { address: "", coordinates: { lat: 0, lng: 0 } }
        })

        const user = await newUser.save();
        const token = createToken(user._id);
        const userData = user.toObject();
        delete userData.password;
        res.json({success:true,token,user: userData});

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const getCurrentUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const already = user.favorites && user.favorites.find((f) => f.toString() === itemId);
    let updated;
    if (already) {
      updated = await userModel.findByIdAndUpdate(userId, { $pull: { favorites: itemId } }, { new: true }).populate('favorites');
      return res.json({ success: true, action: 'removed', favorites: updated.favorites });
    } else {
      updated = await userModel.findByIdAndUpdate(userId, { $addToSet: { favorites: itemId } }, { new: true }).populate('favorites');
      return res.json({ success: true, action: 'added', favorites: updated.favorites });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

const updateUserProfile = async (req, res) => {
    try {
        const { name, mobileNo, collegeName, branch, yearOfStudy, image, location } = req.body;
        const userId = req.user.id;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { name, mobileNo, collegeName, branch, yearOfStudy, image, location },
            { new: true, runValidators: true }
        ).select("-password").populate('favorites');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: updatedUser, message: "Profile updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { registerUser, loginUser, getUserDetails, toggleFavorite, updateUserProfile, getCurrentUser };