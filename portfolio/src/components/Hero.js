import React, { useEffect, useState, forwardRef } from "react";
import './Hero.css'; 

const messages = [
    "안녕하세요!! 웹 개발자 지망생입니다!",
    "새로운 것을 만드는걸 좋아해서",
    "항상 자기개발에 힘쓰며 성장하고 있습니다.",
    "저의 포트폴리오를 통해 더 많은 이야기를 나누고 싶습니다."
];

const Hero = forwardRef(({ className, onHide, onShow }, ref) => {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const handleScroll = (event) => {
            if (event.deltaY > 0) { // 마우스 휠이 아래로 움직일 때
                setFade(false); // 페이드 아웃 시작
                setTimeout(() => {
                    setIndex((prev) => {
                        const newIndex = prev + 1;
                        if (newIndex >= messages.length) {
                            setVisible(false);
                            setTimeout(onHide, 500);
                            return prev;
                        }
                        return newIndex;
                    });
                    setFade(true); // 페이드 인 시작
                }, 500); // 페이드 아웃 시간
            } else if (event.deltaY < 0) { // 마우스 휠이 위로 움직일 때
                if (!visible) {
                    setVisible(true);
                    setIndex(messages.length - 1);
                    setTimeout(onShow, 500);
                } else {
                    setFade(false); // 페이드 아웃 시작
                    setTimeout(() => {
                        setIndex((prev) => {
                            const newIndex = prev - 1;
                            if (newIndex < 0) {
                                return 0;
                            }
                            return newIndex;
                        });
                        setFade(true); // 페이드 인 시작
                    }, 500); // 페이드 아웃 시간
                }
            }
        };

        window.addEventListener('wheel', handleScroll);

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, [onHide, onShow, visible]);

    return (
        <section ref={ref} className={`hero ${className} ${visible ? 'visible' : 'hidden'}`}>
            <div className="hero-content">
                <h1 className={`fade ${fade ? 'fade-in' : 'fade-out'}`}>{messages[index]}</h1>
                <p>- 이 승 재 -</p>
            </div>
        </section>
    );
});

export default Hero;
