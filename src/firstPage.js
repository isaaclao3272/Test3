import React from "react";
import { useState } from "react";
import axios from 'axios'



const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] =useState('');
    
    const handleSubmit = async (event) => {
        event.preventDefault();

    axios.post('http://127.0.0.1:5000/Register',{username, password})
        .then (Response => {
            alert("KO");
        })
        .catch (error =>{
            alert("fail");
        });
 }
    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Username" 
            />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
            />
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;