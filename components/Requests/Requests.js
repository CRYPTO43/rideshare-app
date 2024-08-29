const { ListItem,Button } = require("@mui/material")


const Requests=(props)=>{

    return(
        <ListItem>
            <p>Rider Name: {props.riderData.riderName}</p>
            <p>Rider Rating: {props.riderData.riderRating}</p>
            <p>Rider Distance: {props.riderData.riderDistance}</p>

            <Button>Accept</Button>
            <Button onClick={props.rideRejectHandler}>Reject</Button>
        </ListItem>
    )
}

export default Requests