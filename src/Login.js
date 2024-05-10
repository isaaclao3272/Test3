import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import styled from "styled-components";

const Background = styled.div`
    text-align: center;
`;

const Login = () => {
    const [message, setMessage] = useState("請填寫登錄資料")
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [token, setToken] = useState('')
    const navigate = useNavigate()

    const handleSummit = async(event) =>{
        event.preventDefault()
        if (!username || !password) {
            return setMessage("請填寫資料");
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/Login', { username:username, password:password });
            localStorage.setItem('token', response.data.access_token);
            setMessage('登入成功，2秒後將跳到功能頁')
            setTimeout(() => { window.location.href = '/secoundPage';}, 1500);
        }
        catch (error) {
            alert("登錄失敗:" + (error.response?.data?.msg || '未知錯誤'));
        }
    };
    return (
        <Background>
            <form onSubmit={handleSummit}>
            <br></br>
            <div>{message}</div>
            <br></br>
            <input 
            placeholder="username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            type="text"
            ></input>
            <br></br>
            <br></br>
            <input placeholder="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            type="text">
            </input>
            <br></br>
            <br></br>
            <button type="sumit">Login</button>
            </form>
        </Background>

    )
}

export default Login;