import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";

const HeaderFilter = styled.button`
  height: 30px;
  width: 40px;
`;
const PopupAera = styled.div`
box-shadow: 0px 4px 6px rgba(0, 0, 3, 2);
width: 300px;
height: 400px;
background-color: white;
position: fixed;
z-index: 2;
top:${(props) => props.top + 35}px;
left: ${(props) => props.left -110}px;
`;

const DataContainer = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, 1fr));
gap: 10px;
justify-items: start;
padding: 20px;
overflow: auto;
`;


const Filter =  ({header, updateChange}) => {
    const [isPopUp, setPopUp] = useState(false);
    const[position, setPosition] = useState({top: 0 , left: 0})
    const buttonRef = useRef(null);

    const HandlePopup = () => {
        const button = buttonRef.current
            
        if (button) {
            const rect = button.getBoundingClientRect()
            setPosition({
                top: rect.top,
                left: rect.left,
            });
            setPopUp((prev) => !prev)
        }};
    
    const handleCheck = (index) => {
        const newUpdate = header.map((title, i)=>
             i === index ? {...title, visible: !title.visible} : title
        );
        updateChange(newUpdate);
    };

    return (
        <div>
            <HeaderFilter ref={buttonRef} onClick={HandlePopup}>
                filter
            </HeaderFilter>
            {isPopUp && (
                <PopupAera top = {position.top} left = {position.left}>
                    <DataContainer>
                    {header.map((head, index) => (
                        <label key= {index}>
                            <input type= "checkbox"  defaultChecked={head.visible? true: false} onChange={() => handleCheck(index)}/>
                            {head.name}
                            </label>
                    ))}
                    </DataContainer>
                </PopupAera>
            )}
        </div>
    );

};

export default Filter ;