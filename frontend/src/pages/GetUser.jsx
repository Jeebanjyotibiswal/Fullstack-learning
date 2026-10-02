import React, { useEffect, useState } from "react";
import axios from "axios";

function GetUser() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getUserdata = async () => {
      const url = "http://127.0.0.1:8002/users/";

      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    getUserdata();
  }, []);

  return (
    <div>
      <h1>All users</h1>
      {data.length === 0 ? (
        <p>No users found.</p>
      ) : (
        data.map((item) => (
          <div key={item.id}>
            <p>Name: {item.username}</p>
            <p>Email: {item.email}</p>
            <p>Age: {item.age}</p>
            <p>-------------------------------------------</p>
          </div>
        ))
      )}
    </div>
  );
}

export default GetUser;
