import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Models
import { UserModel } from "../../database/user";
import passport from "passport";

const Router = express.Router();

/*
Route       signup
Descrip     signup with email and password
params      None
Access      Public
Methode     Post
*/

Router.post("/signup", async(req, res) => {
    try{

        await UserModel.findEmailAndPhone(req.body.credentials);

        //Data Base

        const newUser = await UserModel.create(req.body.credentials);

        //JWT Auth Token
        const token = newUser.generateJwtToken();
        return res.status(200).json({token});
    } 
    catch (error){
        return res.status(500).json({error: error.message});
    }
});

/*
Route         /signin
Descrip       Signin with email and password
Params        None
Access        Public
Method        POST
*/

Router.post("/signin", async(req,res) => {
    try {
        await ValidateSignin(req.body.credentials);
  
        const user = await UserModel.findByEmailAndPassword(
        req.body.credentials
      );
  
     //JWT Auth Token
     const token = user.generateJwtToken();
  
     return res.status(200).json({token, status: "Success"});
  
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
  });


/*
Route         /google
Descrip       google sign in
Params        None
Access        Public
Method        GET
*/

Router.get("/google", passport.authenticate("google", {
    scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
    ],
}));


/*
Route         /google/callback
Descrip       google sign in callback
Params        None
Access        Public
Method        GET
*/

Router.get("/google/callback", passport.authenticate("google",{failureRedirect: "/"}),
(req, res) => {
    return res.json({token: req.session.passport.user.token});

}
);

export default Router;