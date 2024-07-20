import './Login';
import './App.css';
import './firstPage';
import './showDataPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './firstPage';
import Inside from './showDataPage';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import SelectPage from './selectPage';
import UploadPage from './uploadPage';

//CSS------------------------------


function Homepage() {
  
  return (
    <Router>
       <div>
        <Routes>
          <Route path ="/" element = {<Login/>} />
          <Route path = "/Register" element = {<Register/>}/>
          <Route path ="/showDataPage" element = {<ProtectedRoute><Inside/></ProtectedRoute>}/>
          <Route path ="/selectPage" element = {<SelectPage/>}/>
          <Route path ="/uploadPage" element = {<UploadPage/>}/>
        </Routes>
    </div>
    </Router>
  );
}

export default Homepage;
