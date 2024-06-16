import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import './Home.css';
import About from "./About";
import Skill from "./Skill";
import Projects from "./Projects";

const Home = ({ heroVisible, setHeroVisible }) => {
    const [isHeroVisible, setIsHeroVisible] = useState(heroVisible);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        setIsHeroVisible(heroVisible);
    }, [heroVisible]);

    const handleHideHero = () => {
        setIsFading(true);
        setTimeout(() => {
            setIsHeroVisible(false);
            setHeroVisible(false);
            setTimeout(() => {
                setIsFading(false);
            }, 500);
        }, 500); // 밝아졌다가 어두워지는 시간
    };

    const handleShowHero = () => {
        setIsHeroVisible(true);
        setHeroVisible(true);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        const handleScroll = () => {
            clearTimeout(window.scrollTimeout);
            window.scrollTimeout = setTimeout(() => {
                setIsFading(false);
            }, 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [heroVisible]);

    return (
        <div className={`home-container ${isFading ? 'fading' : ''}`}>
            {isHeroVisible && (
                <Hero
                    className="hero"
                    onHide={handleHideHero}
                    onShow={handleShowHero}
                />
            )}
            <section id="home-section" className={`home-section ${isHeroVisible ? 'hidden' : 'visible'}`}>
                <div className={`about-wrapper ${isHeroVisible ? 'fade-out' : 'fade-in'}`}>
                    <About />
                </div>
                <div className={`skill-wrapper ${isHeroVisible ? 'fade-out' : 'fade-in'}`}>
                    <Skill isVisible={!isHeroVisible} />
                </div>
            </section>
            <section id="projects-section" className="home-section">
                <div className="projects-wrapper">
                    <h1 className="projects-title">Projects</h1>
                    <Projects />
                </div>
            </section>
        </div>
    );
};

export default Home;
