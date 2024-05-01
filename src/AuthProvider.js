import React from "react";
import { useState, createContext, useContext } from "react";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [authToken, SetAuthToken] = useState(localStorage.getItem('token'));
    
    const login =  (token) => {
        localStorage.setItem('token', token);
        SetAuthToken(token)
    };

    const logout = () => {
        localStorage.removeItem('token');
        SetAuthToken(null);
    };

    return(
        <AuthContext.Provider value={{authToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);