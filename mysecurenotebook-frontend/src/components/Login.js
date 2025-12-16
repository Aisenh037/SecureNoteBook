import React from "react";

const Login = () => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [jwt, setJwt] = React.useState("");
    const [profile, setProfile] = React.useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch("http://localhost:8082/signin",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setJwt(data.jwtToken);
                setMessage("Login successful!");
                fetchUserProfile(data.jwtToken);
            }else{
                setMessage("Login failed!");
            }
        }catch(error){
            console.log("Error during login:", error);
            setMessage("An error occurred during login please try again.");
        }
    }

    const fetchUserProfile = async (jwtToken) => {
        try{
            const response = await fetch("http://localhost:8082/profile",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwtToken}`
                    }
                }
            );
            if(response.ok){
                const data = await response.json();
                console.log(data);
                setProfile(data);
            }else{
                setMessage("Failed to fetch profile.");
            }
        }catch(error){
            console.log("Error fetching profile:", error);
            setMessage("An error occurred while fetching profile.");
        }   
    }

    return (
        <div>
            {!profile ? (
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
           
            ): (<div>
                <h3>User Profile</h3>
                <p>Username: {profile.username}</p>
                <p>Role: {profile.roles.join(", ")}</p>
                <p>Message: {profile.message}</p>
            </div>)}

            {message && <p>{message}</p>}
            {jwt && <p>JWT Token: {jwt}</p>}

        </div>
    );
}

export default Login;