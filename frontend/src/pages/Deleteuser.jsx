import React, { useState } from 'react'
import axios from 'axios'
function Deleteuser() {
    const [id,setID]=useState("")
    const handleDelete=async()=>{
        const url=`http://127.0.0.1:8000/delete-user/${id}`
        try{
            const response=await axios.delete(url)
            alert("user deleted")
        }
        catch(error){
            console.log(error)
            alert(error)
        }
    }
  return (
    <div>
        <h1>Dlete User</h1>
        <input type="number" placeholder='Enter ur ID' value={id} onChange={(e)=>{Number(setID(e.target.value))}} />
        <button onClick={handleDelete}>Delete</button>
    </div>
  )
}

export default Deleteuser