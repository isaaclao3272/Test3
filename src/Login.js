import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import styled from "styled-components";
import StatesBar from "./stateBar";

const MainContiner = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`;

const Top = styled.div`
    flex: 0 1 50px;  // Fixed height of 100px
    background-color: #e9ecef;
    padding: 0 20px;
    display: flex;
    align-items: center;
`;

const Body = styled.div`
    flex: 1;
    display: flex;
    background-color: white;
    justify-content: center;
    align-items: center;
`;

const Bottom = styled.div`
    flex: 0 1 100px;
    background-color: white;
`;


const Button = styled.button`
    width:150px;
    height: 20px;
`;

const Form = styled.div`
    width:300px;
    height: 200px;
    text-align: center;
`;


const Login = () => {
    const [message, setMessage] = useState("請填寫登錄資料")
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [token, setToken] = useState('')
    const navigate = useNavigate()
    const [connectInfo, setconnectInfo] = useState("")

    const handleSummit = async(event) =>{
        event.preventDefault()
        if (!username || !password) {
            return setMessage("請填寫資料");
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/Login', { username:username, password:password });
            localStorage.setItem('username', username);
            localStorage.setItem('token', response.data.access_token);
            setMessage('登入成功，2秒後將跳到功能頁')
            setTimeout(() => { window.location.href = '/selectPage';}, 1500);
        }
        catch (error) {
            alert("登錄失敗:" + (error.response?.data?.msg || '未知錯誤'));
        }
    };

    function connectToServer ()
    {
        axios.get("http://127.0.0.1:5000")
            .then(response => {
                setconnectInfo(response.data);
            })
            .catch(error => {
              console.log(error);
            });
    };

    useEffect(() => {
        connectToServer()
    },[])

    return (
        <MainContiner>
            <Top><StatesBar/></Top>
            <Body>
                <Form>
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
                    <Button type="submit">Login</Button>
                    <br></br>
                    <br></br>
                    <div>{connectInfo}</div>
                    </form>
                </Form>
            </Body>
            <Bottom></Bottom>
        </MainContiner>

    )
}

export default Login;