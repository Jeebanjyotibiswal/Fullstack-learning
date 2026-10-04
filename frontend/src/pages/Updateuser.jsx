import React, { useState } from 'react'
import axios from 'axios'
function Updateuser() {
const [id,setId]=useState("")
  const [ username,setUsername]=useState("")
  const [ email,seEmail]=useState("")
  const [ age,setAge]=useState("")
  const handleUpadte=async()=>{
     const url = `http://127.0.0.1:8000/users/${id}`;
     const data={
        "username":username,
        "email":email,
        "age":age
     }
     try{
        const response=await axios.put(url,data)
        
        alert("User updated")
     }
     catch(error){
        console.log(error);
        alert(error)

     }

         
  }
  return (
    <div>
        <h1>Update User</h1>
        <input type="number" placeholder='Enter your ID' value={id} onChange={(e)=>{Number(setId(e.target.value))}} />
         <input type="text" placeholder='Enter your Username'value={username} onChange={(e)=>{setUsername(e.target.value)}} />
         <input type="text" placeholder='Enter your email'value={email} onChange={(e)=>{seEmail(e.target.value)}} />
         <input type="number" placeholder='Enter your Age' value={age} onChange={(e)=>{Number(setAge(e.target.value))}} />
         <button onClick={handleUpadte}>Update</button>
    </div>
  )
}

export default Updateuser