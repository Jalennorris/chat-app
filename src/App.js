import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import  Login  from "./Components/Authentication/Login/Login";
import Register from "./Components/Authentication/Register";
import ChatRoom from "./Components/Chat/chatRoom";
import NotFound from "./Components/Naviagtion/NotFound";
import Settings from "./Components/setting";




function App() {
  



  return (
   
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/chat" element={<ChatRoom/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </Router>
  );
}

export default App;

