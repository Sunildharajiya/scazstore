import express from 'express'
import { User } from '../../db/models/users.model.js'
export const createUserRouter = express.Router()

createUserRouter.post("/", async( req , res ) =>{
try{
  const { firstName , LastName , 
         userName , role , password ,
        email , mobile , secondryMobile,
          deliveryAddress
        } = req.body;

 const newUser = await User.create({
    firstName , LastName , 
    userName , role , password ,
    email , mobile , secondryMobile,
    deliveryAddress
 })

  return res.status(201).json({
      success: true,
      message: "User created successfully...",
      data: {
        userName , role ,
        email , mobile , secondryMobile
      },
    });
}catch(error){
  // Handle Mongoose schema validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        errors: messages
      });
    }
    else{
    //Handle unexpected server errors
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
    }
}

})

