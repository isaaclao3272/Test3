import React,{useEffect,useState} from "react";
import axios from "axios";

const Countingnumber = () => {
    const {data, setData} = useState()

    useEffect(() =>{
    const counting = async() => {
        try{
                const response = await axios.get('testing');
                setData(response.data);
            }catch(error){
                    console.error('show me the error', error);
            }},[]});
       
        return (
            <div>
                <P>
                    {data}
                </P>
            </div>
        )
    };
