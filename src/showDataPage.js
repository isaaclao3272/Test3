import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import StatesBar from './stateBar';
import Search from './search';

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
  display: flex;
  flex-direction: row;
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
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] =useState(1);
  const containerRef = useRef(null);
  const [switchPage, setswitchPage] = useState('showData');
  const timeOut = useRef(null);
  const isLoading = useRef(false);

  const loadData =  (endpoint, title, page) => {
    axios.get(`http://127.0.0.1:5000/${endpoint}?page=${page}`)
      .then((response) => {
        const newData = response.data.data;
      if (page === 1) {
        setHasMore(true);
        setColumnTitle(response.data.columnTitle);
        setData(newData);
      }else{
        setData((prev) => [...prev,...newData]);
      }
        setShowTable(true);
        setTitle(title);
        setswitchPage(endpoint);

      if (newData.length <50 ) setHasMore(false);
      isLoading.current = false;
      })
      .catch((error) => {
        console.error('error',error)
      })
    };

  const handleScroll = () => {
    if (!containerRef.current || !hasMore || isLoading.current) return ;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      if(timeOut.current) return;
      timeOut.current = setTimeout(() => {
      isLoading.current = true;
      setPage((prev) => prev +1 );
      timeOut.current = null;
      }, 1000);
    }
  };

  const handleSearch = ({data,columnTitle}) => {
    setColumnTitle(columnTitle);
    setData(data);
    setHasMore(false);
  };

  useEffect(()=>{
    if (page > 1){
    loadData(switchPage,title,page)
    }
  },[page]);

  useEffect(() => {
    loadData(switchPage,'All member',page)
  },[]);


  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore]);


  return (
    <MainContainer>
      <Top><StatesBar/></Top>
      <Body>
        <ButtonContainer>
          <StyleButton onClick={() => {loadData('showData', 'All member',1);setPage(1);}}>All Member</StyleButton>
          <StyleButton onClick={()=> {loadData('showEvent', 'All Event',1);setPage(1);}}>Event</StyleButton>
        </ButtonContainer>
        <DataContainer>
          <Title>
            <H1>
          <Search onSearch={handleSearch}></Search>
              <h3>{title}</h3>
            </H1>
          </Title>
          <Tablecontainer ref={containerRef}>
                {showTable && (
                  <TableElement>
                    <thead>
                      <tr>
                        {columnTitle && columnTitle.map((col, index) => (
                          <TableHeader key={index}>
                              {col}
                          </TableHeader>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data && data.map((row, rowIndex) => (
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
