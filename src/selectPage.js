import { click } from "@testing-library/user-event/dist/click";
import {React, useState} from "react";
import styled from "styled-components";
import StatesBar from "./stateBar";

const MainContiner = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`;

const Top = styled.div`
    flex: 0 1 50px;  // Fixed height of 100px
    background-color: #e9ecef;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Body = styled.div`
    flex: 1;
    display: flex;
    background-color: white;
    justify-content: center;
    align-items: center;
`;

const Bottom = styled.div`
    flex: 0 1 100px;
    background-color: white;
`;

const CenteredDiv = styled.div`
  display: grid;
  background-color:  #1687DA;
  padding: 20px;
  border-radius: 10px;
  border: 3px, solid black;
  height: 300px;
  width: 200px;
  grid-template-columns: 1fr;
  gap: 10px;
`;

const Button = styled.button
    `
    width:200px;
    height: 30px;
    `;

const SelectPage = () => 
{
    function toShowData () 
    {
        window.location.href = '/showDataPage';
    }
    function toUpload ()
    {
        window.location.href ='/uploadPage';
    }

    return(
        <MainContiner>
            <Top><StatesBar></StatesBar></Top>
            <Body>
                <CenteredDiv>
                    <Button onClick={toShowData}>ShowData</Button>
                    <Button onClick={toUpload} >Upload</Button>
                    <Button>Upcoming</Button>
                    <Button>Upcoming</Button>
                </CenteredDiv>
            </Body>
            <Bottom></Bottom>
        </MainContiner>
    )
}

export default SelectPage;