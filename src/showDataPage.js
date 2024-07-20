import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import StatesBar from './stateBar';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Top = styled.div`
  flex: 0 1 50px;  
  background-color: #e9ecef;
  padding: 0 20px;
  display: flex;
  align-items: center;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  background-color: white;
  flex-direction: column;
  overflow: hidden;
`;

const ButtonContainer = styled.div`
  flex: 0.15;
  display: flex;
  align-items: center;
  margin-left: 30px;
`;

const DataContainer = styled.div`
  flex: 1;
  display: flex;
  text-align: center;
  flex-direction: column;
  overflow-x: auto;
  border: 3px solid black;
  margin: 0px 50px;
  border-top-left-radius: 35px;
  border-top-right-radius: 35px;
  background-color: #D9D9D9;
`;

const Bottom = styled.div`
  flex: 0 1 100px;
  background-color: lightblue;
`;

const StyleButton = styled.button`
  margin: 20px 30px;
`;

const TableHeader = styled.th`
  white-space: nowrap;
  width: 50px;
  border-collapse: collapse;
  border: 1px solid black;
  padding: 8px;
  height: 40px;
  background-color: #30B6D3;
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
  width:90%;
  background-color: white;
`;

const MemberShipTable = () => {
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [title, setTitle] = useState('');
  const [currentTable, setCurrentTable] = useState('');
  const [columnTitle, setColumnTitle] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });

  const memberColumn = ['ID', '中文姓名', '出生日期(原)', '年齡', '身份證號碼', '電話', '會員類形'];
  const eventColumn = ['項目名稱', '子項目名稱', '項目負責人', '錄入者', '參加者姓名', '家長姓名', '參加者會員編號', '參與時數', '開始日期', '結束日期', '參加者電話'];
  const analysedColumn = ['ID','中文姓名','年齡', '參加場數', '總參加時數', '是否會員'];

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const loadData = (endpoint, tableTitle, tableName) => {
    axios.post(`http://127.0.0.1:5000/${endpoint}`)
      .then(response => {
        const data = response.data;
        if (data.length > 0 && endpoint === 'showData') {
          setColumnTitle(memberColumn);
          setData(data);
        } else if (data.length > 0 && endpoint === 'showEvent') {
          setColumnTitle(eventColumn);
          setData(data);
        }
        setShowTable(true);
        setTitle(tableTitle);
        setCurrentTable(tableName);
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    loadData('showData', 'All Member', 'member');
  }, []);

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

  const handleDeleteRow = (index) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      const updatedData = data.filter((_, i) => i !== index);
      setData(updatedData);
    }
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

  const loadAnalysedData = () => {
    axios.all([
      axios.post('http://127.0.0.1:5000/showData'),
      axios.post('http://127.0.0.1:5000/showEvent')
    ])
    .then(axios.spread((memberResponse, eventResponse) => {
      const members = memberResponse.data;
      const events = eventResponse.data;

      // Create a map for quick lookup of membership status and type
      const memberMap = new Map(members.map(member => [member['中文姓名'], { isMember: true, type: member['會員類形'],id:member['ID'],age:member['年齡']}]));

      // Aggregate data
      const aggregatedData = events.reduce((acc, event) => {
        const name = event['參加者姓名'];
        const phoneNumber = event['參加者電話'];
        const key = `${name}-${phoneNumber}`;
        const hours = parseFloat(event['參與時數']) || 0;
        const sequence = parseFloat(event['參與場數']) || 0;
        const volunteer = event['是否工作人員/志願者'];

        if (!acc[name]) {
          const memberInfo = memberMap.get(name);
          acc[name] = { 
            'ID': memberInfo ? memberInfo.id :'',
            '中文姓名': name,
            '年齡': memberInfo? memberInfo.age : "/", 
            '參加場數': 0, 
            '總參加時數': 0, 
            '是否會員': memberInfo ? 'Y' : 'N',
            '會員類型': memberInfo ? memberInfo.type : '',
            '是否工作人員/志願者': volunteer,
            '曾參與的項目':[]
          };
        }

        acc[name]['參加場數'] += sequence;
        acc[name]['總參加時數'] += hours;
        acc[name]['曾參與的項目'].push(event['子項目名稱'])


        return acc;
      }, {});

      // Convert aggregated data to array
      const analysedData = Object.values(aggregatedData).map(item => ({
        ...item,
        '曾參與的項目': item['曾參與的項目'].join(', ')  // Join the event names with a comma and space
      }));
      console.log(analysedData)
      // Update column titles to include the new column
      const updatedAnalysedColumn = [...analysedColumn, '會員類型', '是否工作人員/志願者','曾參與的項目'];

      setColumnTitle(updatedAnalysedColumn);
      setData(analysedData);
      setShowTable(true);
      setTitle('Analysed Data');
      setCurrentTable('analysed');
    }))
    .catch(error => console.log(error));
  };
  const downloadAnalyse = () => {
    // Generate a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(data);
    // Generate a workbook with the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analysed Data');
    // Write the workbook and download it
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'analysed_data.xlsx');
  };

  const downloadExcel = () => {
    axios({
      url: 'http://127.0.0.1:5000/download_excel',
      method: 'GET',
      responseType: 'blob',
    })
    .then((response) => {
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'event_records.xlsx');
    })
    .catch((error) => {
      console.error('There was an error downloading the Excel file!', error);
    });
  };

  return (
    <MainContainer>
      <Top><StatesBar /></Top>
      <Body>
        <ButtonContainer>
          <StyleButton onClick={toggleEdit}>
            {isEditable ? "可編輯" : "鎖定"}
          </StyleButton>
          <StyleButton onClick={saveChange}>Save</StyleButton>
          <StyleButton onClick={() => loadData('showData', 'All Member', 'member')}>All Member</StyleButton>
          <StyleButton onClick={() => loadData('showEvent', 'All Event', 'event')}>All Event</StyleButton>
          <StyleButton onClick={loadAnalysedData}>test</StyleButton>
          <StyleButton onClick={downloadExcel}>DL</StyleButton>
          <StyleButton onClick={downloadAnalyse}>Dl2</StyleButton>
        </ButtonContainer>
        <DataContainer>
          <h3>{title}</h3>
          {showTable && (
            <TableElement>
              <thead>
                <tr>
                  {columnTitle.map((col, index) => (
                    <TableHeader key={index} onClick={() => handleSort(col)}>{col}</TableHeader>
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
        </DataContainer>
      </Body>
    </MainContainer>
  );
};

export default MemberShipTable;
