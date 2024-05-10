import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Stylebutton = styled.button`
    margin: 20px 30px;
`;

const ScrollAbleContainer = styled.div`
    overflow-x: auto;
    height: 1080px;
`;

const TableH = styled.th`
    white-space: nowrap;
    width: 100%;
    border-collapse: collapse;
    border: 1px solid black;
    padding: 8px;
    `;

const TableD = styled.td`
    white-space: nowrap;
    width: 100%;
    border-collapse: collapse;
    border: 1px solid black;
    padding: 8px;
    &: focus {
        outline: 2px solid blue;
    };
    `;



const TableE = styled.table`
    border-collapse: collapse;
    `;

const EventRecordTable = () => {
    const [data, setData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [error, setError] = useState('');
    const columnOrder = ['ID','會員姓名','會員電話','活動名稱','活動類型','活動日期','是否出席'];

    const loadData2 = () => {
        axios.post('http://127.0.0.1:5000/showEvent',data)
        .then(Response => {
            setShowTable(true);
            setData(Response.data);
            setError('');
        })
        .catch(error => {
            console.log('Error' ,error);
            setError('Failed to load data.');
        });
    };
    return (
        <div>
            <ScrollAbleContainer>
                <Stylebutton onClick={loadData2}>All event</Stylebutton>
                    {showTable && data.length > 0 ? (
                        <TableE>
                            <thead>
                                <tr>
                                    {columnOrder.map((conlumnName) =>(
                                      <TableH key={conlumnName}>{conlumnName}</TableH>))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row,index) =>
                                (<tr key={index}> 
                                     {columnOrder.map((conlumnName, colindex) => (
                                    <TableD key={colindex}>
                                        {row[conlumnName]}
                                    </TableD>
                                     ))}
                                </tr>
                                     ))}
                            </tbody>
                        </TableE>
                        
                    ): 
                    (<p></p>)
                    }
            </ScrollAbleContainer>
        </div>
    )
}

export default EventRecordTable;