import {React, useState, useEffect} from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

const Background = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 20px;   
`;

const Greeting = styled.div`
    flex: 1 ;
  font-size: 20px;
`;

const Logout = styled.button`
    flex: 0.05 ;
    font-size: 12px;
    width: 80px;
    height: 25px;
    text-align: center;
`;


const StatesBar = () =>
{   
    const [username, setUsername] = useState("Stranger");
    const location = useLocation()
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');

        if (storedUsername) {
          setUsername(storedUsername);
        }
    }, []);

    function handleLogOut () {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        window.location.href = '/';
    }
    
    return(
        <Background>
            <Greeting>Hello {username} </Greeting>
            {location.pathname !== '/' && (
            <Logout onClick={handleLogOut}>Logout</Logout>
            )}
            
        </Background>
    )
}

export default StatesBar;