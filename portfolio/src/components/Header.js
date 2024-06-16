import React from "react";
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ setHeroVisible }) => {
    const navigate = useNavigate();

    // 스크롤을 수행하는 함수 정의
    const scrollToSection = (sectionId) => {
        const section = document.querySelector(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleHomeClick = (event) => {
        event.preventDefault();
        setHeroVisible(true); // Hero 컴포넌트를 보이도록 상태 업데이트
        navigate("/");
        //scrollToSection('.hero'); // Hero 컴포넌트가 있는 섹션으로 이동
    };

    const handleAboutClick = (event) =>{
        event.preventDefault();
        navigate("/", {replace : true});
        setTimeout(() => scrollToSection('#home-section'), 0);
    }
    const handleProjectsClick = (event) =>{
        event.preventDefault();
        navigate("/", {replace : true});
        setTimeout(() => scrollToSection('#projects-section'), 0);
    }

    return (
        <header className="header">
            <nav>
                 {/* Home 링크 만들기 */}
                 <a href="/" onClick={handleHomeClick}>Home</a>
                {/* About 링크 만들기 */}
                <a href="#home-section" onClick={handleAboutClick}>About</a>
                <a href="#projects-section" onClick={handleProjectsClick}>Projects</a>
            </nav>
        </header>
    );
};

export default Header;
