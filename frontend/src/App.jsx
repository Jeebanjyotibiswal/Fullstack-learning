import React, { useState } from 'react'
import GetUser from './pages/GetUser'
import Createuser from './pages/Createuser'
import Updateuser from './pages/Updateuser'
import Deleteuser from './pages/Deleteuser'


function App() {



  return (
    <div>
      <h1>Welcome to Fulstack practice</h1>
      <GetUser />
      <Createuser />
      <br />

<br />      
<Updateuser />
<br />
<br />
<Deleteuser />
    </div>
  )
}

export default App