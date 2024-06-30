import axios from 'axios';
import React, { useEffect, useState } from 'react';
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

// const ConditionTable = () =>{
// const [memberData, setMemberData] = useState(null)

// useEffect(() => {

//   const loadData =  async =>{
//   try{
//     const response = await.axios.get('http://127.0.0.1:5000/condition');
//     setMemberData(response.data);
//     console.log(memberData)
//   } catch(error) {
//     console.error('Error fetching data:', error);
//   }   
// }, []})
// };

// export default ConditionTable