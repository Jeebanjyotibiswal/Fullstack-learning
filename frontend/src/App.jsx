import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router";

import GetUser from "./pages/GetUser";
import Createuser from "./pages/Createuser";
import Updateuser from "./pages/Updateuser";
import Deleteuser from "./pages/Deleteuser";
import Weatherpage from "./pages/Weatherpage";

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>Welcome to Fullstack Practice</h1>

        <nav>
          <Link to="/">Home</Link> {" | "}
          <Link to="/users">Read Users</Link> {" | "}
          <Link to="/create-user">Add User</Link> {" | "}
          <Link to="/update-user">Update User</Link> {" | "}
          <Link to="/delete-user">Delete User</Link> {" | "}
          <Link to="/weather">Weather</Link>
        </nav>

        <hr />

        <Routes>
          <Route
            path="/"
            element={<h2>Welcome! Select an option above.</h2>}
          />

          <Route path="/users" element={<GetUser />} />

          <Route path="/create-user" element={<Createuser />} />

          <Route path="/update-user" element={<Updateuser />} />

          <Route path="/delete-user" element={<Deleteuser />} />
          <Route path="/weather" element={<Weatherpage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
