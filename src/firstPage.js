import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('請填寫資料');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 基本的表單驗證
        if (!username || !password) {
            setMessage('請填寫所有欄位');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/Register', { username, password });
            setMessage('註冊成功！');
            navigate('/Login');
        } catch (error) {
            setMessage('註冊失敗：' + (error.response?.data?.error || '未知錯誤'));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>{message}</div>
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Username" 
            />
            <br/>
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
            />
            <br></br>
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
