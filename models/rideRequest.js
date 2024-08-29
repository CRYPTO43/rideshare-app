import mongoose,{mongo, Schema} from "mongoose";


const rideRequestSchema=new Schema({
    riderName: {
        type: String,
        required: true,
      },
      riderId:String,
      currLat: {
        type: String,
        required: true,
      },
      currLon: {
        type: String,
        required: true,
      },
      destLat: {
        type: String,
        required: true,
      },
      destLon: {
        type: String,
        required: true,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    
})

const rideRequest= mongoose.models.RideRequest || mongoose.model("RideRequest", rideRequestSchema);

export default rideRequest;