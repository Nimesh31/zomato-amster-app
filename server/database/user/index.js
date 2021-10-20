import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    fullname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String},
    address: [{detail: {type:String}, for:{type:String}}],
    phoneNumber: [{type: Number}]
  },
  {
    timestamps: true
  });


UserSchema.methods.generateJwtToken = function() {
  return jwt.sign({user: this._id.toString()}, "ZomatoApp");
};
 

  UserSchema.statics.findEmailAndPhone = async ({ email, phoneNumber }) => {
    //check whether the email exists
    const checkUserByEmail = await UserModel.findOne({email});
  
    //check whether the phoneNumber Exists
    const checkUserByPhone = await UserModel.findOne({phoneNumber});
    if(checkUserByEmail || checkUserByPhone) {
      throw new Error("User already exist");
    }
};



//when ever we are saving new thing as data base is updated pre should be executed 
//next is that after this pre is executed move to next task what ever next task is 

UserSchema.pre("save",function(next){
    const user = this;
  
  //if user does not modifie password 
    
  if(!user.isModified("password")) return next();
  // if user modifies password
  // genrating bcrypt salt
    bcrypt.genSalt(8, (error, salt) => {
        if(error) return next(error); //if hashing has no error move to next task
       
        //hasing the password
        bcrypt.hash(user.password, salt, (error, hash) => {
            if(error) return(next);
            bcrypt.hash(user.password, salt, (error, hash)=>{
                if(error) return next(error);
                //assigning hashed password
                user.password = hash;
                return next(); 
            })
        })
    })
});


UserSchema.statics.findByEmailAndPassword = async ({ email, password }) => {
    //check whether the email exists
    const user = await UserModel.findOne({email});
  if(!user) throw new Error("User doesnot exist");
  
    //compare password
    const doesPasswordMatch = await bcrypt.compare(password, user.password);
  
    if(!doesPasswordMatch) {
      throw new Error("Invalid password");
    }
    return user;
  };
export const UserModel = mongoose.model("Users", UserSchema);