import mongoose,{mongo, Schema} from "mongoose";
import rideRequest from "./rideRequest";

const requestBoardSchema=new Schema({
    driverId: String,
    requests: [rideRequest.schema],
    
})

const RequestBoardDriver = mongoose.models.RequestBoard || mongoose.model("RequestBoard", requestBoardSchema);

export default RequestBoardDriver;