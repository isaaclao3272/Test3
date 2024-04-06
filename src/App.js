import logo from './logo.svg';
import './App.css';
import './firstPage'
import './firstPage';
import './secoundPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './firstPage';
import Inside from './secoundPage';

//CSS------------------------------


function Homepage() {
  
  return (
    <Router>
       <div>
        <Routes>
          <Route path ="/" exeact element = {<Register/>} />
           <Route path ="/secoundPage" element = {<Inside/>}/>
        </Routes>
    </div>
    </Router>
  );
}

export default Homepage;
