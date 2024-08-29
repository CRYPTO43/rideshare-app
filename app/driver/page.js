"use client"; 

import RequestBoard from "@/components/RequestBoard/RequestBoard"
import { Button } from "@mui/material"
import DriverLoginForm from "@/components/Forms/DriverLoginForm";
const Driver=()=>{
    
    return(
        <>
        <p>This is driver</p>
        <DriverLoginForm/>

        <Button>Start</Button>

        <RequestBoard/>
        </>
    )
}

export default Driver