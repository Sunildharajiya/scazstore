
import mongoose from 'mongoose';

export const mongoConnect = async () => {
  const atlas = process.env.URI

  try{
    await mongoose.connect(atlas ,{
      dbName:"scazstore"
    })
    console.log("mongoDB connected succesfully");
    
  }catch(err){
    console.error("connection failed... \n " , err)
}
}