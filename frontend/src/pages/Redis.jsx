import React, { useState } from "react";
import axios from "axios";

function Redis() {

    const [id, setId] = useState("");
    const [data, setData] = useState(null);

    const handleFind = async () => {

        if (!id) {
            alert("Please enter User ID");
            return;
        }

        const url = `http://127.0.0.1:8000/users/${id}`;

        try {

            const response = await axios.get(url);

            console.log(response.data);

            setData(response.data);

        } catch (error) {

            console.log(error);
            alert("User not found");

        }
    };

    return (
        <div>

            <h1>Redis Implementation</h1>

            <input
                type="number"
                value={id}
                placeholder="Enter your ID"
                onChange={(e) => setId(e.target.value)}
            />

            <button onClick={handleFind}>
                Find
            </button>

            {data && (
                <div>

                    <h2>User Details</h2>

                    <p>
                        Source: {data.source}
                    </p>

                    <p>
                        ID: {data.data.id}
                    </p>

                    <p>
                        Username: {data.data.username}
                    </p>

                    <p>
                        Email: {data.data.email}
                    </p>

                    <p>
                        Age: {data.data.age}
                    </p>
                    <p> redis implement done</p>
                    <p>---------------------------------------------------</p>

                </div>
            )}

        </div>
    );
}

export default Redis;