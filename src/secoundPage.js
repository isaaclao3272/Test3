import React, {useEffect,useState} from 'react';
import axios from 'axios';
import styled from "styled-components";
import './DynamicTable';
import DynamicTable from './DynamicTable';


const BackgroundDiv = styled.div`
  text-align: center;
  background: #C6EBC5;
  width: 100%;
  width: 100%;
  margin: -20px auto;
`;


function UploadExcel() {
    const [file, setFile] = useState(null);
  
    function handleFileChange(event) {
      setFile(event.target.files[0]); // 設定選擇的文件
    }
  
    function handleUploadClick() {
      if (!file) {
        alert('請選擇一個文件！');
        return;
      }
  
      const formData = new FormData();
      formData.append('excelFile', file); // 'excelFile' 是後端預期的字段名
  
      axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        alert('文件上傳成功！');
      })
      .catch(error => {
        alert('文件上傳失敗！');
        console.error('Upload error:', error);
      });
    }
  
    return (
      <div>
        <input type="file" onChange={handleFileChange} accept=".xls,.xlsx" />
        <button onClick={handleUploadClick}>上傳會員表格</button>
      </div>
    );
  }

function Inside() {
    const [message, setMessage] = useState()
    useEffect(() => {
      axios.get("http://127.0.0.1:5000")
      .then(response => {
          setMessage(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    }, []);
  
    return (
         <div>
        <BackgroundDiv>
          <p>{message}</p>
          <UploadExcel/>
          <DynamicTable/>
        </BackgroundDiv>
      </div>
    );
  }

  export default Inside;