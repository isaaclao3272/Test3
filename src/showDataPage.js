import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import StatesBar from './stateBar';

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
  const [title, setTitle] = useState('');
  const [columnTitle, setColumnTitle] = useState([]);

  const loadData = () => {
    axios.get(`http://127.0.0.1:5000/showData`)
      .then((response) => {
        setColumnTitle(response.data.columnTitle);
        setData(response.data.data);
        setShowTable(true)
      })};

  return (
    <MainContainer>
      <Top><StatesBar /></Top>
      <Body>
        <ButtonContainer>
          <StyleButton onClick={() => loadData()}>All Member</StyleButton>
        </ButtonContainer>
        <DataContainer>
          <Title>
            <H1>
              <h3>{title}</h3>
            </H1>
          </Title>
          <Tablecontainer>
                {showTable && (
                  <TableElement>
                    <thead>
                      <tr>
                        {columnTitle.map((col, index) => (
                          <TableHeader key={index}>
                              {col}
                          </TableHeader>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {columnTitle.map((col,index) => (
                          <TableData key={index}>
                            {row[col]}
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
