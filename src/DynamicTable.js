import React, {useEffect,useState} from 'react'
import axios from 'axios'
import styled from 'styled-components'

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

//--------------------------------------------



const DynamicTable = () => {
    const [data, setData] = useState([]);
    const [showTable, setShowTable] = useState(false)
    const columnOrder = [
        'ID','中文姓名','外文姓名','性別','電話','備註','出生日期(原)','年齡','身份證號碼',
        '回鄉證號碼','任職公司(原)','任職公司(S)','會員類形','家屬姓名','家屬電話','職業',
        '職位','員工號碼','願意收取訊息','入會日期(月/日/年)','資料更新日期','會員來源']
    const [isEditable, setIsEditable] = useState(false); // 初始状态为 false，表示表格不可编辑

    const toggleEdit = () => {
        setIsEditable(!isEditable)
    };

    const loadData = () => {
        axios.post('http://127.0.0.1:5000/showData')
        .then(response => {
            setData(response.data);
            setShowTable(true)
        })
        .catch(error => console.log(error));
        };

    const handleCellChange = (index, columnname, event) => {
        const updatedData = [...data];
        updatedData[index][columnname] = event.target.innerText;
        setData(updatedData);
      };  
      
    const SaveChange = () => {
        axios.put('http://127.0.0.1:5000/updateCell', {data: data})
        .then(response => {
            alert('Data update successfully')
        })
        .catch(error =>{
            alert('fail to update');
            console.error('save error',error)
            })};

    const handleLogOut = () =>{
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <div>
            <Stylebutton onClick={toggleEdit}> {isEditable ? "鎖定" : "可編輯"} </Stylebutton>
            <Stylebutton onClick={SaveChange}>Save</Stylebutton>
            <Stylebutton onClick={loadData}>All member</Stylebutton>
            <br></br>
            <Stylebutton onClick={handleLogOut}>check</Stylebutton>
            <ScrollAbleContainer>
                {showTable && data.length > 0 ? (
                    <TableE>
                        <thead>
                            <tr>
                                {columnOrder.map((columnname) => (
                                    <TableH key={columnname}>{columnname}</TableH>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key = {index}>
                                    {columnOrder.map((columnname, colindex) => (
                                        <TableD key= {colindex}
                                        contentEditable = {isEditable}
                                        onBlur={(e)=> handleCellChange(index, columnname, e)}
                                        suppressContentEditableWarning={true}
                                        >
                                            {row[columnname]}
                                        </TableD>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </TableE>
                ):(
                    <p></p>
                )
                }
            </ScrollAbleContainer>
        </div>
    )
}

export default DynamicTable;