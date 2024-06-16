import React from "react";
import './About.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCakeCandles, faEnvelope, faHouse, faUser } from "@fortawesome/free-solid-svg-icons";

const About = () => {
    return (
        <div className="about-section">
            <h1>About Me</h1>
            <div className="introduce">
                <div className="profile">
                    <img src="/profile.jpg" alt="Profile" className="profile-img" />
                </div>
                <div className="my-introduce">
                    <div className="info-item">
                        <FontAwesomeIcon icon={faUser} className="icon" />
                        <p>이승재</p>
                    </div>
                    <div className="info-item">
                        <FontAwesomeIcon icon={faCakeCandles} className="icon" />
                        <p>1992.08.18</p>
                    </div>
                    <div className="info-item">
                        <FontAwesomeIcon icon={faHouse} className="icon" />
                        <p>광주광역시 서구</p>
                    </div>
                    <div className="info-item">
                        <FontAwesomeIcon icon={faEnvelope} className="icon" />
                        <p>think920818@naver.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
