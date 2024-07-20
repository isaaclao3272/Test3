import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const StyleButton = styled.button`
  margin: 20px 30px;
`;

const ScrollableContainer = styled.div`
  overflow-x: auto;
  height: 1080px;

`;

const TableHeader = styled.th`
  white-space: nowrap;
  width: 50px;
  border-collapse: collapse;
  border: 1px solid black;
  padding: 8px;
`;

const TableData = styled.td`
  white-space: nowrap;
  width: 50px;
  border-collapse: collapse;
  border: 1px solid black;
  padding: 8px;
  &:focus {
    outline: 2px solid blue;
  }
`;

const TableElement = styled.table`
  border-collapse: collapse;
  margin: 0 auto;
`;

//--------------------------------------------

const MemberShipTable = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [title, setTitle] = useState('');
  const [currentTable, setCurrentTable] = useState(''); // 新增狀態保存當前顯示的表格
  const [columnTitle, setColumnTitle]= useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' }); // 新增狀態來儲存排序配置


  const memberColumn = ['ID','中文姓名','出生日期(原)','年齡','身份證號碼','電話'];
  const eventColumn = ['ID','項目名稱','子項目名稱(如有)','參加者姓名','參加者會員編號','參與時數','開始日期','結束日期'];

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const loadData = (endpoint, tableTitle, tableName) => {
    axios.post(`http://127.0.0.1:5000/${endpoint}`)
      .then(response => {
        const data = response.data;
        if (data.length > 0 && endpoint ==='showData') {
            setColumnTitle(memberColumn);
            setData(data);
        } else if (data.length > 0 && endpoint ==='showEvent'){
            setColumnTitle(eventColumn);
            setData(data);
        }
        setShowTable(true);
        setTitle(tableTitle);
        setCurrentTable(tableName); // 設置當前顯示的表格
      })
      .catch(error => console.log(error));
  };

  const handleCellChange = (index, columnName, event) => {
    const updatedData = [...data];
    updatedData[index][columnName] = event.target.innerText;
    setData(updatedData);
  };

  const saveChange = () => {
    let endpoint = '';
    if (currentTable === 'member') {
      endpoint = 'updateMember';
    } else if (currentTable === 'event') {
      endpoint = 'updateEvent';
    }

    if (endpoint) {
      axios.put(`http://127.0.0.1:5000/${endpoint}`, { data })
        .then(response => {
          alert('Data updated successfully');
        })
        .catch(error => {
          alert('Failed to update');
          console.error('Save error', error);
        });
    } else {
      alert('Unknown table type, cannot save data.');
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleDeleteRow = (index) => {
      if (window.confirm("Are you sure you want to delete this row?")) {
        const updatedData = data.filter((_, i) => i !== index);
        setData(updatedData);
      };
    };

  const handleSort = (key) => {
      let direction = 'ascending';
      if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
      }
  
      const sortedData = [...data].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
  
      setSortConfig({ key, direction });
      setData(sortedData);
    };

  return (
    <div>
      <StyleButton onClick={toggleEdit}>
        {isEditable ? "可編輯" : "鎖定"}
      </StyleButton>
      <StyleButton onClick={saveChange}>Save</StyleButton>
      <br />
      <StyleButton onClick={() => loadData('showData', 'All Member', 'member')}>All Member</StyleButton>
      <StyleButton onClick={() => loadData('showEvent', 'All Event', 'event')}>All Event</StyleButton>
      {/* <StyleButton onClick={}>Check</StyleButton> */}
      <br />
      <StyleButton onClick={handleLogOut}>Logout</StyleButton>
      <ScrollableContainer>
        <h3>{title}</h3>
        {showTable && (
          <TableElement>
            <thead>
              <tr>
                {columnTitle.map((col, index) => (
                  <TableHeader key={index} onClick={() => handleSort(col)} >{col}</TableHeader>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    <TableData>
                    {isEditable && (
                      <button onClick={() => handleDeleteRow(rowIndex)}>刪除</button>
                      )}
                      {row[columnTitle[0]]}
                    </TableData>
                  {columnTitle.slice(1).map((col, colIndex) => (
                    <TableData
                      key={colIndex}
                      contentEditable={isEditable}
                      onBlur={(e) => handleCellChange(rowIndex, col, e)}
                      suppressContentEditableWarning={true}
                    >
                      {row[col]}
                    </TableData>
                  ))}
                </tr>
              ))}
            </tbody>
          </TableElement>
        )}
      </ScrollableContainer>
    </div>
  );
};

export default MemberShipTable;