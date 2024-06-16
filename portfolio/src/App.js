import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import MainBody from './pages/P1/MainBody'; // MainBody 컴포넌트 임포트
import Editor from './pages/P1/Editor';
import Customer from './pages/P1/Customer';
import Admin from './pages/P1/AdminMain'
import AdminInquiry from './pages/P1/AdminInquiry'
import AdminUser from './pages/P1/AdminUser'



const App = () => {
    const [heroVisible, setHeroVisible] = useState(true);

    return (
        <Router>
             <Header setHeroVisible={setHeroVisible} /> {/* Header에 setHeroVisible 전달 */}
            <Routes>
                <Route path="/" element={<Home heroVisible={heroVisible} setHeroVisible={setHeroVisible} />} />
                <Route path="/mainbody" element={<MainBody />} /> {/* MainBody 컴포넌트를 위한 라우트 추가 */}
                {/* 다른 경로들 */}
                <Route path="/editor" element={<Editor />} /> 
                <Route path="/customer" element={<Customer />} /> 
                <Route path="/admin" element={<Admin/>} />
                <Route path="/AdminInquiry" element={<AdminInquiry/>} />
                <Route path="/AdminUser" element={<AdminUser/>} />
            </Routes>
        </Router>
    );
};

export default App;
