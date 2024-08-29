import Requests from "../Requests/Requests"
import { ListItem,List } from "@mui/material"


const RequestBoard=()=>{

    let requestDummy={
        riderName:"Arsh",
        riderRating: 4.5,
        riderDistance: 5,
    }

    const rideReject=()=>{
        
    }


    return(
        <>
        <h2>Available Requests</h2>
        <List>
            <Requests riderData={requestDummy}/>
        </List>
        </>
    )
}

export default RequestBoard