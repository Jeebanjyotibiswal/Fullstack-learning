import { useState, useEffect } from "react";
import axios from "axios";
import Redis from "./Redis";

function GetUser() {
  const [data, setData] = useState([]);

  const getData = async () => {
    const url = "http://127.0.0.1:8000/users";

    try {
      const response = await axios.get(url);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>redis Data</h1>
        <Redis />
      <h1>All Users</h1>

      <div>
        
        {data.map((item) => (
          <div key={item.id}>
            <p>Name: {item.username}</p>
            <p>Email: {item.email}</p>
            <p>Age: {item.age}</p>
            <p>ID: {item.id}</p>
            <p>---------------</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GetUser;
