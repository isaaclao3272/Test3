import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import StatesBar from './stateBar';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Filter from './headerFilter';

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
  flex: 2;
  display: flex;
  background-color: white;
  flex-direction: column;
  overflow-y: hidden;
`;

const ButtonContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0 20px;
`;

const DataContainer = styled.div`
  flex: 1;
  display: flex;
  text-align: center;
  flex-direction: column;
  margin: 0px 20px;
  border: 5px solid black;
  border-top-left-radius: 35px;
  border-top-right-radius: 35px;
  background-color: #D9D9D9;
  align-items: center;
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
  border-top: 3px solid black;
  border-bottom: 2px solid black;
  border-left: 1.5px solid black;
  border-right: 1.5px solid black;
  padding: 8px;
  height: 40px;
  background-color: #30B6D3;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const TableData = styled.td`
  white-space: normal;
  width: 50px;
  border: 1px solid black;
  padding: 5px 2px 5px 2px;
  &:focus {
    outline: 2px solid blue;
  };
`;

const Title = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grip-gap: 30px;
`;

const H1 = styled.div`
  text-align: center;
  grid-column: 2;
`;
const H2 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0px 0px 10px 0px;
`;
const HeaderFilter = styled.div`
  grid-column: 3;
  align-self: end;
  padding: 10px;
`;

const Tablecontainer = styled.div`
  white-space: normal;
  width: 95%;
  align-items: center;
  overflow: auto;
  height: 100vh;
  border-left: 1px solid black;
  border-right: 1px solid black;
`;

const TableElement = styled.table`
  align-items: center;
  margin: 0 auto;
  width:100%;
  background-color: white;
  table-layout: auto;
  border-spacing: 0;
  border-collapse: separate;
`;

//----------------------------------------------

const FilterBox = styled.div`
  position: 'fixed',
  width: '300px',
  height: '300px',
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  borderRadius: '5px',
  padding: '20px',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
`;



//----------------------------------------------
const MemberShipTable = () => {
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [title, setTitle] = useState('');
  const [currentTable, setCurrentTable] = useState('');
  const [columnTitle, setColumnTitle] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });

  const [memberColumn, setmemberColumn] = useState([{name:'ID', visible: true}, {name:'中文姓名', visible: true}, {name:'出生日期(原)', visible: true}, {name:'年齡', visible: true}, {name:'身份證號碼', visible: true}, {name:'電話', visible: true}, {name:'會員類形', visible: true}]);
  const [eventColumn, seteventColumn] = useState([{name:'參加者會員編號', visible: true}, {name:'項目名稱', visible: true}, {name:'子項目名稱', visible: true}, {name:'錄入者', visible: true},{name:'參加者姓名', visible: true},{name:'家長姓名', visible: true},{name:'參與時數', visible: true},{name:'參與場數', visible: true},{name:'開始日期', visible: true},{name:'結束日期', visible: true},{name:'參加者電話', visible: true}]);
  const [analysedColumn, setanalyseColumn] = useState([{name:'ID', visible: true},{name:'中文姓名', visible: true},{name:'年齡', visible: true},{name:'參加場數', visible: true},{name:'總參加時數', visible: true}]);
  const[updatedAnalysedColumn, setupdatedAnalysedColumn] = useState([{name:'ID', visible: true},{name:'中文姓名', visible: true},{name:'年齡', visible: true},{name:'參加場數', visible: true},{name:'總參加時數', visible: true}, {name:'會員類型',visible:true}, {name:'是否工作人員/志願者',visible:true},{name:'曾參與的項目',visible:true}]);

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
      const memberMap = new Map(members.map(member => [member['ID'], { isMember: true, type: member['會員類形'],name: member['中文姓名'], id:member['ID'], age:member['年齡']}]));

      // Aggregate data
      const aggregatedData = events.reduce((acc, event) => {
        const name = event['參加者姓名'];
        const memberID = event['參加者會員編號']
        const phoneNumber = event['參加者電話'];
        const uniqueKey = memberID || `${name}-${phoneNumber}`;
        const hours = parseFloat(event['參與時數']) || 0;
        const sequence = parseFloat(event['參與場數']) || 0;
        const volunteer = event['是否工作人員/志願者'];

        if (!acc[uniqueKey]) {
          const memberInfo = memberMap.get(memberID);

          acc[uniqueKey] = { 
            'ID': memberID || 'N/A',
            '中文姓名': name,
            '年齡': memberInfo ? memberInfo.age : "N/A",
            '參加場數': 0, 
            '總參加時數': 0, 
            '會員類型': memberInfo ? memberInfo.type : '',
            '是否工作人員/志願者': volunteer,
            '曾參與的項目':[]
          };
        }

        acc[uniqueKey]['參加場數'] += sequence;
        acc[uniqueKey]['總參加時數'] += hours;
        acc[uniqueKey]['曾參與的項目'].push(event['子項目名稱']);


        return acc;
      }, {});

      // Convert aggregated data to array
      const analysedData = Object.values(aggregatedData).map(item => ({
        ...item,
        '曾參與的項目': item['曾參與的項目'].join(', ')  // Join the event names with a comma and space
      }));
      // Update column titles to include the new column
      
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
  const updateFilterChange = (newUpdate) => {
    if (columnTitle == memberColumn) {
      setmemberColumn(newUpdate)}
    else if (columnTitle == eventColumn) {
      seteventColumn(newUpdate)}
    else {
      setupdatedAnalysedColumn(newUpdate)
    }
    
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
          <Title>
            <H1>
              <h3>{title}</h3>
            </H1>
            <HeaderFilter>
            <Filter header={columnTitle} updateChange = {updateFilterChange}></Filter>
            </HeaderFilter>
          </Title>
          <Tablecontainer>
                {showTable && (
                  <TableElement>
                    <thead>
                      <tr>
                        {columnTitle.map((col, index) => (
                          col.visible && (
                          <TableHeader key={index} onClick={() => handleSort(col.name)}>
                              {col.name}
                          </TableHeader>
                        )))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <TableData>
                            {isEditable && (
                              <button onClick={() => handleDeleteRow(rowIndex)}>刪除</button>
                            )}
                            {row[columnTitle[0].name]}
                          </TableData>
                          {columnTitle.slice(1).map((col, colIndex) => (
                            <TableData
                              key={colIndex}
                              contentEditable={isEditable}
                              onBlur={(e) => handleCellChange(rowIndex, col, e)}
                              suppressContentEditableWarning={true}
                              >
                              {row[col.name]}
                            </TableData>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                </TableElement>
            )}
          </Tablecontainer>
        </DataContainer>
      </Body>
    </MainContainer>
  );
};

export default MemberShipTable;
