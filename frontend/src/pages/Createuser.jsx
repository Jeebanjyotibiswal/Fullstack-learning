import React, { useState } from 'react'
import axios from 'axios'
function Createuser() {
  const [username,setUsername]=useState("")
   const [email,setEmail]=useState("")
    const [age,setAge]=useState("")
    const handleCreate= async ()=>{
          const url = "http://127.0.0.1:8000/users";
          const data={
            "username":username,
            "email":email,
            "age":age
          }
          try{
            const response=await axios.post(url,data)
            alert("user registered sucessfully")
          }
          catch(error){
            console.log(error)
            alert(error)
          }
    }
  return (
    <div>
      <h1>Create User</h1>
      <input type="text" placeholder='Enter your name' value={username} onChange={(e)=>{setUsername(e.target.value)}}  />
      <input type="text" placeholder='Enter your Email' value={email} onChange={(e)=>{setEmail(e.target.value)}} />
        <input
        type="number"
        placeholder="Enter your age"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}

export default Createuser;