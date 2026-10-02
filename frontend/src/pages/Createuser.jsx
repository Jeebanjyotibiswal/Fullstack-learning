import React from "react";
import axios from "axios";
import { useState } from "react";

function Createuser() {
  const [usename, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "http://127.0.0.1:8002/users/";
    const data = {
      username: usename,
      email: email,
      age: age,
    };
    try {
      const response = await axios.post(url, data);
      alert("User created successfully");
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };
  return (
    <div>
      <h1>Create user</h1>
      <input
        type="text"
        placeholder="username"
        value={usename}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <br />
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <br />
      <input
        type="text"
        placeholder="age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
            <br />
      <br />
      <button onClick={handleSubmit}>Create user</button>
    </div>
  );
}

export default Createuser;
