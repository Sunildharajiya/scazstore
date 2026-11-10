
import mongoose from 'mongoose';

export const mongoConnect = async () => {
  // Replace the uri string with your connection string
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