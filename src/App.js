import './Login';
import './App.css';
import './firstPage';
import './secoundPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './firstPage';
import Inside from './secoundPage';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';

//CSS------------------------------


function Homepage() {
  
  return (
    <Router>
       <div>
        <Routes>
          <Route path ="/" element = {<Register/>} />
          <Route path = "/Login" element = {<Login/>}/>
          <Route path ="/secoundPage" element = {<ProtectedRoute><Inside/></ProtectedRoute>}/>
        </Routes>
    </div>
    </Router>
  );
}

export default Homepage;
