import React ,{useState}from "react";
import axios from "axios";
import styled from "styled-components";

const MainContainer = styled.div`
display: flex;
flex-direction: row;
gap: 10px;
`;


const Search = ({onSearch}) => {
    const [con1, setCon1] = useState('')
    const [con2, setCon2] = useState('')
    const [table, setTable]=useState('members2')

    const conditionalSeacher = async(table,con1,con2) => {
       try{
        const response = await axios.post(`http://127.0.0.1:5000/Search?Table=${table}&Title=${con1}&Data=${con2}`)
            const data = response.data.data;
            const columnTitle = response.data.columnTitle;
            onSearch({'data':data, 'columnTitle':columnTitle});
       } catch (error){ 
        console.error("Error fetching data:", error);
    }
    };

    const handleSummit = async(e) => {
        e.preventDefault();
        await conditionalSeacher(table,con1,con2);
    };

    return (
        <div>
            <form onSubmit={handleSummit}>
                <MainContainer>
                    <div>        
                        <label htmlFor="Title">請輸入表頭</label>
                        <br></br>
                        <input
                        id="Title" 
                        type="text"
                        placeholder="Title"
                        value={con1}
                        onChange={(e) => setCon1(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="Data">請輸入內容</label>
                        <br></br>
                        <input 
                        type="text"
                        id="Data"
                        placeholder="Data"
                        value={con2}
                        onChange={(e) => setCon2(e.target.value)}
                        />
                    </div>
                    <button type="summit">submit</button>
                </MainContainer>
            </form>
        </div>
    );
};

export default Search;