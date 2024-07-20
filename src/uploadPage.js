import React, {useEffect,useState} from 'react';
import axios from 'axios';
import styled from "styled-components";
import './MemberShipTable';

const MainDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: white;
`;
const ChildDiv = styled.div`
    display: grid;
    width: 300px;
    height: 200px;
    border: 2px solid black;
    text-align: center;
`;
// upload excel

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
  };

//Upload Event~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const UploadEvent = () => {
  const [file, setFile] = useState(null);
  
  function chooseFile (event) {
    setFile(event.target.files[0]);
  }
  function uploadClick () {
     if(!file) {
      return alert('Please choose a file');
     }

     const formData = new FormData();
     formData.append('excelFile',file);

     axios.post("http://127.0.0.1:5000/uploadEvent", formData,{
      headers:{
        "Content-Type" : 'multipart/form-data'
      }
     } )
     .then(response => {
      alert('upload successful');
     })
     .catch(error => {
      alert('fail to upload');
      console.error('upload error',error);
     });
  }
  return (
    <div>
      <input type='file' onChange={chooseFile} accept='.xls,.xlsx'/>
      <button onClick={uploadClick}>上傳簽到表</button>
    </div>
  )
};

const UploadPage = () => {
    return(
        <MainDiv>
            <ChildDiv>
                <UploadExcel></UploadExcel>
                <UploadEvent></UploadEvent>
            </ChildDiv>
        </MainDiv>
    )
};

export default UploadPage;