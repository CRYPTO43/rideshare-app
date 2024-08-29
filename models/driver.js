import mongoose,{mongo, Schema} from "mongoose";


const driverSchema=new Schema({
    name:String,
    email:String,
    pass:String,
    rating:Number,
    rides:Number,
    isOnline:Boolean,
    isOnRide:Boolean,
    currCity:String,
    currLan:String,
    currLon:String
})

const Driver = mongoose.models.Driver || mongoose.model("Driver", driverSchema);

export default Driver;