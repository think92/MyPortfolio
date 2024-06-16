import React from "react";
import { useNavigate } from "react-router-dom";
import './Projects.css';

const Projects = () => {
    const navigate = useNavigate();

    const handleProjectClick = () => {
        navigate("/mainbody");
    }
    const handleEditorClick = () => {
        navigate("/editor");
    }

    const handleCustomerClick = () => {
        navigate("/customer");
    }

    const handleAdminClick = () => {
        navigate("/admin");
    }

    return (
        <div className="projects-section">
            <h2>AI를 통한 자동 모자이크 서비스</h2>
            <p>프로젝트 기간 : 2024.05.01 ~ 2024.05.30</p>
            <p>깃 주소 : <a href="https://github.com/think92/Lproject">https://github.com/think92/Lproject</a></p>
            <div className="project-list">
                <div className="project-item" onClick={handleProjectClick}>
                    <img src={require("./images/mainbody.png")} alt="Project 1" />
                    <p>홈페이지 기능 설명 페이지</p>
                </div>
                <div className="project-item" onClick={handleEditorClick}>
                <img src={require("./images/editor.png")} alt="Project 2" />
                    <p>파일 편집 페이지</p>
                </div>
                <div className="project-item" onClick={handleCustomerClick}>
                <img src={require("./images/customer1.png")} alt="Project 3" />
                    <p>고객센터 페이지</p>
                </div>
                <div className="project-item" onClick={handleAdminClick}>
                <img src={require("./images/admin.png")} alt="Project 4" />
                    <p>관리자 페이지</p>
                </div>
                <div className="project-item">
                <video width="240" height="120" controls>
                    <source src={require("./images/video.mp4")} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                    <p>프로젝트 시연 영상</p>
                </div>
            </div>
        </div>
    );
};

export default Projects;
