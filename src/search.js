import React ,{useState}from "react";
import axios from "axios";
import { json } from "react-router-dom";

const Search = () => {
    const conditionalSeacher = async(endpoint,con1,con2) => {
       try{
        const response = axios.get(`http://127.0.0.1:5000${endpoint}/?con1=${con1}&con2=${con2}`)
            const data = response.data.data;
            const columnTitle = response.data.columnTitle;
            return {'data':data, 'columnTitle':columnTitle};
       } catch (error){ 
    }
    };

    return (
        <div>
            
        </div>
    );
};

export default Search;